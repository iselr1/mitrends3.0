/*
 *                    ___
 *         l23   .  3|
 *            .      | yoffsetfactorpoint3
 *         2         |
 *        /   X      |----
 *   l12 /           |
 *      /            |
 *     /             | yoffsetfactorpoint1
 *    1              |
 *    |-------|------|----
 */
function Triangle(opt) {

    var target = opt.target,
        position = opt.position,
        containerSelector = opt.containerSelector,
        $rootScope = opt.$rootScope,
        stretch =  opt.stretch || 1,
        color = opt.color;

    var POINT_SIDE_LENGTH = 100;
    var self = this;
    var triangleSize = 220;
    var locked = false;

    this.position = position;

    //////////////////////////////////
    //  Set dimensions for corners  //
    //////////////////////////////////
    var scalingFactor = triangleSize * stretch;
    var xOffsetPoint1 = scalingFactor * -0.5;
    var yOffsetPoint1 = scalingFactor * 0.7;
    var xOffsetPoint2 = scalingFactor * -0.2;
    var yOffsetPoint2 = scalingFactor * -0.1;
    var xOffsetPoint3 = scalingFactor * 0.5;
    var yOffsetPoint3 = scalingFactor * -0.3;

    /////////////////////////////////////
    //  Construct corners of triangle  //
    /////////////////////////////////////
    this.corner1 = new Point({
        number: 0,
        color: color,
        containerSelector: containerSelector,
        diameter: POINT_SIDE_LENGTH,
        target: target,
        position: {
            x: this.position.x + xOffsetPoint1,
            y: this.position.y + yOffsetPoint1
        },
        $rootScope: $rootScope
    });
    this.corner2 = new Point({
        number: 1,
        color: color,
        containerSelector: containerSelector,
        diameter: POINT_SIDE_LENGTH,
        target: target,
        position: {
            x: this.position.x + xOffsetPoint2,
            y: this.position.y + yOffsetPoint2
        },
        $rootScope: $rootScope
    });
    this.corner3 = new Point({
        number: 2,
        color: color,
        containerSelector: containerSelector,
        diameter: POINT_SIDE_LENGTH,
        target: target,
        position: {
            x: this.position.x + xOffsetPoint3,
            y: this.position.y + yOffsetPoint3
        },
        $rootScope: $rootScope
    });
    this.corners = [this.corner1, this.corner2, this.corner3];
    var cornersById = {};
    this.corners.forEach(function(c) {
        cornersById[c.getId()] = c;
    });

    var emitter = new EventEmitter();

    var container = $(containerSelector).get(0);
    var areaMouseTracker = new MouseTracker(container);


    // User move with finger
    if (!target) {
        areaMouseTracker.onMove(function(pos, info) {

            if (self.canMove() && info.touch) {
                var touches = info.event.touches;
                var nTouches = touches.length;

                for (var i = 0; i < nTouches; i++) {
                    var touch = touches[i];
                    var divId = touch.target.id;
                    var corner = cornersById[divId];
                    if (corner !== undefined) {
                        var newPosition = {
                            x: touch.pageX,
                            y: touch.pageY
                        };
                        var isPositionInsideCorner = distance(corner.getPosition(), newPosition) <= corner.getDiameter();
                        if (isPositionInsideCorner) {
                            //corner.setPosition(newPosition);
                              corner.setPositionByUser(newPosition);
                        } else {
                            corner.setInactive();
                        }
                    }
                }
                emitter.emit('TRIANGLE_MOVED', self);
            }
        });
    }

    /**
     * Check if this triangle is at the same position as
     * another triangle.
     */

    this.matches = function(triangle, tolerance) {

      point = new Point({
          number: 2,
          color: color,
          containerSelector: containerSelector,
          diameter: POINT_SIDE_LENGTH,
          target: target,
          position: {
              x: this.position.x + xOffsetPoint3,
              y: this.position.y + yOffsetPoint3
          },
          $rootScope: $rootScope
      });
      if
      (
        this.corner1.matches(triangle.corner1, tolerance) && this.corner2.matches(triangle.corner2, tolerance) && this.corner3.matches(triangle.corner3, tolerance) ||
        this.corner1.matches(triangle.corner1, tolerance) && this.corner2.matches(triangle.corner3, tolerance) && this.corner3.matches(triangle.corner2, tolerance) ||

        this.corner1.matches(triangle.corner2, tolerance) && this.corner2.matches(triangle.corner1, tolerance) && this.corner3.matches(triangle.corner3, tolerance) ||
        this.corner1.matches(triangle.corner2, tolerance) && this.corner2.matches(triangle.corner3, tolerance) && this.corner3.matches(triangle.corner1, tolerance) ||

        this.corner1.matches(triangle.corner3, tolerance) && this.corner2.matches(triangle.corner1, tolerance) && this.corner3.matches(triangle.corner3, tolerance) ||
        this.corner1.matches(triangle.corner3, tolerance) && this.corner2.matches(triangle.corner3, tolerance) && this.corner3.matches(triangle.corner1, tolerance)
      )
        return true;
        return false;
    }

    this.addToDOM = function() {
        _(this.corners).each(function(c) {
            c.addToDOM();
        });
    };

    this.removeFromDOM = function() {
        _(this.corners).each(function(c) {
            c.removeFromDOM();
        });
    };

    /**
     * Rotate the trangle, negative degrees are counter-clockwise rotations.
     */
    this.rotate = function(degrees) {
        var centerX = this.position.x;
        var centerY = this.position.y;
        var phi = degrees * Math.PI / 180;
        _(this.corners).each(function(c) {
            var pos = c.getPosition();
            var newX = centerX + (pos.x - centerX) * Math.cos(phi) - (pos.y - centerY) * Math.sin(phi);
            var newY = centerY + (pos.x - centerX) * Math.sin(phi) + (pos.y - centerY) * Math.cos(phi);
            var newPos = {
                x: newX,
                y: newY
            };
            c.setPosition(newPos);
        });
    };

    this.canMove = function() {
        var canCornersMove = self.corner1.getIsActive() && self.corner2.getIsActive() && self.corner3.getIsActive();
        return canCornersMove && !locked;
    };

    this.destroy = function() {
        areaMouseTracker.destroy();
        this.corners.forEach(function(c) {
            c.destroy();
        });
    }

    this.on = function(event, data, context) {
        emitter.on(event, data, context);
    };

    ////////////////////////////
    //  Bounding box element  //
    ////////////////////////////
    this.getBoundingBox = function() {
        var xs = this.corners.map(function(c) { return c.getPosition().x; });
        var ys = this.corners.map(function(c) { return c.getPosition().y; });

        return {
            minx: _.min(xs) - POINT_SIDE_LENGTH / 2,
            maxx: _.max(xs) + POINT_SIDE_LENGTH / 2,
            miny: _.min(ys) - POINT_SIDE_LENGTH / 2,
            maxy: _.max(ys) + POINT_SIDE_LENGTH / 2
        };
    };

    this.getBoundingBoxElement = function() {
        var bbox = this.getBoundingBox();
        return $('<div></div>')
            .addClass('triangle-bbox')
            .css({
                top: bbox.miny,
                left: bbox.minx,
                position: 'absolute',
                width: (bbox.maxx - bbox.minx) + 'px',
                height: (bbox.maxy - bbox.miny) + 'px',
                'border': '1px solid black',
                'z-index': 100
            });
    };

    this.lock = function() {
        locked = true;
    };

    this.setPosition = function(pos) {
        var currentPosition = this.position;
        var deltaX = pos.x - currentPosition.x;
        var deltaY = pos.y - currentPosition.y;
        this.corners.forEach(function(c) {
            var currentCornerPosition = c.getPosition();
            var newCornerPosition = {
                x: currentCornerPosition.x + deltaX,
                y: currentCornerPosition.y + deltaY
            };
            c.setPosition(newCornerPosition);
        });
    };

    this.getPosition = function() {
        console.info();
        return this.position;
    };
}
