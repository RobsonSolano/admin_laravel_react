<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Entities\AdminHasPermission; // Importe a entidade correta
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminHasPermissionsController extends Controller
{
    /**
     * Display permissions of a user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function permissions(User $user)
    {
        $permissions = $user->permissions; // Aqui acessamos o relacionamento definido no modelo User

        return response()->json([
            'data' => $permissions,
        ]);
    }
}
