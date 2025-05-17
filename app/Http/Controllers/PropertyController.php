<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    public function index()
    {
        try {
            $properties = Property::where('owner_id', Auth::id())
                ->latest()
                ->get()
                ->map(function ($property) {
                    $property->formatted_updated_at = $property->updated_at->format('Y-m-d H:i');
                    return $property;
                });
            
            return response()->json(['data' => $properties]);
        } catch (\Exception $e) {
            Log::error('Error fetching properties', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error fetching properties'], 500);
        }
    }

    public function show(Property $property)
    {
        if ($property->owner_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json(['data' => $property]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|in:apartment,house,villa,land,commercial',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'surface' => 'required|numeric|min:0',
                'rooms' => 'required|integer|min:0',
                'price' => 'required|numeric|min:0',
                'status' => 'required|in:available,rented,sold,pending',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $images = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('properties', 'public');
                    $images[] = $path;
                }
            }

            $property = Property::create([
                'owner_id' => Auth::id(),
                'type' => $validated['type'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'surface' => $validated['surface'],
                'rooms' => $validated['rooms'],
                'price' => $validated['price'],
                'status' => $validated['status'],
                'images' => $images
            ]);

            return response()->json([
                'message' => 'Property created successfully',
                'data' => $property
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating property', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error creating property'], 500);
        }
    }

    public function update(Request $request, Property $property)
    {
        try {
            if ($property->owner_id !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'type' => 'required|in:apartment,house,villa,land,commercial',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'surface' => 'required|numeric|min:0',
                'rooms' => 'required|integer|min:0',
                'price' => 'required|numeric|min:0',
                'status' => 'required|in:available,rented,sold,pending',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $images = $property->images ?? [];
            if ($request->hasFile('images')) {
                // Delete old images
                foreach ($images as $image) {
                    Storage::disk('public')->delete($image);
                }
                
                // Store new images
                $images = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('properties', 'public');
                    $images[] = $path;
                }
            }

            $property->update([
                'type' => $validated['type'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'surface' => $validated['surface'],
                'rooms' => $validated['rooms'],
                'price' => $validated['price'],
                'status' => $validated['status'],
                'images' => $images
            ]);

            return response()->json([
                'message' => 'Property updated successfully',
                'data' => $property
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating property', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error updating property'], 500);
        }
    }

    public function destroy(Property $property)
    {
        try {
            if ($property->owner_id !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Delete associated images
            if ($property->images) {
                foreach ($property->images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }

            $property->delete();

            return response()->json([
                'message' => 'Property deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting property', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error deleting property'], 500);
        }
    }
} 