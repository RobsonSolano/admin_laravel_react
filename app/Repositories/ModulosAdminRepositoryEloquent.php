<?php

namespace App\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use App\Repositories\ModulosAdminRepository;
use App\Models\ModulosAdmin;
use App\Validators\ModulosAdminValidator;

/**
 * Class ModulosAdminRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class ModulosAdminRepositoryEloquent extends BaseRepository implements ModulosAdminRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ModulosAdmin::class;
    }

    /**
    * Specify Validator class name
    *
    * @return mixed
    */
    public function validator()
    {
        return ModulosAdminValidator::class;
    }


    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

}
