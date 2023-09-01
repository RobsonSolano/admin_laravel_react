<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminHasPermission;


class CheckPermission
{
    public function handle(Request $request, Closure $next, $moduleId)
    {
        $user = Auth::user();

        // Verifique se o usuário possui permissão para acessar o módulo com o ID fornecido
        if ($user && $user->permissions->contains('admin_modulo_id', $moduleId)) {
            return $next($request);
        }

        // Redirecione para a página de acesso negado com uma mensagem
        return redirect()->route('access.denied')->with('message', 'Acesso negado.');
    }
}
