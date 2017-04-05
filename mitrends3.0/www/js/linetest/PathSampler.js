angular.module('uszapp.linetest')
        .service('PathSampler', ['$q', function ($q) {
                /**
                 * Helper function to get the relative position of an
                 * SVG element within its parent.
                 */
                function getElementPosition(element) {
                    var svg = element.parentElement;
                    var parentRect = svg.getBoundingClientRect();
                    var elementRect = element.getBoundingClientRect();
                    var x = elementRect.left - parentRect.left;
                    var y = elementRect.top - parentRect.top;
                    var p = {
                        x: x,
                        y: y
                    };
                    return p;
                }

                /**
                 * Sample points from a line drawn with a given function.
                 *
                 * @param width The width of the parent canvas on which the path is
                 *        drawn
                 * @param height The width height the parent canvas on which the path is
                 *        drawn
                 * @param startPos The first position of the path.
                 * @param drawFunc A function of type CanvasRenderingContext => void that
                 *        is used to the the line onto the canvas
                 * @return An array of {x: number, y: number} objects
                 */
                function samplePath(width, height, startPos, drawFunc) {
                    // Create an off-screen canvas element on which the path
                    // to be sampled is drawn.
                    var canvas = document.createElement('canvas');
                    canvas.setAttribute('width', width);
                    canvas.setAttribute('height', height);
                    var ctx = canvas.getContext('2d');

                    // Debug helper function
                    function markPoint(x, y, r, color) {
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(x, y, r, 0, 2 * Math.PI);
                        ctx.stroke();
                    }

                    // DEBUG
                    // if (debug) {
                    //     $('.line-canvas-container').append(canvas);
                    // }

                    // Color the canvas black and draw the path as a white line.
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, width, height);

                    // Strangely, if line width is 1 a line is visible on the canvas
                    // but only very few points in image data have actually pixel values
                    // equal to 255.
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'white';

                    // Draw the line
                    drawFunc(ctx);

                    var im = ctx.getImageData(0, 0, width, height).data;

                    // Trace the drawn path by looking for white spots on the black canvas.
                    // The algorithm proceeds as follows:
                    // Check all points in the image that lie on a cirle around the starting
                    // position. If there is a point that is white, i.e. the path was drawn
                    // at that position, move to that point and, again, draw a circle. Repeat
                    // the previous instruction.
                    // In addition to being white, such a point must have a distance
                    // to the previous points of at least one radius. Otherwise the trace
                    // algorithm might jump backwards.
                    //
                    // Circle euqations:
                    // x = x0 + r * cos(theta)
                    // y = y0 + r * sin(theta)
                    var coords = [];
                    var startx = 0;
                    var starty = 0;
                    var x, y;
                    var i, idx;
                    var x0 = startPos.x;
                    var y0 = startPos.y;
                    var r = 6;
                    var thetas = _.range(0, 2 * Math.PI, 0.05);
                    var theta;
                    var nThetas = thetas.length;
                    var foundTrace, farEnough, lastPos, d;
                    var elapsedTime,
                            startTime = Date.now();
                    var count = 0;
                    outer:
                            while (true) {
                        count++;
                        foundTrace = false;
                        // Look at each pixel in a circle around the current position
                        // and check wether it lies on a path.
                        inner:
                                for (i = 0; i < nThetas; i++) {
//                            console.log('for')
                            theta = thetas[i];
                            x = Math.round(x0 + r * Math.cos(theta));
                            y = Math.round(y0 + r * Math.sin(theta));
                            if (x >= 0 && y >= 0 && x < width && y < height) {
                                // There are 4 entries in the image data for each pixel,
                                // therefore to compute the index in the 1D-data array, the
                                // following equation is used.
                                idx = x * 4 + y * width * 4;
                                // Check if there is a last position that needs to be
                                // at least one radius away from the currently examined position.
                                // Note that the last entry in the `coords` array is just the
                                // current circle center and not the previously found point.
                                if (coords.length >= 2) {
                                    lastPos = coords[coords.length - 2];
                                    d = euclDistance2D([x, y], [lastPos.x, lastPos.y]);
                                    farEnough = d > r;
                                } else {
                                    farEnough = true;
                                }

                                if (im[idx] == 255 &&
                                        im[idx + 1] == 255 &&
                                        im[idx + 2] == 255 &&
                                        farEnough) {
                                    coords.push({x: x, y: y});
                                    x0 = x;
                                    y0 = y;
                                    foundTrace = true;
                                    break inner;
                                }
                            }
                        }

                        // Break the whole tracing procedure if the trace could not
                        // be found anymore or if the algorithms takes too long
                        // (in some case it could loop forever).
                        elapsedTime = (Date.now() - startTime) / 1000;
                        if (!foundTrace) {
//                            console.log('Info: Unable to follow trace any further, assuming this is the end.');
                            break;
                        }
                        if (elapsedTime >= 2) {
//                            console.log('Warning: Tracing of path aborted to avoid infinite loop!');
                            break outer;
                        }
//                        console.log(count);
                        if (count > 10000) {
                            break;
                        }
                    }
                    return coords;
                }

                /**
                 * Sample points along the SVG path string
                 *
                 * @param path The SVG path string
                 * @param width The width of the parent canvas on which the path is
                 *        drawn
                 * @param height The width height the parent canvas on which the path is
                 *        drawn.
                 * @param startPos The first position of the path.
                 * @return An array of {x: number, y: number} objects
                 */
                function sampleSVGPath(path, width, height, startPos) {
                    var coords = samplePath(width, height, startPos, function (ctx) {
                        ctx.beginPath();
                        ctx.stroke(new Path2D(path));
                    });

                    return coords;
                }

                /**
                 * Sample points along a path represented by an array of points.
                 *
                 * @param path The array of points. Each point has the format {x: number, y: number}.
                 * @param width The width of the parent canvas on which the path is
                 *        drawn
                 * @param height The width height the parent canvas on which the path is
                 *        drawn.
                 * @param startPos The first position of the path.
                 * @return An array of sampled points
                 */
                function samplePointPath(path, width, height, startPos) {
                    var coords = samplePath(width, height, startPos, function (ctx) {
                        var nPoints = path.length;
                        ctx.beginPath();
                        ctx.moveTo(path[0].x, path[0].y);
                        for (var i = 1; i < nPoints; i++) {
                            ctx.lineTo(path[i].x, path[i].y);
                        }
                        ctx.stroke();
                    });
                    return coords;
                }

                return {
                    sampleSVGPath: sampleSVGPath,
                    samplePointPath: samplePointPath
                };
            }]);

