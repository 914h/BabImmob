<?php

namespace Database\Seeders;

use App\Models\Owner;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        Owner::create([
            'name' => 'Houssam',
            'email' => 'Houssam@Houssam.com',
            'password' => Hash::make('Houssam@Houssam.com'),
            'img' => null,
            'phone' => null,
            'address' => null,
        ]);
    }
} 