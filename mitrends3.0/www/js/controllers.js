angular.module('starter.controllers', [])

  //--------------------------------------------------------//
  //---------------CONTROLLER Navigation-----------------------//
  //--------------------------------------------------------//
  .controller('NavCtrl', function($scope, $state, jsonService) {

    $scope.goHome = function() {
      $state.go('home');
    };

    $scope.doLogout = function() {
      //Logout function
      I4MIMidataService.logout();
      $state.go('login');
    }

  })
  //--------------------------------------------------------//
  //---------------CONTROLLER Home-----------------------//
  //--------------------------------------------------------//
  .controller('HomeCtrl', function($scope, $state, jsonService, $translate, $ionicPopup, $ionicHistory, $rootScope) {
    //$rootScope.videoSrc = 'video/symboldigit.mp4';
    //$rootScope.stateAfterVideo = 'zahlsymbol1';
    //$rootScope.headerTitleVideo = 'Teil 1 von 4 - Zahl-Symbol'
    var jsonData = jsonService.getJson();

    $scope.goNext = function() {
      //$state.go('anleitungsvideo');
      //JUST FOR TESTING
      $state.go('zahlsymbol1');
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
    $scope.login.email = 'iselr1@bfh.ch';
    $scope.login.password = 'MSbfh14+';
    $scope.login.pseudonym = 'Test2';
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
        $state.go('home');
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
  .controller('ImpCtrl', function($scope, $stateParams, $state, $ionicPopup) {

    $scope.goHome = function() {
      $state.go('home');
    };
    $scope.closeApp = function() {
      ionic.Platform.exitApp();
      window.close();
    }
  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Done Labyrinth-----------------------//
  //--------------------------------------------------------//
  .controller('GeschafftLabCtrl', function($scope, $stateParams, $state, $rootScope) {

    /**headerTitleDone = $rootScope.headerTitleDone;
    imgSrc = $rootScope.imgSrc;
    console.log($rootScope.stateAfterDone);**/
    $scope.goNext = function() {
      $state.go('PointTestIntro');
    };

  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Done Symbol Digit-----------------------//
  //--------------------------------------------------------//
  .controller('GeschafftSDCtrl', function($scope, $stateParams, $state, $rootScope) {

    /**headerTitleDone = $rootScope.headerTitleDone;
    imgSrc = $rootScope.imgSrc;
    console.log($rootScope.stateAfterDone);**/
    $scope.goNext = function() {
      $state.go('labyrinth');
    };
  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Done Point-----------------------//
  //--------------------------------------------------------//
  .controller('GeschafftPointCtrl', function($scope, $stateParams, $state, $rootScope) {

    /**headerTitleDone = $rootScope.headerTitleDone;
    imgSrc = $rootScope.imgSrc;
    console.log($rootScope.stateAfterDone);**/
    $scope.goNext = function() {
      $state.go('LineTestIntro');
    };

  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Anleitungsvideos----//
  //--------------------------------------------------------//
  .controller('AnleitungsvideoCtrl', function($scope, $state, $timeout, $rootScope) {
    videoSrc = $rootScope.videoSrc;
    headerTitle = $rootScope.headerTitleVideo;

    $scope.hideButton = true;

    $scope.goNext = function() {
      $state.go($rootScope.stateAfterVideo);
    };
    // to display the next button after 60 seconds
    $timeout(function() {
      $scope.hideButton = false;
    }, 1000);
  })
