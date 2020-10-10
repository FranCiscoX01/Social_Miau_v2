/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */


require('./components/Example');

/*
* Dashboard
*/
require('./components/App')
require('./components/TabBar')
require('./components/Dashboard')
require('./components/menu/MostLikedCard')
require('./components/menu/MostLovedCard')

/*
* POST
*/
require('./components/post/PublicPost')
require('./components/post/NewPost')

/*
* User
*/
require('./components/user/UserIndex')
require('./components/user/HomeProfile')
require('./components/user/PersonalInfo')
require('./components/user/UserSecurity')
