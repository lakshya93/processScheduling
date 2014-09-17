$app = angular.module('pScheduling', ['ngRoute','pSchedulingControllers']);

$app.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'templates/home.html'
		})
		.when('/fcfs', {
			templateUrl: 'templates/fcfs.html',
			controller: 'FCFSCtrl'
		})
		.otherwise({
			redirectTo: '/home'
		});
});