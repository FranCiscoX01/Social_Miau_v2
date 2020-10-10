<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\User;
use App\Post;
use App\Picture;
use App\PivotUserLikePost;
use Auth;

class UserController extends Controller
{
    public function getMyPosts()
    {
      $posts = Post::where('user_id', Auth::user()->id)->orderBy('created_at', 'desc')->get();

      $posts = $posts->reject(function($posts) {
        $posts->picture = Picture::where('id', $posts->picture_id)->select('url')->first();
        $posts->author = User::where('id', $posts->user_id)->select('name')->first();
        $posts->author_img = Picture::where('id', Auth::user()->picture_id)->select('url')->first();
        $posts->like = PivotUserLikePost::where('post_id', $posts->id)->get();
        foreach ($posts->like as $l) {
          $l->user_name = User::where('id', $l->user_id)->select('name')->first();
        }
      });

      return $posts;
    }

    public function updatePersonalInfo(Request $request)
    {
      $user = $request['form_data'];
      $picture = $request['picture_user'];

      $exist_user = User::find($user['id']);
      if (!empty($exist_user)) {
        $exist_user->name = $user['name'];
        $exist_user->last_name = $user['last_name'];
        $exist_user->nick_name = $user['nick_name'];
        $exist_user->phone_number = $user['phone_number'];
        $exist_user->address = $user['address'];
        $exist_user->picture_id = !empty($picture) ? $picture['id'] : $exist_user->picture_id;
        $exist_user->save();
        return $exist_user;
      } else {
        return response()->json(['error' => 'El usuario no existe']);
      }
    }

    public function newPasswordUser(Request $request, $id_user)
    {
      $user = User::find($id_user);
      if (!empty($user)) {
        if ($request['new_password'] == $request['confirm_password']) {
          $user->password = Hash::make($request['confirm_password']);
          $user->save();
          return response()->json(['success' => true, 'message' => 'Passwords updated']);
        } else {
          return response()->json(['error' => true, 'message' => 'Passwords do not match']);
        }
      } else {
        return response()->json(['error' => 'El usuario no existe']);
      }
      // return $request;
    }
}
