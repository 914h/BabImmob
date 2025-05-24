upda<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['owner_id']);
            
            // Add the new foreign key constraint
            $table->foreign('owner_id')->references('id')->on('owners');
        });
    }

    public function down()
    {
        Schema::table('properties', function (Blueprint $table) {
            // Drop the new foreign key constraint
            $table->dropForeign(['owner_id']);
            
            // Restore the original foreign key constraint
            $table->foreign('owner_id')->references('id')->on('users');
        });
    }
}; 