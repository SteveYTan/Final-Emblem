angApp.config(function ($routeProvider) {
	$routeProvider
	.when('/', {templateUrl: 'partials/main.html'})
	.when('/game', {templateUrl: 'partials/game.html'})
	.when('/login', {templateUrl: 'partials/login.html'})
	.when('/users', {templateUrl: 'partials/customers.html'})
	.otherwise({redirectTo: '/login'});
})
