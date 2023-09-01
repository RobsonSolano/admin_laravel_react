<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Entities\ModulosAdmin;

/**
 * Class ModulosAdminTransformer.
 *
 * @package namespace App\Transformers;
 */
class ModulosAdminTransformer extends TransformerAbstract
{
    /**
     * Transform the ModulosAdmin entity.
     *
     * @param \App\Entities\ModulosAdmin $model
     *
     * @return array
     */
    public function transform(ModulosAdmin $model)
    {
        return [
            'id'         => (int) $model->id,
            'nome' => $model->nome,
            'rota' => $model->rota
        ];
    }
}
