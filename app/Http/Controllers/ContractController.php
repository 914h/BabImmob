<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Property;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PDF;

class ContractController extends Controller
{
    public function index()
    {
        $contracts = Contract::with(['property', 'owner', 'client'])
            ->where('client_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($contracts);
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

        // Get the owner from the owners table
        $owner = \App\Models\Owner::findOrFail($property->owner_id);

        $contract = Contract::create([
            'property_id' => $validated['property_id'],
            'owner_id' => $owner->id,
            'client_id' => auth()->id(),
            'agent_id' => 1,
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

        return response()->json($contract, 201);
    }

    public function show(Contract $contract)
    {
        $contract->load(['property', 'owner', 'client']);
        return response()->json($contract);
    }

    public function generatePDF(Contract $contract)
    {
        $contract->load(['property', 'owner', 'client']);
        
        $pdf = PDF::loadView('contracts.pdf', [
            'contract' => $contract
        ]);

        return $pdf->download("contrat-{$contract->contract_number}.pdf");
    }

    public function transactions(Contract $contract)
    {
        $transactions = $contract->transactions()
            ->latest()
            ->get();

        return response()->json($transactions);
    }

    public function storeTransaction(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $transaction = $contract->transactions()->create([
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
        $contracts = Contract::with(['property', 'client'])
            ->where('owner_id', auth()->user()->owner->id)
            ->latest()
            ->get();

        return response()->json($contracts);
    }

    public function approveContract(Contract $contract)
    {
        if ($contract->owner_id !== auth()->user()->owner->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($contract->status !== 'pending') {
            return response()->json(['message' => 'Contract is not in pending status'], 400);
        }

        $contract->update([
            'status' => 'approved'
        ]);

        return response()->json(['message' => 'Contract approved successfully']);
    }

    public function rejectContract(Contract $contract)
    {
        if ($contract->owner_id !== auth()->user()->owner->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($contract->status !== 'pending') {
            return response()->json(['message' => 'Contract is not in pending status'], 400);
        }

        $contract->update([
            'status' => 'rejected'
        ]);

        return response()->json(['message' => 'Contract rejected successfully']);
    }
} 