<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'auth:api'], function () {
    // Picture Post
    Route::post('/picture-post', 'PicturesController@uploadFilePost');
    Route::post('/picture-post/delete', 'PicturesController@deleteFilePost');

    // All Post
    Route::post('/post/save', 'PostsController@savePost');
    Route::get('/post/get-all', 'PostsController@getAllPost');
    Route::post('/post/like/{id_post}', 'PostsController@likesPost');
    Route::post('/post/stars/{id_post}', 'PostsController@starsPost');

    // Dashboard
    Route::get('/dashboard/{id_user}', 'HomeController@getDashboard');
    Route::get('/dashboard/most-liked/{id_user}', 'HomeController@getMostLikedPost');
    Route::get('/dashboard/most-loved/{id_user}', 'HomeController@getMostLovedPost');

    // User
    Route::get('/profile/my-posts', 'UserController@getMyPosts');
    Route::post('/profile/presonal-info/update', 'UserController@updatePersonalInfo');
    Route::post('/profile/new-password/{id_user}', 'UserController@newPasswordUser');
});
