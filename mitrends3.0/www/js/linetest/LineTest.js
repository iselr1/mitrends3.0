angular.module('uszapp.linetest')
        .factory('LineTest', ['$q', 'ReferenceLine', function ($q, ReferenceLine) {

                /**
                 * A class that represents one line test.
                 * It provides a `start` method that returns a promise of a result
                 * object that contains the time it took the user to complete
                 * the test and a score of how well the drawn line matched the
                 * reference line.
                 *
                 * @param canvas The canvas DOM element used to draw the test
                 * @param test An object of type { svgPath: string }
                 * @param debug Boolean flag if debug mode should be activated
                 */
                function LineTest(canvas, test, debug, mouseTracker, $ionicPopup) {
                    var horizontalMirror = Math.round(Math.random()) == 1;
                    var verticalMirror = Math.round(Math.random()) == 1;
                    var countStop = 0;
                    var self = this;

                    debug = debug || false;

                    var ctx = canvas.getContext('2d');
                    var startTime, endTime;
                    var testResultDef;
                    var mouseTracker = mouseTracker;

                    var referenceLine = new ReferenceLine({
                        canvas: canvas,
                        svgPath: test.svgPath,
                        debug: debug,
                        trimLength: LineTestConfig.START_END_CIRCLE_RADIUS,
                        mouseTracker: mouseTracker
                    });


                    var startPosition = referenceLine.getStartPosition();
                    var endPosition = referenceLine.getEndPosition();

                    //var isMouseDown = false;
                    var hasReachedEndArea = false;

                    // Create start and end areas
                    var startArea = new StartArea({
                        canvas: canvas,
                        position: startPosition,
                        radius: LineTestConfig.START_END_CIRCLE_RADIUS,
                        start: true,
                        mouseTracker: mouseTracker
                    });
                    var inStartArea = false;
//                    referenceLine.startTracking(startPosition);
                    startArea.on('LEFT_AREA', function (ev) {
                        //console.log('left-Area')
                        inStartArea = true;
                        referenceLine.startTracking(ev.position);
                        startTime = new Date();
                    });

                    var endArea = new EndArea({
                        canvas: canvas,
                        position: endPosition,
                        radius: LineTestConfig.START_END_CIRCLE_RADIUS,
                        start: false,
                        mouseTracker: mouseTracker
                    });

                    endArea.on('ENTERED_AREA', function () {
                        if (inStartArea) {
                            referenceLine.stopTracking();
                            referenceLine.lock();
                            startArea.lock();
                            endArea.lock();
                            hasReachedEndArea = true;
                            //console.info("endArea: has ended");
                            finish();
                            // TODO ?
                            //inStartArea = false;
                        }
                    });

                    mouseTracker.onUp(function (pos) {
                        if (!hasReachedEndArea) {
                              referenceLine.lock();
                              startArea.lock();
                              endArea.lock();
                              cancel('Mouse up before reaching end area.', $ionicPopup);
                              //console.info("mouseTracker : ONUP");
                        } else {
                            //console.info("mouseTracker : do nothing");
                            //console.info("mouseTracker : finish");
                            //hasTestEnded = false;
                            //finish();
                        }
                    });

                    // Setup the canvas with all elements
                    this.start = function () {
                        testResultDef = $q.defer();

                        if (hasReachedEndArea) {
                            // Dieser Fall tritt nie auf. Was war damit gemeint ?!?
                            //console.info("cancel: Test already done");
                            cancel('Test already done', $ionicPopup);
                        } else {
                            //console.info("start: setupCanvas");
                            setupCanvas();
                        }
                        return testResultDef.promise;
                    };

                    /**
                     * Utility function to draw the basic canvas contents.
                     */
                    function setupCanvas() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        referenceLine.draw();
                        endArea.draw();
                        startArea.draw();

                        if (debug) {
                            var refPoints = referenceLine.getReferencePoints();
                            var i = 0;
                            var sub = setInterval(function () {
                                if (i == refPoints.length - 1) {
                                    clearInterval(sub);
                                }
                                var p = refPoints[i];
                                i += 1;
                                markPoint(ctx, p.x, p.y, 1, 'black');
                            }, 5);
                        }
                    }

                    /**
                     * Compute scores and resolve result promise.
                     */
                    function finish() {
                        var scores = referenceLine.getScores();
                        endTime = new Date();
                        var timeInSeconds = (endTime - startTime) / 1000;
                        var canvasCopy = document.createElement('canvas');
                        canvasCopy.setAttribute('width', canvas.width);
                        canvasCopy.setAttribute('height', canvas.height);
                        var canvasCopyCtx = canvasCopy.getContext('2d');
                        canvasCopyCtx.drawImage(canvas, 0, 0);
                        testResultDef.resolve({
                            time: Math.round(timeInSeconds * 100) / 100,
                            score1: Math.round(scores.dmean * 100) / 100,
                            score2: Math.round(scores.dstd * 100) / 100,
                            canvas: canvasCopy
                        });

                        // FIXME: Only for explorative purposes, remove
                        // in final version.
                        // Create a CSV of points
                        var rpoints = referenceLine.getTrimmedReferencePoints();
                        var dpoints = referenceLine.getFollowedPathPoints();
                        if (rpoints.length !== dpoints.length) {
                            throw new Error('Arrays have unequal size');
                        }
                        var nPoints = rpoints.length;
                        var pref, pdrawn;
//            console.log('x_ref', 'y_ref', 'x_drawn', 'y_drawn');
                        for (var i = 0; i < nPoints; i++) {
                            pref = rpoints[i];
                            pdrawn = dpoints[i];
//                console.log(pref.x, pref.y, pdrawn.x, pdrawn.y);
                        }
                    }

                    /**
                     * Cancel the result promise.
                     */
                    function cancel(msg, $ionicPopup) {
//                        countStop++;
//                        if (mouseTracker.getClicks() / 4 >= 3) {
//                            if (countStop <= 1) {
//                                var alertPopup = $ionicPopup.alert({
//                                    template: 'Next test'
//                                });
//                                alertPopup.then(function (res) {
//                                    var canvasCopy = document.createElement('canvas');
//                                    testResultDef.resolve({
//                                        time: 0,
//                                        score1: 0,
//                                        score2: 0,
//                                        canvas: canvasCopy
//                                    });
//                                });
//                            }
//                        } else {
//                            console.log(msg)
                            testResultDef.reject(msg);
//                        }
                    }

                }

                return LineTest;

            }]);
