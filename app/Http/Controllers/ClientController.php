<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::all()->map(function ($client) {
            $client->formatted_updated_at = $client->updated_at->format('Y-m-d H:i');
            return $client;
        });
        
        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:clients',
            'phone' => 'required|string',
            'address' => 'required|string',
            'password' => 'required|string|min:6',
            'image' => 'nullable|file|max:2048'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('client-images', 'public');
        }

        $client = Client::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'name' => $request->nom . ' ' . $request->prenom,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'password' => $request->password,
            'image' => $imagePath,
        ]);

        return response()->json(['client' => $client, 'message' => 'Client created successfully'], 201);
    }

    public function show(Client $client)
    {
        return response()->json($client);
    }

    public function update(Request $request, Client $client)
    {
        try {
            // Add debugging
            Log::info('Update request received', [
                'client_id' => $client->id,
                'request_data' => $request->all(),
                'has_image' => $request->hasFile('image')
            ]);

            $validationRules = [
                'nom' => 'sometimes|required|string|max:50',
                'prenom' => 'sometimes|required|string|max:50',
                'email' => 'sometimes|required|email|unique:clients,email,' . $client->id,
                'phone' => 'sometimes|required|string|max:15',
                'address' => 'sometimes|required|string|max:200',
                'image' => 'nullable|file|max:2048'
            ];

            // Only validate password if it's provided and not empty
            if ($request->filled('password')) {
                $validationRules['password'] = 'required|string|min:6';
            }

            $request->validate($validationRules);

            $updateData = [];
            
            // Handle each field individually
            if ($request->has('nom')) {
                $updateData['nom'] = $request->nom;
            }
            if ($request->has('prenom')) {
                $updateData['prenom'] = $request->prenom;
            }
            if ($request->has('email')) {
                $updateData['email'] = $request->email;
            }
            if ($request->has('phone')) {
                $updateData['phone'] = $request->phone;
            }
            if ($request->has('address')) {
                $updateData['address'] = $request->address;
            }
            
            // Handle password update if provided
            if ($request->filled('password')) {
                $updateData['password'] = $request->password;
            }
            
            // Handle image upload
            if ($request->hasFile('image')) {
                Log::info('Processing image upload');
                // Delete old image if exists
                if ($client->image) {
                    Storage::disk('public')->delete($client->image);
                }
                $updateData['image'] = $request->file('image')->store('client-images', 'public');
            }

            Log::info('Updating client with data', $updateData);
            
            if (!empty($updateData)) {
                $client->update($updateData);
            }
            
            // Update the full name when nom or prenom changes
            if ($request->has('nom') || $request->has('prenom')) {
                $client->refresh(); // Refresh to get updated data
                $client->name = $client->nom . ' ' . $client->prenom;
                $client->save();
            }

            // Refresh the model to get the latest data
            $client->refresh();
            $client->formatted_updated_at = $client->updated_at->format('Y-m-d H:i');

            Log::info('Client updated successfully', ['client' => $client]);

            return response()->json([
                'client' => $client, 
                'message' => 'Client updated successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error updating client', [
                'client_id' => $client->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error updating client: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Client $client)
    {
        try {
            // Delete image file if exists
            if ($client->image) {
                Storage::disk('public')->delete($client->image);
            }
            
            $client->delete();
            return response()->json(['data' => $client, 'message' => 'Client deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting client', [
                'client_id' => $client->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Error deleting client: ' . $e->getMessage()
            ], 500);
        }
    }

    public function showProfile(Request $request)
    {
        try {
            $client = Client::findOrFail($request->user()->id);
            return response()->json($client);
        } catch (\Exception $e) {
            Log::error('Error fetching client profile', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Error fetching profile: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $client = Client::findOrFail($request->user()->id);
            
            Log::info('Client profile update request received', [
                'client_id' => $client->id,
                'request_data' => $request->all(),
                'has_image' => $request->hasFile('image')
            ]);

            $validationRules = [
                'nom' => 'sometimes|required|string|max:50',
                'prenom' => 'sometimes|required|string|max:50',
                'email' => 'sometimes|required|email|unique:clients,email,' . $client->id,
                'phone' => 'sometimes|required|string|max:15',
                'address' => 'sometimes|required|string|max:200',
                'image' => 'nullable|file|max:2048'
            ];

            // Only validate password if it's provided and not empty
            if ($request->filled('password')) {
                $validationRules['password'] = 'required|string|min:6';
            }

            $request->validate($validationRules);

            $updateData = [];
            
            // Handle each field individually
            if ($request->has('nom')) {
                $updateData['nom'] = $request->nom;
            }
            if ($request->has('prenom')) {
                $updateData['prenom'] = $request->prenom;
            }
            if ($request->has('email')) {
                $updateData['email'] = $request->email;
            }
            if ($request->has('phone')) {
                $updateData['phone'] = $request->phone;
            }
            if ($request->has('address')) {
                $updateData['address'] = $request->address;
            }
            
            // Handle password update if provided
            if ($request->filled('password')) {
                $updateData['password'] = $request->password;
            }
            
            // Handle image upload
            if ($request->hasFile('image')) {
                Log::info('Processing image upload for client profile');
                // Delete old image if exists
                if ($client->image) {
                    Storage::disk('public')->delete($client->image);
                }
                $updateData['image'] = $request->file('image')->store('client-images', 'public');
            }

            Log::info('Updating client profile with data', $updateData);
            
            if (!empty($updateData)) {
                $client->update($updateData);
            }
            
            // Update the full name when nom or prenom changes
            if ($request->has('nom') || $request->has('prenom')) {
                $client->refresh(); // Refresh to get updated data
                $client->name = $client->nom . ' ' . $client->prenom;
                $client->save();
            }

            // Refresh the model to get the latest data
            $client->refresh();

            Log::info('Client profile updated successfully', ['client' => $client]);

            return response()->json([
                'client' => $client, 
                'message' => 'Profile updated successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error updating client profile', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error updating profile: ' . $e->getMessage()
            ], 500);
        }
    }

    // --- API registration for new clients ---
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'image' => 'nullable|file|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('client-images', 'public');
        }

        $client = new Client();
        $client->nom = $validated['nom'];
        $client->prenom = $validated['prenom'];
        $client->name = $validated['nom'] . ' ' . $validated['prenom'];
        $client->email = $validated['email'];
        $client->password = $validated['password'];
        $client->phone = $validated['phone'] ?? null;
        $client->address = $validated['address'] ?? null;
        $client->image = $imagePath;
        $client->save();

        return response()->json([
            'client' => $client,
            'message' => 'Client registered successfully.'
        ], 201);
    }
} 