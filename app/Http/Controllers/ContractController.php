<?php

namespace App\Http\Controllers;

use App\Models\Contrat;
use App\Models\Property;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PDF;

class ContractController extends Controller
{
    public function index()
    {
        $contrats = Contrat::with(['property', 'owner', 'client'])
            ->where('client_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($contrats);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'type' => 'required|in:rent,sale',
            'start_date' => 'required_if:type,rent|date',
            'end_date' => 'nullable|date|after:start_date',
            'price' => 'required|numeric|min:0',
            'payment_terms' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $property = Property::with('owner')->findOrFail($validated['property_id']);

        if (!$property->owner_id) {
            return response()->json(['message' => 'Property owner not found'], 404);
        }

        // Always use owner_id = 1 for every contract
        $contrat = Contrat::create([
            'property_id' => $validated['property_id'],
            'owner_id' => 1,
            'client_id' => auth()->id(),
            'type' => $validated['type'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'total_amount' => $validated['price'],
            'conditions' => $validated['payment_terms'],
            'description' => $validated['description'],
            'contract_number' => 'CNT-' . strtoupper(Str::random(8)),
            'status' => 'active',
            'document_path' => 'contracts/default.pdf',
        ]);

        return response()->json($contrat, 201);
    }

    public function show(Contrat $contrat)
    {
        $contrat->load(['property', 'owner', 'client']);
        return response()->json($contrat);
    }

    public function generatePDF(Contrat $contrat)
    {
        $contrat->load(['property', 'owner', 'client']);
        
        $pdf = PDF::loadView('contracts.pdf', [
            'contract' => $contrat
        ]);

        return $pdf->download("contrat-{$contrat->contract_number}.pdf");
    }

    public function transactions(Contrat $contrat)
    {
        $transactions = $contrat->transactions()
            ->latest()
            ->get();

        return response()->json($transactions);
    }

    public function storeTransaction(Request $request, Contrat $contrat)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $transaction = $contrat->transactions()->create([
            'amount' => $validated['amount'],
            'payment_date' => $validated['payment_date'],
            'payment_method' => $validated['payment_method'],
            'notes' => $validated['notes'],
            'reference_number' => 'TRX-' . strtoupper(Str::random(8)),
            'status' => 'completed',
        ]);

        return response()->json($transaction, 201);
    }

    public function ownerContracts()
    {
        $contrats = Contrat::with(['property', 'client'])
            ->where('owner_id', auth()->user()->owner->id)
            ->latest()
            ->get();

        return response()->json(['data' => $contrats]);
    }

    public function approveContract(Contrat $contrat)
    {
        if ($contrat->owner_id !== auth()->user()->owner->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($contrat->status !== 'pending') {
            return response()->json(['message' => 'Contract is not in pending status'], 400);
        }

        $contrat->update([
            'status' => 'approved'
        ]);

        return response()->json(['message' => 'Contract approved successfully']);
    }

    public function rejectContract(Contrat $contrat)
    {
        if ($contrat->owner_id !== auth()->user()->owner->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($contrat->status !== 'pending') {
            return response()->json(['message' => 'Contract is not in pending status'], 400);
        }

        $contrat->update([
            'status' => 'rejected'
        ]);

        return response()->json(['message' => 'Contract rejected successfully']);
    }

    public function destroy(Contrat $contrat)
    {
        // Only the client who owns the contract can delete it
        if ($contrat->client_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $contrat->delete();
        return response()->json(['message' => 'Contract deleted successfully.']);
    }

    public function update(Request $request, Contrat $contrat)
    {
        // Only the client who owns the contract can update it
        if ($contrat->client_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $validated = $request->validate([
            'type' => 'in:rent,sale',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'total_amount' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
        ]);
        $contrat->update($validated);
        return response()->json($contrat);
    }
} 