$app = angular.module('pScheduling', [
	'ngRoute',
	'FCFSController',
	'PRIORController',
	'PREPRIORController',
	'SJFController',
	'SRTFController',
	'RROBINController'
]);

$app.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'templates/home.html'
		})
		.when('/fcfs', {
			templateUrl: 'templates/fcfs.html',
			controller: 'FCFSCtrl'
		})
		.when('/sjf', {
			templateUrl: 'templates/sjf.html',
			controller: 'SJFCtrl'
		})
		.when('/srtf', {
			templateUrl: 'templates/srtf.html',
			controller: 'SRTFCtrl'
		})
		.when('/prior', {
			templateUrl: 'templates/prior.html',
			controller: 'PRIORCtrl'
		})
		.when('/preprior', {
			templateUrl: 'templates/preprior.html',
			controller: 'PREPRIORCtrl'
		})
		.when('/rrobin', {
			templateUrl: 'templates/rrobin.html',
			controller: 'RROBINCtrl'
		})
		.otherwise({
			redirectTo: '/home'
		});
});

$app.filter('range', function() {
  return function(val, range) {
    range = parseInt(range);
    for (var i=0; i<range; i++)
      val.push(i);
    return val;
  };
});