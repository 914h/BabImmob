<?php

use App\Http\Controllers\OwnerController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\VisitController;
use App\Http\Controllers\ContractRequestController;
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
    
    // Client profile management
    Route::get('/profile', [ClientController::class, 'showProfile']);
    Route::put('/profile', [ClientController::class, 'updateProfile']);
});

// Contract Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/contracts', [ContractController::class, 'index']);
    Route::post('/contracts', [ContractController::class, 'store']);
    Route::get('/contracts/{contract}', [ContractController::class, 'show']);
    Route::get('/contracts/{contract}/pdf', [ContractController::class, 'generatePDF']);
    Route::get('/contracts/{contract}/transactions', [ContractController::class, 'transactions']);
    Route::post('/contracts/{contract}/transactions', [ContractController::class, 'storeTransaction']);
});

// Visit Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/visits', [VisitController::class, 'index']);
    Route::post('/visits', [VisitController::class, 'store']);
    Route::get('/visits/{visit}', [VisitController::class, 'show']);
});

// Contract Request Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/contract-requests', [ContractRequestController::class, 'index']);
    Route::post('/contract-requests', [ContractRequestController::class, 'store']);
    Route::get('/contract-requests/{contractRequest}', [ContractRequestController::class, 'show']);
});

// Owner Contract Routes
Route::middleware(['auth:sanctum', 'role:owner'])->group(function () {
    Route::get('/owner/contracts', [ContractController::class, 'ownerContracts']);
    Route::post('/owner/contracts/{contract}/approve', [ContractController::class, 'approveContract']);
    Route::post('/owner/contracts/{contract}/reject', [ContractController::class, 'rejectContract']);
});

// Test route to check authentication
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/test-auth', function (Request $request) {
        return response()->json([
            'message' => 'Authentication working',
            'user' => $request->user(),
            'user_id' => $request->user()->id,
            'user_type' => get_class($request->user())
        ]);
    });
});

require __DIR__.'/auth.php';
