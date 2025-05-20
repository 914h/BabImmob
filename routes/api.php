<?php

use App\Http\Controllers\OwnerController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes for properties
Route::get('/properties', [PropertyController::class, 'publicIndex']);
Route::get('/properties/{id}', [PropertyController::class, 'publicShow']);

Route::middleware(['auth:sanctum'])->group(static function () {
    Route::get('/me', function (Request $request) {
      return $request->user();
    });
  });

Route::middleware(['auth:sanctum', 'ability:agent'])->prefix('agent')->group(static function () {
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::apiResource('agents', AgentController::class);
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('owners', OwnerController::class);
});

Route::middleware(['auth:sanctum', 'ability:owner'])->prefix('owner')->group(static function () {
    // Property management routes
    Route::apiResource('properties', PropertyController::class);
});

Route::middleware(['auth:sanctum', 'ability:view-properties'])->prefix('client')->group(static function () {
    // Client property access routes
    Route::get('/properties', [PropertyController::class, 'clientIndex']);
    Route::get('/properties/{id}', [PropertyController::class, 'clientShow']);
});

require __DIR__.'/auth.php';
