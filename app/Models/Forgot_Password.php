<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Forgot_Password extends Model
{
    use HasFactory;

    protected $table = "forgot_password";

    protected $fillable = [
        'user_name',
        'user_email',
        'user_id',
        'codigo'
    ];
}
