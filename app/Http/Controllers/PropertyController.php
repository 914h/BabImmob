<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PropertyController extends Controller
{
    // Public methods for client access
    public function publicIndex()
    {
        $properties = Property::all()->map(function ($property) {
            $property->main_image = $property->main_image;
            return $property;
        });
        Log::info('Public properties fetched:', ['count' => $properties->count()]);
        return response()->json(['status' => 'success', 'data' => $properties]);
    }

    public function publicShow($id)
    {
        $property = Property::with('owner')
            ->where('status', 'active')
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $property
        ]);
    }

    // Client methods
    public function clientIndex()
    {
        $properties = Property::where('status', 'available')
            ->latest()
            ->get()
            ->map(function ($property) {
                $property->main_image = $property->main_image;
                return $property;
            });

        return response()->json([
            'status' => 'success',
            'data' => $properties
        ]);
    }

    public function clientShow($id)
    {
        $property = Property::with('owner')
            ->where('status', 'available')
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $property
        ]);
    }

    // Owner methods
    public function index()
    {
        $properties = Property::where('owner_id', auth()->id())
            ->latest()
            ->get()
            ->map(function ($property) {
                $property->main_image = $property->main_image;
                return $property;
            });

        return response()->json([
            'status' => 'success',
            'data' => $properties
        ]);
    }

    public function show($id)
    {
        $property = Property::where('owner_id', auth()->id())
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $property
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'surface' => 'required|numeric|min:0',
            'rooms' => 'required|integer|min:0',
            'type' => 'required|string|in:apartment,house,villa',
            'status' => 'required|string|in:available,rented,sold,pending',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('properties', 'public');
                $images[] = $path;
            }
        }

        $property = Property::create([
            'owner_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'address' => $request->address,
            'city' => $request->city,
            'surface' => $request->surface,
            'rooms' => $request->rooms,
            'type' => $request->type,
            'status' => $request->status,
            'images' => $images
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Property created successfully',
            'data' => $property
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $property = Property::where('owner_id', auth()->id())
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'address' => 'string|max:255',
            'city' => 'string|max:255',
            'surface' => 'numeric|min:0',
            'rooms' => 'integer|min:0',
            'type' => 'string|in:apartment,house,villa',
            'status' => 'string|in:active,inactive',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only([
            'title', 'description', 'price', 'address',
            'city', 'surface', 'rooms', 'type', 'status'
        ]);

        if ($request->hasFile('images')) {
            // Delete old images
            if (is_array($property->images)) {
                foreach ($property->images as $oldImage) {
                    Storage::disk('public')->delete($oldImage);
                }
            }

            // Upload new images
            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('properties', 'public');
                $images[] = $path;
            }
            $updateData['images'] = $images;
        }

        $property->update($updateData);

        return response()->json([
            'status' => 'success',
            'message' => 'Property updated successfully',
            'data' => $property
        ]);
    }

    public function destroy($id)
    {
        $property = Property::where('owner_id', auth()->id())
            ->findOrFail($id);

        // Delete associated images
        if (is_array($property->images)) {
            foreach ($property->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $property->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Property deleted successfully'
        ]);
    }
} 