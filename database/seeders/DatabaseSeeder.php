<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        if (!\App\Models\Client::where('email', 'houssam@abdennour.com')->exists()) {
            \App\Models\Client::factory()->create([
                'nom' => 'Houssam',
                'prenom' => 'Mr',
                'name' => 'Houssam Mr',
                'email' => 'houssam@abdennour.com',
                'phone' => '1234567890',
                'address' => '123 Main St',
                'password' => Hash::make('123456789'),
            ]);
        }

        if (!\App\Models\Admin::where('email', 'admin@admin.com')->exists()) {
            \App\Models\Admin::factory()->create([
                'name' => 'Admin',
                'prenom' => 'Mr',
                'email' => 'admin@admin.com',
                'password' => Hash::make('123456789'),
            ]);
        }

        if (!\App\Models\Agent::where('email', 'ahmed@agent.com')->exists()) {
            \App\Models\Agent::factory()->create([
                'name' => 'Ahmed',
                'prenom' => 'Agent',
                'email' => 'ahmed@agent.com',
                'password' => Hash::make('123456789'),
            ]);
        }

        $this->call([
            ClientSeeder::class,
            SemestreSeeder::class,
            OwnerSeeder::class,
        ]);
    }
}
