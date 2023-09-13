<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailAuth;
use Exception;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\Google;
use App\Models\User;
use App\Models\Forgot_Password;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;

class MailController extends Controller
{
    /**
     * Generate url to retreive token
     */

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function index(Request $request)
    {
        $email = $request->email;

        $user = User::query()->where('email', '=', $email)->first();

        if (empty($user)) {
            return response()->json(['status' => 'error', 'message' => 'E-mail inválido']);
        }

        $code = strtoupper(Str::random(6));

        $data = [
            'nome' => $user['name'],
            'code' =>  $code,
            'subject' => 'Recuperar Senha'
        ];

        try {
            Mail::to($email)->send(new EmailAuth($data));
            Forgot_Password::create([
                'user_id' => $user['id'],
                'user_email' => $user['email'],
                'user_name' => $user['name'],
                'codigo' => $code
            ]);

            return response()->json(['status' => 'success', 'message' => 'E-mail enviado com sucesso']);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Não foi possível enviar o e-mail', 'error' => $e->getMessage()]);
        }
    }

    public function validate_code(Request $request)
    {
        $codigo =  $request->codigo;

        $data = Forgot_Password::query()->where('codigo', '=', $codigo)->first();

        if (empty($data)) {
            return response()->json(['status' => 'error', 'message' => 'Código inválido, por favor, verifique seu e-mail e tente novamente']);
        }

        return response()->json(['status' => 'success', 'message' => 'Código válido', 'user' => $data['user_id'], 'solicitacao_id' => $data['id']]);
    }

    public function update_password(Request $request)
    {

        $nova_senha =  $request->senha;
        $user_id =  $request->user_id;
        $solicitacao_id =  $request->solicitacao_id;

        $user = User::query()->where('id', '=', $user_id)->first();
        $solicitacao = Forgot_Password::query()->where('id', '=', $solicitacao_id)->first();

        if (empty($user)) {
            return response()->json(['status' => 'error', 'message' => 'Não foi possível encontrar o usuário.']);
        }

        if (empty($solicitacao)) {
            return response()->json(['status' => 'error', 'message' => 'Não foi encontrado solicitação de recuperação de senha.']);
        }

        if (password_verify($nova_senha, $user['password'])) {
            return response()->json(['status' => 'error', 'message' => 'Informe uma senha que não foi utilizada recentemente.']);
        }

        try {
            User::where('id', '=', $user['id'])->update(['password' => bcrypt($nova_senha)]);
            Forgot_Password::where('id', '=', $solicitacao_id)->delete();
            return response()->json(['status' => 'success', 'message' => 'Senha atualizada com sucesso']);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Não foi possível atualizar sua senha, por favor tente novamente.', 'error' => $e->getMessage()]);
        }
    }
}
