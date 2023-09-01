<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ModulosAdmin extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = ['id','nome','rota'];
    protected $table = "admin_modulos";
}
