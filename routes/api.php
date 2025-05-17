<?php

use App\Http\Controllers\ClassesController;
use App\Http\Controllers\DevoirController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\StudentController;
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
  Route::apiResources([
    'devoirs' => DevoirController::class,
    'classes' => ClassesController::class,
    'modules' => ModuleController::class,
  ]);
  
  // Property management routes
  Route::apiResource('properties', PropertyController::class);
});


require __DIR__.'/auth.php';
