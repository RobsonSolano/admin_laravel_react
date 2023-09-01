<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\AdminHasPermission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        if ($request->has('email')) {
            $query->where('email', 'like', '%' . $request->input('email') . '%');
        }

        if ($request->has('created_at')) {
            $query->where('created_at', 'like', '%' . $request->input('created_at') . '%');
        }

        if ($request->has('sort')) {
            $sortField = $request->input('sort', 'id');
            $sortDirection = $request->input('direction', 'asc');
            $query->orderBy($sortField, $sortDirection);
        } else {
            // Ordenação padrão
            $query->orderBy('id', 'desc');
        }

        return UserResource::collection($query->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreUserRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $data['email_verified_at'] = now();
        $data['remember_token'] = Str::random(10);

        // Crie o usuário sem associar permissões ainda
        $user = User::create($data);

        // Verifique se as permissões foram fornecidas no request

        if ($request->has('permissions')) {
            // Remove existing permissions
            // Add new permissions
            $permissions = [];
            foreach ($data['permissions'] as $permissionId) {
                $permissions[] = AdminHasPermission::create([
                    'admin_modulo_id' => $permissionId,
                    'admin_user_id' => $user->id
                ]);
            }
        }

        return response(new UserResource($user), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateUserRequest  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        if (!empty($request->has('password'))) {
            $data['password'] = bcrypt($request->has('password'));
        }

        $user->update($data);

        // Update permissions
        if (isset($data['permissions'])) {
            // Remove existing permissions
            $user->permissions()->delete();

            // Add new permissions
            $permissions = [];
            foreach ($data['permissions'] as $permissionId) {
                $permissions[] = new AdminHasPermission([
                    'admin_modulo_id' => $permissionId,
                ]);
            }
            $user->permissions()->saveMany($permissions);
        } else {
            // If no permissions were provided, just delete all existing permissions
            $user->permissions()->delete();
        }

        return response(new UserResource($user));
    }



    public function permissions($id)
    {
        return response(AdminHasPermission::where('admin_user_id', $id)->get());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response("", 204);
    }
}
