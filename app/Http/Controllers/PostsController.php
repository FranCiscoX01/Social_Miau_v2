<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Post;
use App\User;
use App\Picture;
use App\PivotUserLikePost;
use Auth;
use DB;

class PostsController extends Controller
{
    public function savePost(Request $request)
    {
      // return $request;
      if (empty($request['text']) and empty($request['image'])) {
        return response()->json(['error' => 'No se ingreso nada en el Post']);
      } else {
        $text = empty($request['text']) ? NULL : $request['text'];
        $image = empty($request['image']) ? NULL : $request['image']['response']['id'];

        $post = Post::create([
          'user_id' => Auth::user()->id,
          'description' => $text,
          'status_id' => 1,
          'picture_id' => $image,
        ]);

        return response()->json(['success' => 'Se subio correctamente el Post']);
      }
    }

    public function getAllPost()
    {
      $posts = Post::orderBy('created_at', 'desc')->get();

      $posts = $posts->reject(function($posts) {
        $posts->picture = Picture::where('id', $posts->picture_id)->select('url')->first();
        $posts->author = User::where('id', $posts->user_id)->select('name')->first();
        $posts->author_img = Picture::where('id', Auth::user()->picture_id)->select('url')->first();
        $posts->like = PivotUserLikePost::where('post_id', $posts->id)->where('user_id', Auth::user()->id)->first();
      });

      return $posts;
    }

    public function likesPost(Request $request, $id_post)
    {
      $exist_like = PivotUserLikePost::where('post_id', $id_post)->where('user_id', $request['user']['id'])->first();
      if (!empty($exist_like)) {
        $delete_like = PivotUserLikePost::where('post_id', $id_post)->where('user_id', $request['user']['id'])->where('status_id', $request['status'])->first();
        if (!empty($delete_like)) {
          $delete_like->delete();
          return response()->json(['deleted' => 'Se elimino like']);
        } else {
          $exist_like->status_id = $request['status'];
          $exist_like->save();
          return response()->json(['updated' => 'Se actualizo like', 'result' => $exist_like]);
        }
      } else {
        $new_like = PivotUserLikePost::create([
          'user_id' => $request['user']['id'],
          'post_id' => $id_post,
          'status_id' => $request['status'],
        ]);

        return $new_like;
      }
    }

    public function starsPost(Request $request, $id_post)
    {
      // return $request;
      $exist_like = PivotUserLikePost::where('post_id', $id_post)->where('user_id', $request['user']['id'])->first();
      if (!empty($exist_like)) {
        $exist_like->stars = $request['stars'];
        $exist_like->save();
        return $exist_like;
      } else {
        $new_like = PivotUserLikePost::create([
          'user_id' => $request['user']['id'],
          'post_id' => $id_post,
          'status_id' => $request['status'],
          'stars' => $request['stars'],
        ]);

        return $new_like;
      }
    }
}
