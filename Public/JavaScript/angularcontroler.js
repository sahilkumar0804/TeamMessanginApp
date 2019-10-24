var app = angular.module("authcontroler", ["ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "/public/HTML/auth/login.html",
      controller: "loginController"
    })
    .when("/signup", {
      templateUrl: "/public/HTML/auth/signup.html",
      controller: "signupController"
    })
    .when("/user", {
      templateUrl: "/public/HTML/user/home.html"
      // controller: "home"
    })
    .when("/create", {
      templateUrl: "/public/HTML/user/createChannel.html",
      controller: "createChannel"
    })
    .when("/find", {
      templateUrl: "/public/HTML/user/search.html"
    })
    .when("/dashbord", {
      templateUrl: "/public/HTML/user/dashbord.html"
    });

  // .otherwise({
  // redirectTo: "/"
  //  });
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});

app.controller("loginController", [
  "$scope",
  "$http",
  "$location",
  function($scope, $http, $location) {
    $scope.username = "";
    $scope.password = "";
    function Login() {
      console.log($scope.username);
      $http({
        method: "POST",
        data: { username: $scope.username, password: $scope.password },
        url: "/login"
      }).then(
        function successCallback(res) {
          if (res.data == "success") {
            $location.path("/user");
          } else {
            alert("username or password is not correct");
            $location.path("/");
          }
        },
        function errorCallback(response) {
          console.log("err");
        }
      );
    }
    $scope.Login = Login;
  }
]);

app.controller("signupController", [
  "$scope",
  "$http",
  "$location",
  function($scope, $http, $location) {
    $scope.username = "";
    $scope.password = "";
    $scope.confirmpassword = "";
    $scope.email = "";
    $scope.region = "";
    function signup() {
      console.log($scope.username);
      $http({
        method: "POST",
        data: {
          username: $scope.username,
          password: $scope.password,
          confirm: $scope.confirmpassword,
          email: $scope.email,
          region: $scope.region
        },
        url: "/signup"
      }).then(
        function successCallback(res) {
          if (res.data == "done") $location.path("/");
          else {
            alert("confirm password is not matched");
          }
        },
        function errorCallback(response) {
          console.log("err");
        }
      );
    }
    $scope.signup = signup;
  }
]);

app.controller("createChannel", [
  "$scope",
  "$http",
  "$location",
  function($scope, $http, $location) {
    $scope.name = "";
    $scope.disc = "";
    $scope.tag = "";
    function create() {
      console.log($scope.username);
      $http({
        method: "POST",
        data: {
          name: $scope.name,
          disc: $scope.disc,
          tag: $scope.tag
        },
        url: "/createChannel"
      }).then(
        function successCallback(res) {
          if (res.data == "created") {
            alert("Channel created");
            $scope.name = "";
            $scope.disc = "";
            $scope.tag = "";
            $location.path("/create");
          } else {
            alert("error in creating channel");
          }
        },
        function errorCallback(response) {
          console.log("err");
        }
      );
    }
    $scope.create = create;
  }
]);
