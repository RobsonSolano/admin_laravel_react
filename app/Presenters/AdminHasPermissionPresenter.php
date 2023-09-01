<?php

namespace App\Presenters;

use App\Transformers\AdminHasPermissionTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class AdminHasPermissionPresenter.
 *
 * @package namespace App\Presenters;
 */
class AdminHasPermissionPresenter extends FractalPresenter
{
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AdminHasPermissionTransformer();
    }
}
