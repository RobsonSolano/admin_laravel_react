<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::factory()->create([
            'id' => 1,
            'name' => 'Admin Principal',
            'email' => 'admin@laravelreact.com',
            'password' => bcrypt('n4n0')
        ]);

        \App\Models\ModulosAdmin::factory()->create([
            'id' => 1,
            'nome' => 'Administradores',
            'rota' => 'administradores'
        ]);

        \App\Models\AdminHasPermission::factory()->create([
            'id' => 1,
            'admin_modulo_id' => 1,
            'admin_user_id' => 1
        ]);
    }
}
