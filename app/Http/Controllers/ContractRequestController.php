<?php

namespace App\Http\Controllers;

use App\Models\ContractRequest;
use Illuminate\Http\Request;

class ContractRequestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'notes' => 'nullable|string',
        ]);

        $contractRequest = ContractRequest::create([
            'property_id' => $validated['property_id'],
            'client_id' => auth()->id(),
            'notes' => $validated['notes'],
            'status' => 'pending',
        ]);

        return response()->json($contractRequest, 201);
    }

    public function index()
    {
        $contractRequests = ContractRequest::with(['property', 'client'])
            ->where('client_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($contractRequests);
    }

    public function show(ContractRequest $contractRequest)
    {
        $contractRequest->load(['property', 'client']);
        return response()->json($contractRequest);
    }
} 