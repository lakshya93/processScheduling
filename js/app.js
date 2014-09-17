$app = angular.module('pScheduling', [
	'ngRoute',
	'FCFSController',
	'RRobinController'
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
		.when('/rrobin', {
			templateUrl: 'templates/rrobin.html',
			controller: 'RRobinCtrl'
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