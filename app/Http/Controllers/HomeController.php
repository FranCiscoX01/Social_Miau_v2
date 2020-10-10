<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Post;
use App\Picture;
use App\PivotUserLikePost;
use Auth;
use DB;

// SELECT status_id, COUNT(created_at) as 'count_like', created_at as 'date_count' FROM `pivot_user_like_post` GROUP BY created_at

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        if (Auth::check()) {
          return view('home');
        } else {
          return redirect(route('login'));
        }
    }

    public function userLogin()
    {
      $user = Auth::user();
      if ($user->picture_id != null) {
        $user->picture_data = Picture::find($user->picture_id);
      }
      return response()->json(['user' => $user]);
    }

    // API's
    public function getDashboard($id_user)
    {
      $data = DB::table('pivot_user_like_post')
                          ->select('pivot_user_like_post.status_id', 'pivot_user_like_post.created_at', DB::raw('COUNT(pivot_user_like_post.created_at) as count_like'))
                          ->join('post', 'post.id', '=', 'pivot_user_like_post.post_id')
                          ->where('post.user_id', $id_user)
                          ->groupBy('pivot_user_like_post.created_at')
                          ->groupBy('pivot_user_like_post.status_id')
                          ->limit(20)
                          ->get();

      return $data;
    }

    public function getMostLikedPost($id_user)
    {
      $exist_user = User::find($id_user);
      if (!empty($exist_user)) {
        $res = DB::table('post')
                        ->select('post.*', 'pictures.url', DB::raw('COUNT(pivot_user_like_post.id) as likes_post'))
                        ->join('pivot_user_like_post', 'pivot_user_like_post.post_id', '=', 'post.id')
                        ->join('pictures', 'post.picture_id', '=', 'pictures.id')
                        ->where('post.user_id', $id_user)
                        ->where('pivot_user_like_post.status_id', 4)
                        ->groupBy('pivot_user_like_post.post_id')
                        ->orderBy('post.updated_at', 'ASC')
                        ->get();


        return $res;
      } else {
        return response()->json(['error' => 'El usuario no existe']);
      }
    }

    public function getMostLovedPost($id_user)
    {
      $exist_user = User::find($id_user);
      if (!empty($exist_user)) {
        $res = DB::table('post')
                        ->select('post.*', 'pictures.url', DB::raw('COUNT(pivot_user_like_post.id) as likes_post'))
                        ->join('pivot_user_like_post', 'pivot_user_like_post.post_id', '=', 'post.id')
                        ->join('pictures', 'post.picture_id', '=', 'pictures.id')
                        ->where('post.user_id', $id_user)
                        ->where('pivot_user_like_post.status_id', 5)
                        ->groupBy('pivot_user_like_post.post_id')
                        ->orderBy('post.updated_at', 'ASC')
                        ->get();


        return $res;
      } else {
        return response()->json(['error' => 'El usuario no existe']);
      }
    }
}
