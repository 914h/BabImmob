<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\Owner;
use Carbon\Carbon;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        // Get all owner IDs
        $ownerIds = Owner::pluck('id')->toArray();

        if (empty($ownerIds)) {
            // Create a default owner if none exists
            $owner = Owner::create([
                'name' => 'Default Owner',
                'email' => 'owner@example.com',
                'password' => bcrypt('password'),
                'phone' => '1234567890',
                'address' => 'Default Address'
            ]);
            $ownerIds = [$owner->id];
        }

        $properties = [
            [
                'owner_id' => $ownerIds[array_rand($ownerIds)],
                'type' => 'apartment',
                'title' => 'Appartement Moderne au Centre-Ville',
                'description' => 'Magnifique appartement de 3 pièces au cœur de la ville, entièrement rénové avec des matériaux de haute qualité. Proche des transports et des commerces.',
                'images' => json_encode(['properties/app1.jpg', 'properties/app2.jpg']),
                'address' => '123 Rue de la Paix',
                'city' => 'Casablanca',
                'surface' => 85,
                'rooms' => 3,
                'price' => 2500000,
                'status' => 'available',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'owner_id' => $ownerIds[array_rand($ownerIds)],
                'type' => 'villa',
                'title' => 'Villa Luxueuse avec Piscine',
                'description' => 'Superbe villa contemporaine avec piscine privée, jardin paysager et garage pour 2 voitures. Idéale pour une famille.',
                'images' => json_encode(['properties/villa1.jpg', 'properties/villa2.jpg']),
                'address' => '45 Avenue des Palmiers',
                'city' => 'Rabat',
                'surface' => 250,
                'rooms' => 5,
                'price' => 4500000,
                'status' => 'available',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'owner_id' => $ownerIds[array_rand($ownerIds)],
                'type' => 'apartment',
                'title' => 'Studio Élégant pour Étudiant',
                'description' => 'Studio meublé et rénové, parfait pour un étudiant. Proche des universités et des transports en commun.',
                'images' => json_encode(['properties/studio1.jpg', 'properties/studio2.jpg']),
                'address' => '78 Rue des Étudiants',
                'city' => 'Fès',
                'surface' => 35,
                'rooms' => 1,
                'price' => 1200000,
                'status' => 'available',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'owner_id' => $ownerIds[array_rand($ownerIds)],
                'type' => 'house',
                'title' => 'Maison Familiale Spacieuse',
                'description' => 'Belle maison familiale avec grand jardin, cuisine équipée et salon lumineux. Quartier calme et résidentiel.',
                'images' => json_encode(['properties/maison1.jpg', 'properties/maison2.jpg']),
                'address' => '15 Rue des Roses',
                'city' => 'Marrakech',
                'surface' => 180,
                'rooms' => 4,
                'price' => 3200000,
                'status' => 'available',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'owner_id' => $ownerIds[array_rand($ownerIds)],
                'type' => 'apartment',
                'title' => 'Duplex avec Terrasse',
                'description' => 'Magnifique duplex avec grande terrasse et vue panoramique. Rénové avec goût et équipé des dernières technologies.',
                'images' => json_encode(['properties/duplex1.jpg', 'properties/duplex2.jpg']),
                'address' => '92 Boulevard de la Corniche',
                'city' => 'Tanger',
                'surface' => 120,
                'rooms' => 3,
                'price' => 2800000,
                'status' => 'available',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'owner_id' => $ownerIds[array_rand($ownerIds)],
                'type' => 'villa',
                'title' => 'Villa Traditionnelle Marocaine',
                'description' => 'Authentique villa marocaine avec patio, zelliges et décoration traditionnelle. Grand terrain et dépendances.',
                'images' => json_encode(['properties/villa3.jpg', 'properties/villa4.jpg']),
                'address' => '28 Rue des Orangers',
                'city' => 'Meknès',
                'surface' => 300,
                'rooms' => 6,
                'price' => 5200000,
                'status' => 'available',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($properties as $property) {
            Property::create($property);
        }
    }
} 