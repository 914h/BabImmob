<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class OwnerController extends Controller
{
    public function index()
    {
        try {
            Log::info('Fetching all owners');
            $owners = Owner::all()->map(function ($owner) {
                $owner->formatted_updated_at = $owner->updated_at->format('Y-m-d H:i');
                return $owner;
            });
            
            Log::info('Owners fetched successfully', ['count' => $owners->count()]);
            return response()->json(['data' => $owners]);
        } catch (\Exception $e) {
            Log::error('Error fetching owners', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error fetching owners: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('Store request received', [
                'request_data' => $request->all(),
                'has_image' => $request->hasFile('img')
            ]);

            $request->validate([
                'prenom' => 'required|string',
                'name' => 'required|string',
                'email' => 'required|email|unique:owners',
                'password' => 'required|string|min:6',
                'img' => 'nullable|file|image|max:2048'
            ]);

            $imagePath = null;
            if ($request->hasFile('img')) {
                try {
                    Log::info('Processing image upload');
                    $file = $request->file('img');
                    Log::info('File details', [
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize()
                    ]);
                    
                    $imagePath = $file->store('owner-images', 'public');
                    Log::info('Image stored successfully', ['path' => $imagePath]);
                } catch (\Exception $e) {
                    Log::error('Error storing image', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    throw $e;
                }
            }

            $owner = new Owner();
            $owner->prenom = $request->prenom;
            $owner->name = $request->name;
            $owner->email = $request->email;
            $owner->password = bcrypt($request->password);
            $owner->img = $imagePath;
            $owner->save();

            Log::info('Owner created successfully', ['owner' => $owner]);

            return response()->json(['owner' => $owner, 'message' => 'Owner created successfully'], 201);
        } catch (\Exception $e) {
            Log::error('Error creating owner', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error creating owner: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Owner $owner)
    {
        return response()->json($owner);
    }

    public function update(Request $request, Owner $owner)
    {
        try {
            Log::info('Update request received', [
                'owner_id' => $owner->id,
                'request_data' => $request->all(),
                'has_image' => $request->hasFile('img')
            ]);

            $validationRules = [
                'prenom' => 'sometimes|required|string|max:50',
                'name' => 'sometimes|required|string|max:50',
                'email' => 'sometimes|required|email|unique:owners,email,' . $owner->id,
                'img' => 'nullable|file|image|max:2048'
            ];

            if ($request->filled('password')) {
                $validationRules['password'] = 'required|string|min:6';
            }

            $request->validate($validationRules);

            $updateData = [];

            if ($request->has('prenom')) {
                $updateData['prenom'] = $request->prenom;
            }
            if ($request->has('name')) {
                $updateData['name'] = $request->name;
            }
            if ($request->has('email')) {
                $updateData['email'] = $request->email;
            }
            if ($request->filled('password')) {
                $updateData['password'] = bcrypt($request->password);
            }

            if ($request->hasFile('img')) {
                Log::info('Processing image upload');
                if ($owner->img) {
                    Storage::disk('public')->delete($owner->img);
                }
                $updateData['img'] = $request->file('img')->store('owner-images', 'public');
            }

            Log::info('Updating owner with data', $updateData);

            if (!empty($updateData)) {
                $owner->update($updateData);
            }

            $owner->refresh();
            $owner->formatted_updated_at = $owner->updated_at->format('Y-m-d H:i');

            Log::info('Owner updated successfully', ['owner' => $owner]);

            return response()->json([
                'owner' => $owner,
                'message' => 'Owner updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating owner', [
                'owner_id' => $owner->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error updating owner: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Owner $owner)
    {
        try {
            Log::info('Deleting owner', ['owner_id' => $owner->id]);

            if ($owner->img) {
                Storage::disk('public')->delete($owner->img);
            }

            $owner->delete();
            
            Log::info('Owner deleted successfully', ['owner_id' => $owner->id]);

            return response()->json([
                'message' => 'Owner deleted successfully',
                'owner' => $owner
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting owner', [
                'owner_id' => $owner->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error deleting owner: ' . $e->getMessage()
            ], 500);
        }
    }
}
