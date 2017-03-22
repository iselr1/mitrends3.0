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
  .controller('HomeCtrl', function($scope, $state, jsonService, $translate, $ionicPopup, $ionicHistory) {
    var jsonData = jsonService.getJson();

    $scope.goKernsymp = function() {
      $state.go('kernsymptome');
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
  .controller('LoginCtrl', function($scope, $translate, jsonService, $timeout, $http, $state, $ionicLoading, $ionicPopup) {
    // Values for login
    $scope.login = {};
    $scope.login.email = '';
    $scope.login.password = '';
    $scope.login.server = 'https://test.midata.coop:9000';

    // Login
    $scope.doLogin = function() {
      //console.info(I4MIMidataService.currentUser());

      if ($scope.login.email != '' && $scope.login.password != '')
        I4MIMidataService.login($scope.login.email, $scope.login.password, $scope.login.server);
      //$scope.closeModal();
      // Zeige Loading Spinner
      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });

      setTimeout(function() {
        $scope.checkUser();
        // Verstecke Loading Spinner
        $ionicLoading.hide();
      }, 3000);
    }



    // Check if valid User
    $scope.checkUser = function() {
      console.info(I4MIMidataService.currentUser());
      if (I4MIMidataService.currentUser() !== undefined) {
        //$state.go('home');
        $state.go('kernsymptome');
      } else {
        I4MIMidataService.logout();
        //Inform the user that he's not logged in
        var jsonData = jsonService.getJson();
        var title = jsonData.LOGININFO;
        var template = jsonData.LOGINERRORTEXT;
        var alertPopup = $ionicPopup.alert({
          title: title,
          template: template,
        });
      }
    }

    // Logout
    $scope.logout = function() {
      console.info("Logout");
      I4MIMidataService.logout();
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
  .controller('ImpCtrl', function($scope, $stateParams, $state, $ionicPopup, jsonService) {
    var jsonData = jsonService.getJson();

    $scope.sendEmail = function() {
      if (window.plugins && window.plugins.emailComposer) {
        window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
            console.log("Response -> " + result);
          },
          jsonData.EMAIL_SUBJECT, // Subject
          "", // Body
          ["mitrends@outlook.com"], // To
          null, // CC
          null, // BCC
          false, // isHTML
          null, // Attachments
          null); // Attachment Data
      }
    }
  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Done Symbol Digit-----------------------//
  //--------------------------------------------------------//
  .controller('GeschafftSDCtrl', function($scope, $stateParams, $state, ExcersiseStorageService) {
    $scope.comment = {};

    $scope.goMSIS = function() {
      $state.go('msis');
    };
    $scope.$on('$ionicView.beforeLeave', function() {
      // Datenübermittlung an Service für lokale Speicherung
      console.log($scope.comment.text);

      ExcersiseStorageService.saveResultCommentsToFile("Kommentar Symbol-Digit", $scope.comment.text);
    });
  })
  //--------------------------------------------------------//
  //---------------CONTROLLER Done Labyrinth-----------------------//
  //--------------------------------------------------------//
  .controller('GeschafftLABCtrl', function($scope, $stateParams, $state, ExcersiseStorageService) {
    $scope.comment = {};

    $scope.goFSS = function() {
      $state.go('fatigue');
    };
    $scope.$on('$ionicView.beforeLeave', function() {
      // Datenübermittlung an Service für lokale Speicherung
      console.log($scope.comment.text);

      ExcersiseStorageService.saveResultCommentsToFile("Kommentar Labyrinth", $scope.comment.text);
    });
  })
