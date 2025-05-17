<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();
        
        // Get the authenticated guard from the request
        $guard = $request->input('authenticated_guard');
        if (!$guard) {
            return response()->json([
                'message' => 'Authentication failed - no guard specified'
            ], 401);
        }

        $currentGuard = Auth::guard($guard);
        if (!$currentGuard->check()) {
            return response()->json([
                'message' => 'Authentication failed - guard check failed'
            ], 401);
        }

        $user = $currentGuard->user();
        $request->session()->regenerate();

        // Create token with the correct role and abilities
        $token = $user->createToken('api-token', [$guard])->plainTextToken;

        // Add role to user data
        $userData = $user->toArray();
        $userData['role'] = $guard;

        return response()->json([
            'user' => $userData,
            'token' => $token
        ], 200);
    }
    

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        $guards = ['admin', 'agent', 'owner', 'client'];
        $user = null;
        
        foreach ($guards as $guard) {
            $currentGuard = Auth::guard($guard);
            if ($currentGuard->check()) {
                $user = $currentGuard->user();
                break;
            }
        }

        if ($user) {
            $user->tokens()->delete();
            Auth::guard($guard)->logout();
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
