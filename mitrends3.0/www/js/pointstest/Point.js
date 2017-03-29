function Point(opt) {

    var number = opt.number,        // 1,2, or 3
        diameter = opt.diameter,    // diameter of the circle
        containerSelector = opt.containerSelector,
        target = opt.target,        // if the point is a target point
        color = opt.color,          // color, e.g. 'gray'
        initialPosition = opt.position, // position
        $rootScope = opt.$rootScope;     // angular rootscope TODO: use eventmitter

    // Keep track of the position in a separate variable.
    // The reason for this is that the position can't be
    // extracted from the DOM element when the element wasn't
    // added to the DOM. This is needed however, since it has to be
    // possible to query and change the position prior to adding the
    // element to the DOM.
    var position = initialPosition;

    var self = this;

    var isActive = false;

    var id = (target ? 'target-' : 'start-') + number;
    var element = $('<div id="' + id + '">' + '</div>')
        .addClass('point')
        .css({
            top: initialPosition.y,
            left: initialPosition.x,
            position: 'absolute',
            width: diameter + 'px',
            height: diameter + 'px',
            'border-radius': '50%',
            'background-color': color,
            'z-index': target ? 0 : 100
        });

    var pointMouseTracker = new MouseTracker(element[0]);

    this.setColor = function(newColor) {
        element.css({
            'background-color': newColor
        });
    };

    this.resetColor = function() {
        element.css({
            'background-color': color
        });
    };

    this.getId = function() {
        return id;
    };

    /**
     * Check whether the point is within `tolerance` units of distance
     * of another point.
     */

    this.matches = function(point, tolerance) {
        var dist = distance(position, point.getPosition());
        return dist <= tolerance;
    };

    /**
     * Given a jquery selector, add the div representing this point to the DOM.
     */
    this.addToDOM = function() {
        $('.pointstest').append(element);
    };

    /**
     * Remove the point from the DOM.
     */
    this.removeFromDOM = function() {
        element.remove();
    };

    pointMouseTracker.onUp(function(pos) {
        self.setInactive();
    });

    pointMouseTracker.onDown(function(pos) {
        hasLeft = false;
        mouseWasInsideArea = true;
        self.setActive();
    });

    /** Get the current position of the point */
    this.getPosition = function() {
        return position;
    };

    /** Move the point to a position on-screen */
    this.setPosition = function(newPosition) {
        position = newPosition;
        element.css({
            top: position.y - diameter / 2,
            left: position.x - diameter / 2,
        });
    };

    /** Move the point to a position on-screen */
    this.setPositionByUser = function(newPosition) {
        position = newPosition;
        element.css({
            top: position.y - (diameter * 0.9 ),
            left: position.x - (diameter /2),
        });
    };

    this.getIsActive = function() {
        return isActive;
    };

    this.getDiameter = function() {
        return diameter;
    };

    this.setInactive = function() {
        $rootScope.$emit('POINT_INACTIVE', self);
        isActive = false;
        element.css({
            'border': 'none'
        });
    };

    this.destroy = function() {
        this.removeFromDOM();
    };

    this.setActive = function() {
        $rootScope.$emit('POINT_ACTIVE', self);
        isActive = true;
        element.css({
            'border': '7px solid orange'
        });
    }
}
