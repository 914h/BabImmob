<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties');
            $table->foreignId('owner_id')->constrained('owners');
            $table->foreignId('client_id')->constrained('clients');
            $table->enum('type', ['rent', 'sale']);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('total_amount', 12, 2);
            $table->text('conditions');
            $table->text('description')->nullable();
            $table->string('contract_number');
            $table->enum('status', ['active', 'completed', 'cancelled', 'pending', 'approved', 'rejected']);
            $table->string('document_path');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contrats');
    }
}; 