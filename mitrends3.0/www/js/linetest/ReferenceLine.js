angular.module('uszapp.linetest')
        .factory('ReferenceLine', ['PathSampler', function (PathSampler) {
                function ReferenceLine(opt) {
                    var canvas = opt.canvas;
                    var ctx = opt.canvas.getContext('2d');
                    var debug = opt.debug || false;
                    // How much to trim of the reference line, see below.
                    var trimLength = opt.trimLength;

                    // An array where the points should be stored that
                    // the user draws onto the canvas.
                    var followedPath = [];

                    // The final array of points along the drawn line
                    // that are computed when the test finishes.
                    var followedPathPoints;

                    var svgPath = opt.svgPath;
                    var startPos = getPathStart(svgPath);
                    
                    // Get some points along the reference path
                    var refPoints = PathSampler.sampleSVGPath(
                            svgPath, canvas.width, canvas.height, startPos
                            );

                    // The end position of the drawn line is the
                    // last point of the traced reference line.
                    var endPos = refPoints[refPoints.length - 1];
                    var emitter = new EventEmitter();

                    // A helper object that is used to track mouse/touch
                    // events.
                    var mouseTracker = opt.mouseTracker;

                    var mousedown = false;
                    var shouldTrack = false;
                    var locked = false;

                    mouseTracker.onDown(function (pos) {
                        mousedown = true;
                    }.bind(this));

                    mouseTracker.onUp(function (pos) {
                        mousedown = false;
                    }.bind(this));

                    mouseTracker.onMove(function (pos) {
                        if (locked) {
                            return;
                        }
                        if (mousedown && shouldTrack) {
//                            console.log(pos.x)
                            ctx.lineTo(pos.x, pos.y);
                            ctx.stroke();
                            followedPath.push(pos);
                        }
                    }.bind(this));

                    this.getReferencePoints = function () {
                        return refPoints;
                    };

                    this.getStartPosition = function () {
                        return startPos;
                    };

                    this.getEndPosition = function () {
                        return endPos;
                    };

                    this.getSvgPath = function () {
                        return svgPath;
                    };

                    /**
                     * Get the array of points that have been drawn.
                     * Note that this is the raw version of the line,
                     * which means that this array will contain every measured
                     * point. Before comparing the drawn line to the reference
                     * line this array has to be modified to allow
                     * a fair comparison. For example, points in this array
                     * are not equidistant and the array might be longer or shorter
                     * than the array holding the points along the reference line.
                     */
                    this.getFollowedPath = function () {
                        return followedPath;
                    };

                    /**
                     * Get the equidistant points along the drawn line.
                     * This property will be undefined until the test finishes.
                     */
                    this.getFollowedPathPoints = function () {
                        return followedPathPoints;
                    };

                    /**
                     * Start tracking the movement of the user's mouse/finger.
                     */
                    this.startTracking = function (position) {
                        shouldTrack = true;
                        var posiX = intersectCircleWithTwoPoints(LineTestConfig.START_END_CIRCLE_RADIUS + LineTestConfig.REFERENCE_LINE_WIDTH - 1, startPos, position).x;
                        var posiY = intersectCircleWithTwoPoints(LineTestConfig.START_END_CIRCLE_RADIUS + LineTestConfig.REFERENCE_LINE_WIDTH - 1, startPos, position).y;
                        ctx.beginPath();
                        ctx.strokeStyle = LineTestConfig.DRAWN_LINE_COLOR;
                        ctx.lineWidth = LineTestConfig.DRAWN_LINE_WIDTH;
                        ctx.moveTo(posiX, posiY);
//                        ctx.moveTo(position.x, position.y);
                        console.log('Start tracking');
                    };

                    /**
                     * Stop tracking the movement of the user's mouse/finger.
                     */
                    this.stopTracking = function () {
                        console.log('Stop tracking');
                        shouldTrack = false;
                    };

                    this.getScores = function () {
                        var score = calculateScore(followedPath, refPoints);
                        return score;
                    };

                    this.on = function (event, data, context) {
                        emitter.on(event, data, context);
                    };

                    this.lock = function () {
                        locked = true;
                    };

                    this.unlock = function () {
                        locked = false;
                    };

                    this.draw = function () {
                        ctx.save();
                        ctx.beginPath();
                        ctx.strokeStyle = LineTestConfig.REFERENCE_LINE_COLOR;
                        ctx.lineWidth = LineTestConfig.REFERENCE_LINE_WIDTH;
                        ctx.stroke(new Path2D(this.getSvgPath()));
                        ctx.restore();
                    };

                    /**
                     * Get a trimmed version of the points along the reference line.
                     * In this version the start and end stretches that lie within the
                     * start and end areas have been removed.
                     */
                    this.getTrimmedReferencePoints = function () {
                        return trimReferencePoints(refPoints, trimLength);
                    };

                    /**
                     * Remove all points from the array refPoints that are
                     * within `length` distance of either the start points
                     * or the end point.
                     * @param refPoints An array of point objects, i.e. objects with an x
                     *        and y property.
                     * @param length The distance to trim from both ends.
                     * @return The trimmed array of points.
                     */
                    function trimReferencePoints(refPoints, length) {
                        var p0 = refPoints[0];
                        var pn = refPoints[refPoints.length - 1];
                        var trimmedRefPoints = [];
                        var nRefPoints = refPoints.length;
                        var dstart, dend, p;
                        // NOTE: This could be done way more efficient if you
                        // would just check the points at the start and at the end of the
                        // line.
                        for (var i = 0; i < nRefPoints; i++) {
                            p = refPoints[i];
                            dstart = euclDistance2D([p.x, p.y], [p0.x, p0.y]);
                            dend = euclDistance2D([p.x, p.y], [pn.x, pn.y]);
                            if (dstart >= length && dend >= length) {
                                trimmedRefPoints.push(p);
                            }
                        }
                        return trimmedRefPoints;
                    }

                    /**
                     * Calculate a score of how similar two paths are.
                     *
                     * @param followedPath An array containing the followed positions
                     *        as objects with x and y properties.
                     * @param refPoints_ An array of reference points.
                     * @return An object holding two scores: the mean of the distances
                     *         and their standard deviation.
                     */
                    function calculateScore(followedPath, refPoints_) {
                        // Trim the array holding the points along the reference line
                        // at both ends so that the parts of the reference line that lie
                        // within the start or end area are removed.
                        var refPoints = trimReferencePoints(refPoints_, trimLength);
                        // Get a collection of ordered and equidistant points along the
                        // drawn line. Note that the points gathered in the mousemove
                        // callback do not necessarily have the same distance to each other.
                        // To allow fair comparison of the reference line to the drawn line
                        // this process is therefore necessary.
                        var followedPathSample = PathSampler.samplePointPath(
                                followedPath, canvas.width, canvas.height, followedPath[0]
                                );
                        // TODO: Remove, only to extract raw data
//            console.log('Drawn path, raw');
//            console.log('x, y');
//            followedPathSample.forEach(function(pos) {
//                console.log(pos.x, pos.y);
//            });
//            console.log('Ref path');
//            console.log('x, y');
//            refPoints.forEach(function(pos) {
//                console.log(pos.x, pos.y);
//            });

                        // Subsample the followed points array such that there are approx.
                        // the same number of points in both arrays. Otherwise the score will
                        // be biased towards drawn paths with fewer points.
                        followedPathPoints =
                                getArrayWithAdjustedLength(followedPathSample, refPoints.length);
                        // Show which points were found by the trace algorithm.
                        if (debug) {
                            _(refPoints).each(function (p) {
                                markPoint(ctx, p.x, p.y, 1, 'blue');
                            });
                            _(followedPathPoints).each(function (p) {
                                markPoint(ctx, p.x, p.y, 1, 'red');
                            });
                        }
                        if (refPoints.length !== followedPathPoints.length) {
                            throw new Error(
                                    'There are different numbers of reference points and drawn points!'
                                    );
                        }
                        // Calculate the two scores by first computing the distance between
                        // all pairs of reference and drawn points.
                        var n = refPoints.length;
                        var refp, p, d;
                        var distances = [];
                        for (var i = 0; i < n; i++) {
                            refp = refPoints[i];
                            p = followedPathPoints[i];
                            d = euclDistance2D([p.x, p.y], [refp.x, refp.y]);
                            if (debug) {
                                drawLineBetweenPoints(ctx, p, refp, 'grey')(ctx);
                            }
                            distances.push(d);
                        }

                        var scores = {
                            dmean: mean(distances),
                            dstd: stdev(distances)
                        };
                        return scores;
                    }

                    /**
                     * Given a SVG path string of the format extract the coordinates of the
                     * starting point.
                     *
                     * @param path A SVG path string, e.g.
                     *        "M74.048,65.039c0,0,893.205,49.029,595.146,137.378"
                     * @return An object containing the x- and y-coordinate.
                     */
                    function getPathStart(path) {
                        var matches = path.match(/M(\d+(\.\d+)?),(\d+(\.\d+)?)/);
                        return {
                            start: 'start',
                            x: parseFloat(matches[1]),
                            y: parseFloat(matches[3])
                        };
                    }


                    /**
                     * Given a SVG path string of the format extract the coordinates of the end
                     * point.
                     *
                     * @param path A SVG path string, e.g.
                     *        "M74.048,65.039c0,0,893.205,49.029,595.146,137.378"
                     * @return An object containing the x- and y-coordinate.
                     */
                    function getPathEnd(path) {
                        var coords = path.split(',');
                        var n = coords.length;
                        return {
                            x: parseFloat(coords[n - 1]),
                            y: parseFloat(coords[n - 2])
                        };
                    }


                }

                return ReferenceLine;

            }]);
