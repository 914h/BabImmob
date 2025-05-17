<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users');
            $table->enum('type', ['apartment', 'house', 'villa', 'land', 'commercial']);
            $table->string('title');
            $table->text('description');
            $table->string('address');
            $table->string('city');
            $table->decimal('surface', 10, 2);
            $table->integer('rooms');
            $table->decimal('price', 12, 2);
            $table->enum('status', ['available', 'rented', 'sold', 'pending']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
}; 