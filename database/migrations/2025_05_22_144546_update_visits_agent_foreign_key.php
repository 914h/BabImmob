<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            // First drop the existing foreign key
            $table->dropForeign(['agent_id']);
            
            // Then add the new foreign key constraint
            $table->foreign('agent_id')
                  ->references('id')
                  ->on('agents')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            // Drop the new foreign key
            $table->dropForeign(['agent_id']);
            
            // Restore the original foreign key
            $table->foreign('agent_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }
}; 