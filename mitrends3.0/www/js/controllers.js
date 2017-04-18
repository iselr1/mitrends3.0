angular.module('starter.controllers', [])

  //--------------------------------------------------------//
  //---------------CONTROLLER Navigation-----------------------//
  //--------------------------------------------------------//
  .controller('NavCtrl', function($scope, $state, jsonService, ownMidataService) {

    $scope.goHome = function() {
      $state.go('home');
    };

    $scope.doLogout = function() {
      //Logout function
      ownMidataService.logout();
      $state.go('login');
    }

  })
  //--------------------------------------------------------//
  //---------------CONTROLLER Home-----------------------//
  //--------------------------------------------------------//
  .controller('HomeCtrl', function($scope, $state, jsonService, $translate, $ionicPopup, $ionicHistory, $rootScope) {

    var jsonData = jsonService.getJson();

    $scope.goNext = function() {
      /** Version 3.0 Tablet first
        $state.go('symbolDigitPrep');
      **/
      $state.go('PointTestIntro');
    };

    //Change the language
    $scope.switchLanguage = function(key) {
      console.log(key);
      $translate.use(key);
      jsonService.loadJson(key).then(function() {
        jsonData = jsonService.getJson();
        $ionicHistory.clearCache();
      });
    };

    $scope.showDATATEXT = function() {
      console.log("hier");
      var alertPopup = $ionicPopup.alert({
        title: jsonData.DATAPROTECTION,
        template: jsonData.DATATEXT,
        okType: 'button-positive',
        okText: jsonData.UNDERSTOOD
      });
    }
  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Login-----------------------//
  //--------------------------------------------------------//
  .controller('LoginCtrl', function($scope, $translate, jsonService, $timeout, $http, $state, $ionicLoading, $ionicPopup, ownMidataService, $rootScope) {
    // Values for login
    $scope.login = {};
    $scope.login.email = '';
    $scope.login.password = '';
    $scope.login.pseudonym = '';
    $scope.login.state = 'home';

    //Inform the user that he's not logged in
    var jsonData = jsonService.getJson();
    var title = jsonData.LOGININFO;
    var template = jsonData.LOGINERRORTEXT;
    var noCredentials = jsonData.LOGINERRORCREDENTIALS;
    // Login
    $scope.doLogin = function() {
      //console.info(I4MIMidataService.currentUser());

      if ($scope.login.email != '' && $scope.login.password != '' && $scope.login.pseudonym != '') {
        ownMidataService.login($scope.login.email, $scope.login.password);

        // Zeige Loading Spinner
        $ionicLoading.show({
          template: '<p>Loading...</p><ion-spinner></ion-spinner>'
        });

        setTimeout(function() {
          $scope.checkUser();
          // Verstecke Loading Spinner
          $ionicLoading.hide();
        }, 3000);
      } else {
        var alertPopup = $ionicPopup.alert({
          title: title,
          template: noCredentials,
        });
      }
    }

    // Check if valid User
    $scope.checkUser = function() {
      console.info(ownMidataService.loggedIn());
      if (ownMidataService.loggedIn()) {
        ownMidataService.setFilename($scope.login.pseudonym);
        $rootScope.midataPseudonym = $scope.login.pseudonym;
        $state.go($scope.login.state);
      } else {
        ownMidataService.logout();

        var alertPopup = $ionicPopup.alert({
          title: title,
          template: template,
        });
      }
    }

    // Logout
    $scope.logout = function() {
      console.info("Logout");
      ownMidataService.logout();
    }

    //Change the language
    $scope.switchLanguage = function(key) {
      $translate.use(key);
      jsonService.loadJson(key);
    };

  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Impressum-----------------------//
  //--------------------------------------------------------//
  .controller('ImpCtrl', function($scope, $stateParams, $state, $ionicPopup, ownMidataService) {

    $scope.doLogout = function() {
      console.info("Logout");
      ownMidataService.logout();
      $state.go('login');
    };

    $scope.closeApp = function() {
      console.info("Logout");
      ownMidataService.logout();
      ionic.Platform.exitApp();
      window.close();
    }
  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Done Labyrinth-----------------------//
  //--------------------------------------------------------//
  .controller('GeschafftLabCtrl', function($scope, $stateParams, $state) {

    $scope.goNext = function() {
      /** Version 3.0 Tablet first
      $state.go('PointTestIntro');
      **/
      $state.go('impressum');
    };

  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Done Symbol Digit-----------------------//
  //--------------------------------------------------------//
  .controller('GeschafftSDCtrl', function($scope, $stateParams, $state) {

    $scope.goNext = function() {
      $state.go('labyrinth');
    };
  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Done Point-----------------------//
  //--------------------------------------------------------//
  .controller('GeschafftPointCtrl', function($scope, $stateParams, $state) {

    $scope.goNext = function() {
      $state.go('LineTestIntro');
    };

  })
