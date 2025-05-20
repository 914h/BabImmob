<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\Owner;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $owner = Owner::first();
        
        if (!$owner) {
            $this->command->error('No owner found. Please run OwnerSeeder first.');
            return;
        }

        $properties = [
            [
                'title' => 'Modern Downtown Apartment',
                'description' => 'Beautiful modern apartment in the heart of downtown. Features high ceilings and large windows.',
                'price' => 250000,
                'type' => 'apartment',
                'rooms' => 2,
                'surface' => 120,
                'address' => '123 Downtown St',
                'city' => 'Downtown',
                'status' => 'available',
                'owner_id' => $owner->id,
                'images' => [],
            ],
            [
                'title' => 'Luxury Villa with Pool',
                'description' => 'Stunning villa with private pool and garden. Perfect for family living.',
                'price' => 450000,
                'type' => 'villa',
                'rooms' => 4,
                'surface' => 250,
                'address' => '456 Uptown Ave',
                'city' => 'Uptown',
                'status' => 'available',
                'owner_id' => $owner->id,
                'images' => [],
            ],
            [
                'title' => 'Cozy Family House',
                'description' => 'Warm and inviting family house in a quiet neighborhood. Large backyard and garage.',
                'price' => 350000,
                'type' => 'house',
                'rooms' => 3,
                'surface' => 180,
                'address' => '789 Suburb Lane',
                'city' => 'Suburbs',
                'status' => 'available',
                'owner_id' => $owner->id,
                'images' => [],
            ],
            [
                'title' => 'Studio Apartment',
                'description' => 'Efficient studio apartment perfect for singles or couples. Recently renovated.',
                'price' => 150000,
                'type' => 'apartment',
                'rooms' => 1,
                'surface' => 60,
                'address' => '321 Center St',
                'city' => 'City Center',
                'status' => 'available',
                'owner_id' => $owner->id,
                'images' => [],
            ],
            [
                'title' => 'Beachfront Villa',
                'description' => 'Exclusive beachfront villa with panoramic ocean views. Private beach access.',
                'price' => 750000,
                'type' => 'villa',
                'rooms' => 5,
                'surface' => 300,
                'address' => '555 Beach Road',
                'city' => 'Beach Area',
                'status' => 'available',
                'owner_id' => $owner->id,
                'images' => [],
            ],
        ];

        foreach ($properties as $property) {
            Property::create($property);
        }

        $this->command->info('Properties seeded successfully!');
    }
} 