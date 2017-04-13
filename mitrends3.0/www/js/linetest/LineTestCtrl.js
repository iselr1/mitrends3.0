angular.module('uszapp.linetest')
  .controller('LineTestCtrl', ['$scope', '$state', 'LineTest', 'lineTests', '$timeout', '$ionicPopup', '$rootScope', 'ownMidataService',
    function($scope, $state, LineTest, lineTests, $timeout, $ionicPopup, $rootScope, ownMidataService) {

      var canvas = $('canvas.line-canvas')[0];
      var currentCategoryIdx; // the current index in the `lineTests` array
      var lineTest;
      $scope.$on("$ionicView.beforeEnter", function() {
        canvas.height = window.innerHeight * 0.9;
        canvas.width = window.innerWidth * 0.9;
        //                    $('.message1').width(window.innerWidth * 0.25);
        init();
      });

      /**
       * Initialize the controller.
       * The initialization code is wrapped in this function since
       * the controller has to be reset whenever the user visits
       * the linetest state again using the beforeEnter event.
       * Somehow, angular doesn't destroy controller instances when
       * the state is left.
       */
      function init() {
        $scope.debug = false;
        $scope.showAnimation1 = true;
        $scope.showAnimation2 = false;
        currentCategoryIdx = 0; // the current index in the linetests array
        $scope.showSummary = false; // if the summary screen should be shown
        $scope.showTest = false; // if the summary screen should be shown
        $scope.showDone = false; // if the done screen should be shown
        $scope.showRightHand = false;
        $scope.showLeftHand = false;
        $scope.canRestart = false; // if the line test can be restarted
        $scope.canDoNext = false; // if the user can proceed to the next test
        $scope.resultHistory = []; // saved results
        $scope.allTestsFinished = false; // if all tests are finished
        $scope.endMessage = ''; // success or error message
        $scope.time = ''; // time for the current test
        $scope.score = ''; // score for the current test
        $scope.success = false; // if the test was successful
        $scope.done = false; // if the test was finished (successfully or also if it failed)

        $scope.count = 0;
      }

      $scope.initTest = function() {
        $scope.showAnimation1 = false;
        $scope.showAnimation2 = false;
        $scope.showSummary = false;
        $scope.showTest = false;
        $scope.showRightHand = false;
        $scope.showLeftHand = false;
        $scope.showDone = false;
        $timeout(function() {
          $scope.mouseTracker = new MouseTracker(canvas);
          loadTest(currentCategoryIdx);
          startTest();
          $scope.showTest = true;
        }, 200);
      }

      function loadTest(categoryIndex) {
        var test = _.sample(lineTests[categoryIndex].tests);
        // var test = lineTests[0].tests[0];
        lineTest = new LineTest(canvas, test, $scope.debug, $scope.mouseTracker, $ionicPopup);
      }

      function startTest() {
        $scope.canRestart = false;
        $scope.success = false;
        $scope.done = false;
        $scope.canDoNext = false;

        lineTest.start().then(function(result) {
          $scope.count++;
          $scope.done = true;
          $scope.success = true;
          $scope.difference = result.score1;
          $scope.similarity = result.score2;
          $scope.time = result.time;
          $scope.canRestart = false;
          $scope.canDoNext = true;
          $scope.allTestsFinished = currentCategoryIdx === lineTests.length - 1;
          if ($scope.count > 4) {
            result.test = 'left';
          } else {
            result.test = 'right';
          }

          if ($scope.allTestsFinished) {
            $scope.endMessage = 'Weiter zur Zusammenfassung.';
          } else {
            $scope.endMessage = 'Nächster Test.';
          }
          $scope.resultHistory.push(result);




          // TODO: Save score1,score2,score3 to midata
          console.info("Abweichung : " + $scope.difference);
          console.info("Ähnlichkeit : " + $scope.similarity);
          console.info("Time : " + $scope.time);
          //Speicherung Midata
          var linetest = new mitrends.MSMotTestLine(new Date(), result.test);
          if (result.test == 'left') {
            console.log($scope.count);
            linetest.addLxDuration($scope.time, ($scope.count - 4));
            linetest.addLxAvgDist($scope.difference, ($scope.count - 4));
            linetest.addLxStdDevDist($scope.similarity, ($scope.count - 4));
          } else {
            linetest.addLxDuration($scope.time, $scope.count);
            linetest.addLxAvgDist($scope.difference, $scope.count);
            linetest.addLxStdDevDist($scope.similarity, $scope.count);
          }

          console.log("midata");
          ownMidataService.addToBundle(linetest);
          ownMidataService.saveLocally(linetest);


          $scope.mouseTracker.initialiseClicks();
          $timeout(function() {
            $scope.nextTest();
          }, 500);
          //console.log(currentCategoryIdx)
        }, function(err) {
          $scope.done = true;
          $scope.success = false;
          $scope.endMessage = err;
          $scope.canRestart = true;
          $scope.canDoNext = false;
          var alertPopup = $ionicPopup.alert({
            template: 'Die Linie war nicht durchgängig. Beginnen Sich nochmals neu bei Start.'
          });

          alertPopup.then(function(res) {
            $scope.restart();
          });
        });
      }
      $scope.beginLeft = function() {
        $scope.showAnimation1 = false;
        $scope.showSummary = false;
        $scope.showTest = false;
        $scope.showRightHand = false;
        $scope.showDone = false;
        $scope.showLeftHand = false;
        $timeout(function() {
          currentCategoryIdx = 0;
          loadTest(currentCategoryIdx);
          startTest();
          $scope.showTest = true;
        }, 200);
      }
      $scope.nextTest = function() {
        if ($scope.allTestsFinished) {
          _($scope.resultHistory).each(function(res) {
            res.canvas.style.width = '400px';
            res.canvas.style.height = '300px';
          });
          if ($scope.count === lineTests.length) {
            $scope.showAnimation1 = false;
            $scope.showSummary = false;
            $scope.showTest = false;
            $scope.showDone = false;
            $scope.showRightHand = false;
            $scope.showLeftHand = true;
          } else {
            //                            $scope.showAnimation1 = false;
            //                            $scope.showAnimation2 = false;
            //                            $scope.showSummary = true;
            //                            $scope.showTest = false;
            $scope.showLeftHand = false;
            $scope.showAnimation1 = false;
            $scope.showSummary = false;
            $scope.showTest = false;
            $scope.showDone = false;
            $scope.showRightHand = false;
            $scope.showDone = true; // show Done content

            //Speichern aller Midataeinträge
            var allTestObjects = new mitrends.MSTests(new Date(), $rootScope.midataPseudonym);
            console.log(ownMidataService.getBundle());
            for (entry of ownMidataService.getBundle().getObservationEntries()) {
              console.log(entry);
              console.log(entry.resource);
              allTestObjects.addRelated(entry.resource);
            }
            ownMidataService.addToBundle(allTestObjects);
            ownMidataService.saveBundle();

          }
        } else {
          console.log('nextTest')
          currentCategoryIdx += 1;
          loadTest(currentCategoryIdx);
          startTest();
        }
      };

      $scope.goLeftHand = function() {
        $scope.showAnimation1 = false;
        $scope.showSummary = false;
        $scope.showTest = false;
        $scope.showRightHand = false;
        $scope.showDone = false;
        $scope.showLeftHand = true;
      };

      $scope.goRightHand = function() {
        $scope.showAnimation1 = false;
        $scope.showSummary = false;
        $scope.showTest = false;
        $scope.showDone = false;
        $scope.showRightHand = true;
        $scope.showLeftHand = false;
      };

      $scope.goImpressum = function() {
        $state.go('impressum');
      }

      $scope.restart = function() {
        loadTest(currentCategoryIdx);
        startTest();
      };

    }
  ])
  .directive('injectElement', function() {
    return {
      restrict: 'A',
      scope: {
        injectElement: '='
      },
      link: function(scope, element) {
        element.append(scope.injectElement);
      }
    };
  });
