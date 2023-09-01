<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ModulosAdmin;
use App\Presenters\ModulosAdminPresenter;
use App\Repositories\ModulosAdminRepository;
use App\Validators\ModulosAdminValidator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ModulosAdminsController extends Controller
{
    /**
     * @var ModulosAdminRepository
     */
    protected $repository;

    /**
     * @var ModulosAdminValidator
     */
    protected $validator;

    /**
     * @var ModulosAdminPresenter
     */
    protected $presenter;

    /**
     * ModulosAdminsController constructor.
     *
     * @param ModulosAdminRepository $repository
     * @param ModulosAdminValidator $validator
     */
    public function __construct(ModulosAdminRepository $repository, ModulosAdminValidator $validator, ModulosAdminPresenter $presenter)
    {
        $this->repository = $repository;
        $this->validator  = $validator;
        $this->presenter  = $presenter;
    }

    public function index()
    {
        $user = Auth::user();

        // Verifique se o usuário está autenticado
        if (!$user) {
            return response()->json(['message' => 'Usuário não autenticado'], 401);
        }

        // Obtenha os IDs dos módulos para os quais o usuário tem permissão
        $moduleIds = $user->permissions->pluck('admin_modulo_id')->toArray();

        // Consulte os módulos com base nos IDs obtidos
        $modules = ModulosAdmin::whereIn('id', $moduleIds)->get();

        return response()->json(['data' => $modules]);
    }

    public function modulos()
    {
        // Consulte os módulos com base nos IDs obtidos
        $modules = ModulosAdmin::all();

        return response()->json(['data' => $modules]);
    }

}
