<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
  protected $table = 'post';
  protected $fillable = [
      'user_id', 'description', 'status_id', 'picture_id'
  ];
}
