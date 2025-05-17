<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AgentController extends Controller
{
    public function index()
    {
        $agents = Agent::all();
        $agents->transform(function ($agent) {
            $agent->formatted_updated_at = $agent->updated_at->format('Y-m-d H:i:s');
            return $agent;
        });
        return response()->json(['data' => $agents]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'prenom' => 'required|string|max:50',
            'name' => 'required|string|max:50',
            'email' => 'required|email|unique:agents,email',
            'password' => 'required|string|min:8',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        try {
            if ($request->hasFile('img')) {
                $image = $request->file('img');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->storeAs('public/agent-images', $imageName);
                $validated['img'] = 'agent-images/' . $imageName;
            }

            $agent = Agent::create($validated);
            Log::info('Agent created successfully', ['agent_id' => $agent->id]);
            return response()->json(['message' => 'Agent created successfully', 'agent' => $agent], 201);
        } catch (\Exception $e) {
            Log::error('Error creating agent', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error creating agent', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Agent $agent)
    {
        return response()->json(['data' => $agent]);
    }

    public function update(Request $request, Agent $agent)
    {
        $validated = $request->validate([
            'prenom' => 'required|string|max:50',
            'name' => 'required|string|max:50',
            'email' => 'required|email|unique:agents,email,' . $agent->id,
            'password' => 'nullable|string|min:8',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        try {
            if ($request->hasFile('img')) {
                // Delete old image if exists
                if ($agent->img) {
                    Storage::delete('public/' . $agent->img);
                }
                $image = $request->file('img');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->storeAs('public/agent-images', $imageName);
                $validated['img'] = 'agent-images/' . $imageName;
            }

            if (empty($validated['password'])) {
                unset($validated['password']);
            }

            $agent->update($validated);
            Log::info('Agent updated successfully', ['agent_id' => $agent->id]);
            return response()->json(['message' => 'Agent updated successfully', 'agent' => $agent]);
        } catch (\Exception $e) {
            Log::error('Error updating agent', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error updating agent', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Agent $agent)
    {
        try {
            if ($agent->img) {
                Storage::delete('public/' . $agent->img);
            }
            $agent->delete();
            Log::info('Agent deleted successfully', ['agent_id' => $agent->id]);
            return response()->json(['message' => 'Agent deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting agent', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error deleting agent', 'error' => $e->getMessage()], 500);
        }
    }
} 