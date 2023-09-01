<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->bind(\App\Repositories\ModulosAdminRepository::class, \App\Repositories\ModulosAdminRepositoryEloquent::class);
        $this->app->bind(\App\Repositories\AdminHasPermissionRepository::class, \App\Repositories\AdminHasPermissionRepositoryEloquent::class);
    }
}
