<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PivotUserLikePost extends Model
{
  protected $table = 'pivot_user_like_post';
  protected $fillable = [
      'user_id', 'post_id', 'status_id', 'stars'
  ];
}
