<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdminHasPermission extends Model
{
    use HasFactory, Notifiable;

    protected $table = "admin_has_permissions";

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'admin_modulo_id',
        'admin_user_id',
        // outros campos, se houver
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'admin_user_id');
    }

    public function permission()
    {
        return $this->belongsTo(ModulosAdmin::class, 'admin_modulo_id');
    }
}
