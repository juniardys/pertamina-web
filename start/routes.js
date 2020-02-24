'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');
const Next = use('Adonis/Addons/Next');
const handler = Next.getRequestHandler();

// API Endpoint for your database
Route.get('/api', ({ request }) => {
	return { greeting: "I'm Api Endpoint" };
});

Route.post('api/v1/sign-in', 'AuthenticationController.signIn').middleware(['secureApi'])

Route.group(() => {
	Route.get('role', 'RoleController.get')
	Route.post('role/store', 'RoleController.store')
	Route.post('role/update', 'RoleController.update')
	Route.post('role/delete', 'RoleController.delete')
	Route.get('users', 'UserController.get')
}).prefix('api/v1').middleware(['secureApi', 'auth'])

// * Next Routes
Route.get('/b', ({ request, response }) => {
	const query = request.get();
	return Next.render(request.request, response.response, '/b', query);
});

Route.get('/post/:id', ({ request, response, params }) =>
	Next.render(request.request, response.response, '/b', {
		id: params.id
	})
);

Route.get(
	'*',
	({ request, response }) =>
		new Promise((resolve, reject) => {
			handler(request.request, response.response, promise => {
				promise.then(resolve).catch(reject);
			});
		})
);
