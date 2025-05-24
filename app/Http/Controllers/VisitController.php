<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VisitController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'property_id' => 'required|exists:properties,id',
                'visit_date' => 'required|date',
                'visit_time' => 'required|string',
                'notes' => 'nullable|string',
            ]);

            // Format the date to Y-m-d
            $visitDate = date('Y-m-d', strtotime($validated['visit_date']));

            $visit = Visit::create([
                'property_id' => $validated['property_id'],
                'client_id' => auth()->id(),
                'agent_id' => 1,
                'visit_date' => $visitDate,
                'visit_time' => $validated['visit_time'],
                'notes' => $validated['notes'],
                'status' => 'pending',
            ]);

            return response()->json($visit, 201);
        } catch (\Exception $e) {
            Log::error('Visit creation error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to schedule visit: ' . $e->getMessage()], 500);
        }
    }

    public function index()
    {
        $visits = Visit::with(['property', 'client'])
            ->where('client_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($visits);
    }

    public function show(Visit $visit)
    {
        $visit->load(['property', 'client']);
        return response()->json($visit);
    }
} 