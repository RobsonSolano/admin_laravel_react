<?php

namespace App\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use App\Repositories\AdminHasPermissionRepository;
use App\Entities\AdminHasPermission;
use App\Validators\AdminHasPermissionValidator;

/**
 * Class AdminHasPermissionRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class AdminHasPermissionRepositoryEloquent extends BaseRepository implements AdminHasPermissionRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AdminHasPermission::class;
    }

    /**
    * Specify Validator class name
    *
    * @return mixed
    */
    public function validator()
    {

        return AdminHasPermissionValidator::class;
    }


    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
    
}
