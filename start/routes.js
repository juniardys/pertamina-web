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
Route.post('api/v1/sign-in', 'V1/AuthenticationController.signIn').middleware(['secureApi'])
Route.post('api/v1/sign-in/client', 'V1/AuthenticationController.signInClient').middleware(['secureApi'])
Route.group(() => {
	// Dashboard
	Route.get('dashboard', 'DashboardController.get')
	// Access List
	Route.get('acl', 'AclController.get')
	Route.get('acl-jstree', 'AclController.getJsTree')
	// Profile
	Route.get('profile', 'ProfileController.get')
	Route.post('profile', 'ProfileController.update')
	Route.post('profile-password', 'ProfileController.updatePassword')
	// Role
	Route.get('role', 'RoleController.get')
	Route.post('role/store', 'RoleController.store')
	Route.post('role/update', 'RoleController.update')
	Route.post('role/delete', 'RoleController.delete')
	// User
	Route.get('user', 'UserController.get')
	Route.post('user/store', 'UserController.store')
	Route.post('user/update', 'UserController.update')
	Route.post('user/delete', 'UserController.delete')
	// SPBU
	Route.get('spbu', 'SpbuController.get')
	Route.post('spbu/store', 'SpbuController.store')
	Route.post('spbu/update', 'SpbuController.update')
	Route.post('spbu/delete', 'SpbuController.delete')
	// Product
	Route.get('product', 'ProductController.get')
	Route.post('product/store', 'ProductController.store')
	Route.post('product/update', 'ProductController.update')
	Route.post('product/delete', 'ProductController.delete')
	// Payment Method
	Route.get('payment-method', 'PaymentMethodController.get')
	Route.post('payment-method/store', 'PaymentMethodController.store')
	Route.post('payment-method/update', 'PaymentMethodController.update')
	Route.post('payment-method/delete', 'PaymentMethodController.delete')
	// Shift
	Route.get('shift/', 'ShiftController.get')
	Route.post('shift/store', 'ShiftController.store')
	Route.post('shift/update', 'ShiftController.update')
	Route.post('shift/delete', 'ShiftController.delete')
	// Island
	Route.get('island/', 'IslandController.get')
	Route.post('island/store', 'IslandController.store')
	Route.post('island/update', 'IslandController.update')
	Route.post('island/delete', 'IslandController.delete')
	// Nozzle (Pompa)
	Route.get('nozzle/', 'NozzleController.get')
	Route.post('nozzle/store', 'NozzleController.store')
	Route.post('nozzle/update', 'NozzleController.update')
	Route.post('nozzle/delete', 'NozzleController.delete')
	// SPBU Payment
	Route.get('spbu/payment', 'SpbuPaymentController.get')
	Route.post('spbu/payment/update', 'SpbuPaymentController.update')
	// Order
	Route.get('order/', 'OrderController.get')
	Route.post('order/store', 'OrderController.store')
	Route.post('order/update', 'OrderController.update')
	Route.post('order/delete', 'OrderController.delete')
	// Delivery
	Route.get('delivery/', 'DeliveryController.get')
	Route.post('delivery/store', 'DeliveryController.store')
	Route.post('delivery/update', 'DeliveryController.update')
	Route.post('delivery/delete', 'DeliveryController.delete')
}).namespace('V1').prefix('api/v1').middleware(['secureApi', 'auth'])

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
