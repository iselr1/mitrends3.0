// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'ionic-datepicker', 'ionic-timepicker', 'formlyIonic', 'nvd3', 'i4mi', 'starter.controllers', 'starter.controllersRea', 'starter.controllersSarah', 'starter.services', 'jsonFormatter', 'pascalprecht.translate'])
  .constant('APPNAME', 'MitrendS2')
  .constant('APPSECRET', 'Mi3636trend9696S002')
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      //to be able to set the landscape orientation as default
      if (window.navigator && window.navigator.splashscreen) {
        window.plugins.orientationLock.unlock();

      }
      //alert("Current orientation" + window.screen.orienation);
    });
    //Disable backbutton
    $ionicPlatform.registerBackButtonAction(function(event) {
      event.preventDefault();
    }, 100);
    //check for platform
    /*
    if (ionic.Platform.isAndroid()) {
      console.log('cordova.file.dataDirectory: ' + cordova.file.dataDirectory);
      myFsRootDirectory1 = 'file:///storage/emulated/0/'; // path for tablet
      fileTransferDir = cordova.file.dataDirectory;
      if (fileTransferDir.indexOf(myFsRootDirectory1) === 0) {
        fileDir = fileTransferDir.replace(myFsRootDirectory1, '');
      }
      console.log('Android FILETRANSFERDIR: ' + fileTransferDir);
      console.log('Android FILEDIR: ' + fileDir);
    }
    if (ionic.Platform.isIOS()) {
      console.log('cordova.file.documentsDirectory: ' + cordova.file.documentsDirectory);
      fileTransferDir = cordova.file.documentsDirectory;
      fileDir = '';
      console.log('IOS FILETRANSFERDIR: ' + fileTransferDir);
      console.log('IOS FILEDIR: ' + fileDir);
    }

    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
      ClearDirectory();
      testFS();
      // Other functions here
    }*/
  })

  .config(function($stateProvider, $urlRouterProvider, $translateProvider) {

    // path to laod the language files
    $translateProvider.useStaticFilesLoader({
      prefix: 'js/locale-',
      suffix: '.json'
    });
    $translateProvider
      //register the supported languages, if the languages is other than the supported set it to the german file
      .registerAvailableLanguageKeys(['fr', 'de', 'en'], {
        'fr_*': 'fr',
        'de_*': 'fr',
        'en_*': 'en',
        '*': 'de'
      })
      //determine the system language
      .determinePreferredLanguage()
      //if the system language can't be determined set it to german
      .fallbackLanguage('fr');
    $translateProvider.useSanitizeValueStrategy('sanitize');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('impressum', {
        url: '/impressum',
        templateUrl: 'templates/impressum.html',
        controller: 'ImpCtrl'
      })

      .state('labyrinth', {
        url: '/labyrinth',
        templateUrl: 'templates/labyrinth.html',
        controller: 'LabCtrl'
      })

      .state('zahlsymbol', {
        url: '/zahlsymbol',
        templateUrl: 'templates/zahlsymbol.html',
        controller: 'ZSCtrl'
      })
      .state('zahlsymbol1', {
        url: '/zahlsymbol1',
        templateUrl: 'templates/zahlsymbol1.html',
        controller: 'ZS1Ctrl'
      })

      .state('kernsymptome', {
        url: '/kernsymptome',
        templateUrl: 'templates/kernsymptome.html',
        controller: 'KernsympCtrl'
      })

      .state('msis', {
        url: '/msis',
        templateUrl: 'templates/msis.html',
        controller: 'MsisCtrl'
      })

      .state('msis2', {
        url: '/msis2',
        templateUrl: 'templates/msis2.html',
        controller: 'Msis2Ctrl'
      })
      .state('msis3', {
        url: '/msis3',
        templateUrl: 'templates/msis3.html',
        controller: 'Msis3Ctrl'
      })
      .state('msis4', {
        url: '/msis4',
        templateUrl: 'templates/msis4.html',
        controller: 'Msis4Ctrl'
      })

      .state('fatigue', {
        url: '/fatigue',
        templateUrl: 'templates/fatigue.html',
        controller: 'FatigueCtrl'
      })

      .state('labyrinthAnl', {
        url: '/labyrinthAnl',
        templateUrl: 'templates/labyrinthAnl.html',
        controller: 'RouteAnlCtrl'
      })

      .state('zahlsymbol_anl', {
        url: '/zahlsymbol_anl',
        templateUrl: 'templates/zahlsymbol_anl.html',
        controller: 'ZahlsymbolAnlCtrl'
      })

      .state('geschafftSD', {
        url: '/geschafftSD',
        templateUrl: 'templates/geschafftSD.html',
        controller: 'GeschafftSDCtrl'
      })
      .state('geschafftLAB', {
        url: '/geschafftLAB',
        templateUrl: 'templates/geschafftLAB.html',
        controller: 'GeschafftLABCtrl'
      })

      .state('zahlsymbolVideo', {
        url: '/zahlsymbolVideo',
        templateUrl: 'templates/zahlsymbolVideo.html',
        controller: 'ZSVideoCtrl'
      })

      .state('labyrinthVideo', {
        url: '/labyrinthVideo',
        templateUrl: 'templates/labyrinthVideo.html',
        controller: 'LabyrinthVideoCtrl'
      })

    $urlRouterProvider.otherwise('/home')

  });
