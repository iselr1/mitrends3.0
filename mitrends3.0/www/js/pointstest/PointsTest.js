angular.module('uszapp.pointstest')
.factory('PointsTest', ['$rootScope', function($rootScope) {

    /**
    * opt.startPosition string The start position, one of
    *                   'topLeft', 'topRight', 'bottomLeft',
    *                   'bottomRight'.
    * opt.debug boolean Whether the debug mode should be activated.
    */
    function PointsTest(opt) {

        var emitter = new EventEmitter();
        var containerSelector = '.pointstest';

        var $element = $(containerSelector);
        var element = $element[0];
        var debug = opt.debug;

        // Height of the bar where time and # figures is displayed.
        var controlbarHeight = 100;

        var targetRotation = opt.targetRotation,
            startPositionQuarter = opt.startPositionQuarter;

        // Get the dimensions of the "playing field"
        var containerWidth = $element.width();
            containerHeight = $element.height();

        var startTriangle = new Triangle({
            target: false,
            color: 'blue',
            containerSelector: containerSelector,
            position: {x: 0, y: 0},
            $rootScope: $rootScope
        });

        var targetTriangle = new Triangle({
            target: true,
            color: 'gray',
            containerSelector: containerSelector,
            position: {x: 0, y: 0},
            $rootScope: $rootScope
        });

        // Rotate triangles at the origin
        // startTriangle.rotate(0);
        targetTriangle.rotate(targetRotation);

        //////////////////////////////////////////
        //  Move triangles to correct position  //
        //////////////////////////////////////////
        switch (startPositionQuarter) {
            case "topLeft": targetPositionQuarter = "bottomRight"; break;
            case "topRight": targetPositionQuarter = "bottomLeft"; break;
            case "bottomLeft": targetPositionQuarter = "topRight"; break;
            case "bottomRight": targetPositionQuarter = "topLeft"; break;
        }
        var targetPositionQuarter;
        moveTriangleToQuarter(startTriangle, startPositionQuarter);
        moveTriangleToQuarter(targetTriangle, targetPositionQuarter);

        // Rectangles around triangles for debug purposes, only added
        // in case debug mode is activated.
        var startTriangleBbox = startTriangle.getBoundingBoxElement();
        var targetTriangleBbox = targetTriangle.getBoundingBoxElement();

        if (debug) {
            $element.append(startTriangleBbox);
            $element.append(targetTriangleBbox);
        }

        startTriangle.on('TRIANGLE_MOVED', function(triangle) {
            var doesMatch = triangle.matches(targetTriangle, 50);
            if (doesMatch) {
                emitter.emit('TEST_DONE');
            }
        });

        this.start = function(opt) {
            startTriangle.addToDOM();
            targetTriangle.addToDOM();
        };

        this.destroy = function() {
            if (debug) {
                startTriangleBbox.remove();
                targetTriangleBbox.remove();
            }
            startTriangle.destroy();
            targetTriangle.destroy();
        };

        this.on = function(event, data, context) {
            emitter.on(event, data, context);
        };

        this.lock = function() {
            startTriangle.lock();
            targetTriangle.lock();
        };

        /**
         * Move a triangle to the topLeft, topRight, bottomLeft
         * or bottomRight and compute the right offsets to the screen
         * edge.
         */

        function moveTriangleToQuarter(triangle, quarter) {
            var bbox = triangle.getBoundingBox();
            var position = triangle.getPosition();
            var leftOffset = position.x - bbox.minx;
            var topOffset = position.y - bbox.miny;
            var rightOffset = bbox.maxx - position.x;
            var bottomOffset = bbox.maxy - position.y;
            // The space that the bounding box should have to the
            // screen edge.
            var padding = 80;
            switch (quarter) {
                case "topLeft":
                    triangle.setPosition({
                        x: leftOffset + padding,
                        y: topOffset + padding + controlbarHeight
                    });
                    break;
                case "topRight":
                    triangle.setPosition({
                        x: containerWidth - rightOffset - padding,
                        y: topOffset + padding + controlbarHeight
                    });
                    break;
                case "bottomLeft":
                    triangle.setPosition({
                        x: leftOffset + padding,
                        y: containerHeight - bottomOffset - padding
                    });
                    break;
                case "bottomRight":
                    triangle.setPosition({
                        x: containerWidth - rightOffset - padding,
                        y: containerHeight - bottomOffset - padding
                    });
                    break;
                default: throw new Error("Unknown startPosition");
            }
        }
    }
    return PointsTest;
}]);
