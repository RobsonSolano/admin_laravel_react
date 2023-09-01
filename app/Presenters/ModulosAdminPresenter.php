<?php

namespace App\Presenters;

use App\Transformers\ModulosAdminTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ModulosAdminPresenter.
 *
 * @package namespace App\Presenters;
 */
class ModulosAdminPresenter extends FractalPresenter
{
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ModulosAdminTransformer();
    }
}
