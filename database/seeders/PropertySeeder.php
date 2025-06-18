<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\Owner;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create some owners
        $owners = Owner::all();
        if ($owners->isEmpty()) {
            $owners = Owner::factory(5)->create();
        }

        $propertyTypes = ['apartment', 'house', 'villa'];
        $cities = ['Casablanca', 'Rabat', 'Marrakech', 'Fez', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan'];
        $statuses = ['available', 'available', 'available', 'available', 'available']; // Mostly available for testing

        // Create 50 properties for testing pagination
        for ($i = 1; $i <= 50; $i++) {
            $type = $propertyTypes[array_rand($propertyTypes)];
            $city = $cities[array_rand($cities)];
            $status = $statuses[array_rand($statuses)];
            
            // Generate realistic prices based on type and city
            $basePrice = $this->getBasePrice($type, $city);
            $price = $basePrice + rand(-50000, 100000);
            
            // Generate realistic surface area
            $surface = $this->getSurfaceArea($type);
            
            // Generate realistic number of rooms
            $rooms = $this->getRoomCount($type);

            Property::create([
                'owner_id' => $owners->random()->id,
                'title' => $this->generatePropertyTitle($type, $city, $i),
                'description' => $this->generatePropertyDescription($type, $city, $surface, $rooms),
                'price' => $price,
                'address' => $this->generateAddress($city),
                'city' => $city,
                'surface' => $surface,
                'rooms' => $rooms,
                'type' => $type,
                'status' => $status,
                'images' => [], // Empty for now, will use random images from frontend
            ]);
        }
    }

    private function getBasePrice($type, $city)
    {
        $cityMultiplier = [
            'Casablanca' => 1.5,
            'Rabat' => 1.4,
            'Marrakech' => 1.3,
            'Fez' => 1.2,
            'Tangier' => 1.3,
            'Agadir' => 1.1,
            'Meknes' => 1.0,
            'Oujda' => 0.9,
            'Kenitra' => 1.0,
            'Tetouan' => 1.1,
        ];

        $typeBasePrice = [
            'apartment' => 800000,
            'house' => 1200000,
            'villa' => 2000000,
        ];

        return $typeBasePrice[$type] * $cityMultiplier[$city];
    }

    private function getSurfaceArea($type)
    {
        switch ($type) {
            case 'apartment':
                return rand(50, 150);
            case 'house':
                return rand(120, 300);
            case 'villa':
                return rand(200, 500);
            default:
                return rand(80, 200);
        }
    }

    private function getRoomCount($type)
    {
        switch ($type) {
            case 'apartment':
                return rand(1, 4);
            case 'house':
                return rand(3, 6);
            case 'villa':
                return rand(4, 8);
            default:
                return rand(2, 5);
        }
    }

    private function generatePropertyTitle($type, $city, $number)
    {
        $adjectives = ['Beautiful', 'Modern', 'Luxurious', 'Spacious', 'Elegant', 'Cozy', 'Magnificent', 'Stunning', 'Charming', 'Exclusive'];
        $adjective = $adjectives[array_rand($adjectives)];
        
        switch ($type) {
            case 'apartment':
                return "{$adjective} Apartment in {$city} #{$number}";
            case 'house':
                return "{$adjective} Family House in {$city} #{$number}";
            case 'villa':
                return "{$adjective} Villa in {$city} #{$number}";
            default:
                return "{$adjective} Property in {$city} #{$number}";
        }
    }

    private function generatePropertyDescription($type, $city, $surface, $rooms)
    {
        $descriptions = [
            "Discover this exceptional {$type} located in the heart of {$city}. This property features {$rooms} spacious rooms and {$surface}m² of living space, perfect for families or investors.",
            "This stunning {$type} in {$city} offers {$rooms} well-appointed rooms across {$surface}m². Modern amenities and prime location make this an ideal choice.",
            "Experience luxury living in this {$type} situated in {$city}. With {$rooms} rooms and {$surface}m² of space, this property combines comfort with elegance.",
            "A rare opportunity to own this {$type} in {$city}. Featuring {$rooms} rooms and {$surface}m² of living area, this property offers excellent value.",
            "This magnificent {$type} in {$city} provides {$rooms} rooms and {$surface}m² of space. Perfect location with easy access to all amenities."
        ];

        return $descriptions[array_rand($descriptions)];
    }

    private function generateAddress($city)
    {
        $streets = ['Avenue Mohammed V', 'Boulevard Hassan II', 'Rue de la Liberté', 'Avenue des Nations Unies', 'Boulevard Mohammed VI', 'Rue Ibn Khaldoun', 'Avenue Al Massira', 'Boulevard Al Qods'];
        $street = $streets[array_rand($streets)];
        $number = rand(1, 200);
        
        return "{$number} {$street}, {$city}";
    }
} 