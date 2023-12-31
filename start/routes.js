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
	Route.get('profile/history-report', 'ProfileController.historyReport')
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
	Route.post('user/update/password', 'UserController.updatePassword')
	Route.post('user/delete', 'UserController.delete')
	// SPBU
	Route.get('spbu', 'SpbuController.get')
	Route.post('spbu/store', 'SpbuController.store')
	Route.post('spbu/update', 'SpbuController.update')
	Route.post('spbu/delete', 'SpbuController.delete')
	// Product
	Route.get('product', 'ProductController.get')
	Route.get('product-spbu', 'ProductController.getBySpbu')
	Route.post('product/store', 'ProductController.store')
	Route.post('product/update', 'ProductController.update')
	Route.post('product/delete', 'ProductController.delete')
	// Payment Method
	Route.get('payment-method', 'PaymentMethodController.get')
	Route.post('payment-method/store', 'PaymentMethodController.store')
	Route.post('payment-method/update', 'PaymentMethodController.update')
	Route.post('payment-method/delete', 'PaymentMethodController.delete')
	Route.post('payment-method/delete/icon', 'PaymentMethodController.deleteIcon')
	// Shift
	Route.get('shift/', 'ShiftController.get')
	Route.post('shift/store', 'ShiftController.store')
	Route.post('shift/update', 'ShiftController.update')
	Route.post('shift/delete', 'ShiftController.delete')
	// Feeder Tank
	Route.get('feeder-tank/', 'FeederTankController.get')
	Route.post('feeder-tank/store', 'FeederTankController.store')
	Route.post('feeder-tank/update', 'FeederTankController.update')
	Route.post('feeder-tank/delete', 'FeederTankController.delete')
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
	// Report Nozzle
	Route.get('report-nozzle/', 'ReportNozzleController.get')
	Route.post('report-nozzle/store', 'ReportNozzleController.store')
	Route.post('report-nozzle/update', 'ReportNozzleController.update')
	Route.post('report-nozzle/delete', 'ReportNozzleController.delete')
	// Report Payment
	Route.get('report-payment/', 'ReportPaymentController.get')
	Route.post('report-payment/store', 'ReportPaymentController.store')
	Route.post('report-payment/update', 'ReportPaymentController.update')
	Route.post('report-payment/delete', 'ReportPaymentController.delete')
	// Report CoWorker
	Route.get('report-coworker/', 'ReportCoWorkerController.get')
	Route.post('report-coworker/store', 'ReportCoWorkerController.store')
	Route.post('report-coworker/delete', 'ReportCoWorkerController.delete')
	// Get Report
	Route.get('report', 'ReportController.index')
	Route.post('report/nozzle/update', 'ReportController.updateNozzle')
	Route.post('report/payment/update', 'ReportController.updatePayment')
	Route.post('report/feeder-tank/update', 'ReportController.updateFeederTank')
	// Losis
	Route.get('losis', 'ReportController.getReportLosis')
	Route.get('losis/export', 'ReportController.losisExportExcel')

	// Notification
	Route.get('notification', 'NotificationController.get')
	Route.get('notification/count-unread', 'NotificationController.countUnread')
	Route.get('notification/create', 'NotificationController.create')

	// Voucher SPBU
	Route.get('spbu/voucher/unused', 'VoucherController.UnusedVoucher')
	Route.get('spbu/voucher/used', 'VoucherController.UsedVoucher')
	Route.get('spbu/voucher/export/:status', 'VoucherController.exportExcel')

	// Company
	Route.get('company', 'CompanyController.get')
	Route.get('company/history', 'CompanyController.history')
	Route.get('company/voucher', 'CompanyController.voucher')
	Route.get('company/voucher/show', 'CompanyController.ShowVoucher')
	Route.get('company/voucher/unused', 'CompanyController.UnusedVoucher')
	Route.get('company/voucher/used', 'CompanyController.UsedVoucher')
	Route.get('company/voucher/export/:status', 'CompanyController.exportExcel')
	Route.post('company/store', 'CompanyController.store')
	Route.post('company/update', 'CompanyController.update')
	Route.post('company/delete', 'CompanyController.destroy')

	// Report for mobile API
	// Report Operator
	Route.get('mobile/shift', 'mobile/OperatorReportController.getShift')
	Route.get('mobile/island', 'mobile/OperatorReportController.getIsland')
	Route.get('mobile/nozzle', 'mobile/OperatorReportController.getNozzle')
	Route.get('mobile/payment', 'mobile/OperatorReportController.getPayment')
	Route.get('mobile/co-worker', 'mobile/OperatorReportController.getCoWorker')
	Route.post('mobile/report/operator', 'mobile/OperatorReportController.store')
	Route.post('mobile/voucher/redeem', 'VoucherController.redeemVoucher')
	// Report Admin
	Route.get('mobile/admin/shift', 'mobile/AdminReportController.getShift')
	Route.get('mobile/admin/feeder-tank', 'mobile/AdminReportController.getFeederTank')
	Route.get('mobile/admin/nozzle', 'mobile/AdminReportController.getNozzle')
	Route.get('mobile/admin/payment', 'mobile/AdminReportController.getPayment')
	Route.get('mobile/admin/co-worker', 'mobile/AdminReportController.getCoWorker')
	Route.get('mobile/admin/review-data', 'mobile/AdminReportController.getReviewData')
	Route.post('mobile/admin/nozzle', 'mobile/AdminReportController.updateNozzle')
	Route.post('mobile/admin/nozzle/item', 'mobile/AdminReportController.updateNozzleItem')
	Route.post('mobile/admin/payment', 'mobile/AdminReportController.updatePayment')
	Route.post('mobile/admin/payment/item', 'mobile/AdminReportController.updatePaymentItem')
	Route.post('mobile/admin/co-worker', 'mobile/AdminReportController.updateCoWorker')
	Route.post('mobile/admin/co-worker/remove', 'mobile/AdminReportController.removeCoWorker')
	Route.post('mobile/report/admin', 'mobile/AdminReportController.store')
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
