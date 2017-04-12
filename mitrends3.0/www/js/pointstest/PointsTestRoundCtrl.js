angular.module('uszapp.pointstest')
  .controller('PointsTestRoundCtrl', function($rootScope, PointsTest, $scope, $timeout, $ionicPopup, $state, $cordovaNativeAudio, $ionicHistory, $ionicPlatform, $ionicBackdrop, $ionicModal, ownMidataService) {

    var self = this;

    // Points to the current test (needed for cleanup when navigating
    // away).
    var currentTest;

    // Config
    var TIME_PER_ROUND = 60; // # seconds per round
    // Where the start triangle can be set
    var startPositionQuarters = [
      'topLeft', 'topRight', 'bottomLeft', 'bottomRight'
    ];
    // By how much the target can be rotated
    var targetRotations = [-30, -60];

    var testRunning = false;
    this.timeCounter = TIME_PER_ROUND;
    this.figureCounterLeft = 0;
    this.figureCounterRight = 0;
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

        $rootScope.isLeftHandNext ? self.figureCounterLeft++ : self.figureCounterRight++;

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
      var pointTest;

      if ($rootScope.isLeftHandNext) {
        // TODO: Save figureCounterRight to midata
        console.info("Amount of figure Right: " + self.figureCounterRight);
        pointTest = new midata.MSMotTestDot(new Date(), "right");
        pointTest.addDuration(TIME_PER_ROUND);
        pointTest.addPoints(self.figureCounterRight);

        $state.go('leftHandPointTest');
      } else {
        openEndScreen();

        // TODO: Save figureCounterLeft to midata
        console.info("Amount of figure Left : " + self.figureCounterLeft);
        pointTest = new midata.MSMotTestDot(new Date(), "left");
        pointTest.addDuration(TIME_PER_ROUND);
        pointTest.addPoints(self.figureCounterLeft);

        console.info('FINISHED PointsTest');
      }
      console.log("midata");
      ownMidataService.addToBundle(pointTest);
      ownMidataService.saveLocally(pointTest);
    }

    function openEndScreen() {
      /**$rootScope.headerTitleDone = "Teil 3 von 4 - Punkte bewegen";
      $rootScope.stateAfterDone = 'LineTestIntro';
      $rootScope.imgSrc = 'img/threeStars.png';**/
      $state.go('geschafftPoint');
    }

    this.startTests();

  });
