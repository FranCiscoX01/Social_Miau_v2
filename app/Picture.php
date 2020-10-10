<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Picture extends Model
{
    protected $table = 'pictures';
    protected $fillable = [
        'name', 'slug', 'url', 'status_id'
    ];
}
