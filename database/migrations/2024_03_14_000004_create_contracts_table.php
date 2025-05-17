<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained();
            $table->foreignId('owner_id')->constrained('users');
            $table->foreignId('client_id')->constrained();
            $table->foreignId('agent_id')->constrained('users');
            $table->enum('type', ['rent', 'sale']);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('total_amount', 12, 2);
            $table->text('conditions');
            $table->enum('status', ['active', 'completed', 'cancelled']);
            $table->string('document_path');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
}; 