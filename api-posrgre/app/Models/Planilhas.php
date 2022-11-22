<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Planilhas extends Model
{
    protected $table = 'planilha';

    protected $fillable = [
        'id',
        'dados1',
        'dados2'
    ];
}