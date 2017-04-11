angular.module('uszapp.pointstest')
  .controller('PointsTestRoundCtrl', function($rootScope, PointsTest, $scope, $timeout, $ionicPopup, $state, $cordovaNativeAudio, $ionicHistory, $ionicPlatform, $ionicBackdrop, $ionicModal) {

    var self = this;

    // Points to the current test (needed for cleanup when navigating
    // away).
    var currentTest;

    // Config
    var TIME_PER_ROUND = 30; // # seconds per round
    // Where the start triangle can be set
    var startPositionQuarters = [
      'topLeft', 'topRight', 'bottomLeft', 'bottomRight'
    ];
    // By how much the target can be rotated
    var targetRotations = [-30, -60];

    var testRunning = false;
    this.timeCounter = TIME_PER_ROUND;
    this.figureCounter = 0;

    $ionicPlatform.ready(function() {
      var isWebView = ionic.Platform.isWebView();
      if (isWebView) {
        $cordovaNativeAudio.preloadSimple('ding', 'audio/ding.mp3');
      }
    });

    // $ionicModal.fromTemplateUrl('templates/pointstest/round-info-modal.html', {
    //     scope: $scope,
    //     backdropClickToClose: false,
    //     hardwareBackButtonClose: false
    // }).then(function(modal) {
    //     $scope.modal = modal;
    //     modal.show();
    // });

    this.startTests = function() {
      start();
    };

    // Start first round
    function start() {
      var startTime = new Date();
      var sub = setInterval(function() {
        testRunning = true;
        var time = new Date();
        var elapsedTime = Math.round((time - startTime) / 1000);
        var remainingTime = TIME_PER_ROUND - elapsedTime;
        self.timeCounter = remainingTime;
        // Angular doesn't update the view automatically
        $scope.$apply();
        if (elapsedTime >= TIME_PER_ROUND) {
          clearInterval(sub);
          endPointsTestRound();
        }
      }.bind(this), 1000);
      startNewTest();
    }

    function startNewTest() {
      var test = new PointsTest({
        startPositionQuarter: _.sample(startPositionQuarters),
        targetRotation: _.sample(targetRotations)
      });
      currentTest = test;
      test.on('TEST_DONE', function() {
        test.destroy();
        self.figureCounter += 1;
        $cordovaNativeAudio.play('ding');
        if (testRunning) {
          startNewTest();
        }
      });
      test.start();
    }

    function endPointsTestRound() {
      testRunning = false;

      $rootScope.isLeftHandNext = $ionicHistory.backView().url == "/rightHandPointTest" ? true : false;

      if ($rootScope.isLeftHandNext)
        $state.go('leftHandPointTest');
      else
        openEndScreen();
      console.info('FINISHED');
    }

    function openEndScreen() {
      $rootScope.headerTitleDone = "Teil 3 von 4 - Punkte bewegen";
      $rootScope.stateAfterDone = 'LineTestIntro';
      $rootScope.imgSrc = 'img/threeStars.png';
      $state.go('geschafft');
    }

    this.startTests();

  });
