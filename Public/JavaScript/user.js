var app = angular.module("authcontroler", ["ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when("/user", {
      templateUrl: "/public/HTML/user/home.html",
      controller: "loginController"
    })
    .otherwise({
      redirectTo: "/user"
    });
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});
