<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Entities\AdminHasPermission;

/**
 * Class AdminHasPermissionTransformer.
 *
 * @package namespace App\Transformers;
 */
class AdminHasPermissionTransformer extends TransformerAbstract
{
    /**
     * Transform the AdminHasPermission entity.
     *
     * @param \App\Entities\AdminHasPermission $model
     *
     * @return array
     */
    public function transform(AdminHasPermission $model)
    {
        return [
            'id'         => (int) $model->id,

            /* place your other model properties here */

            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at
        ];
    }
}
