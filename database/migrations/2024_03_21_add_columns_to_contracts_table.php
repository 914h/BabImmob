<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('contracts', function (Blueprint $table) {
            // Add any missing columns
            if (!Schema::hasColumn('contracts', 'signature_date')) {
                $table->date('signature_date')->nullable();
            }
            if (!Schema::hasColumn('contracts', 'contract_number')) {
                $table->string('contract_number')->unique();
            }
            if (!Schema::hasColumn('contracts', 'description')) {
                $table->text('description')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn(['signature_date', 'contract_number', 'description']);
        });
    }
}; 