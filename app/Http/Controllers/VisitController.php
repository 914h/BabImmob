<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

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

            // Get the authenticated user
            $user = Auth::user();
            if (!$user) {
                Log::error('No authenticated user found in visit creation');
                return response()->json(['error' => 'Authentication required'], 401);
            }

            // Format the date to Y-m-d
            $visitDate = date('Y-m-d', strtotime($validated['visit_date']));

            $visit = Visit::create([
                'property_id' => $validated['property_id'],
                'client_id' => $user->id,
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
        try {
            // Get the authenticated user
            $user = Auth::user();
            if (!$user) {
                Log::error('No authenticated user found in visit index');
                return response()->json(['error' => 'Authentication required'], 401);
            }

            Log::info('Fetching visits for user: ' . $user->id);

            $visits = Visit::with(['property', 'client'])
                ->where('client_id', $user->id)
                ->latest()
                ->get();

            Log::info('Found ' . $visits->count() . ' visits for user ' . $user->id);

            return response()->json($visits);
        } catch (\Exception $e) {
            Log::error('Error fetching visits: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch visits: ' . $e->getMessage()], 500);
        }
    }

    public function show(Visit $visit)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Authentication required'], 401);
            }

            // Check if the user owns this visit
            if ($visit->client_id !== $user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $visit->load(['property', 'client']);
            return response()->json($visit);
        } catch (\Exception $e) {
            Log::error('Error fetching visit: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch visit: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Visit $visit)
    {
        $user = Auth::user();
        if (!$user || $visit->client_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $visit->delete();
        return response()->json(['message' => 'Visit deleted successfully.']);
    }

    public function update(Request $request, Visit $visit)
    {
        $user = Auth::user();
        if (!$user || $visit->client_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $validated = $request->validate([
            'visit_date' => 'nullable|date',
            'visit_time' => 'nullable|string',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);
        $visit->update($validated);
        return response()->json($visit);
    }
} 