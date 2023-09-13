<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        $dataUser = [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10)
        ];

        /** @var User $user  */
        $user = User::create($dataUser);

        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'), 200);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();


        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email address or password is incorrect'
            ], 422);
        }

        /** @var User $user  */
        $user = Auth::user();
        $token = $user->createToken('main', ['expires_in' => 480])->plainTextToken;

        return response(compact('user', 'token'), 200);
    }

    public function logout(Request $request)
    {
        /** @var User $user  */
        $user = $request->user();
        $user->currentAccessToken()->delete;

        return response('', 204);
    }

    public function forgotPassword(Request $request) {
        dd($request);
    }

    public function resetPassword(Request $request) {
        // Valide o código de recuperação e permita que o usuário redefina sua senha.
    }
}
