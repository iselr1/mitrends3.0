/**
 * Object to easily add click and touch listeners to DOM
 * elements.
 *
 * @param element DOM element to which the listeners should
 *        be added.
 */
function MouseTracker(element) {
    /**
     * Transform global page coordinates into a position local for
     * this element.
     */
    function getRelativePos(pageX, pageY) {
        var x = pageX - $(element).offset().left;
        var y = pageY - $(element).offset().top;
        return {x: x, y: y};
    }

    function getTouchPos(ev) {
        var pageX = ev.touches[0].pageX;
        var pageY = ev.touches[0].pageY;
        return getRelativePos(pageX, pageY);
    }
    function getTouchPos1(ev) {
        var pageX = ev.changedTouches[0].pageX;
        var pageY = ev.changedTouches[0].pageY;
        return getRelativePos(pageX, pageY);
    }

    function getMousePos(ev) {
        var pageX = ev.pageX;
        var pageY = ev.pageY;
        return getRelativePos(pageX, pageY);
    }

    var removeFunctions = [];

    /**
     * Register a callback to be called whenever there is a
     * mousedown or touchstart event.
     *
     * function(position, {
     *     touch: boolean, // if the event was a touch event
     *     event: Object   // the original event object
     * })
     */
    this.onDown = function (cb) {
        var touchstart = function (ev) {
            cb(getTouchPos(ev), {
                touch: true,
                event: ev
            });
        };

        element.addEventListener('touchstart', touchstart);

        var mousedown = function (ev) {
            cb(getMousePos(ev), {
                touch: false,
                event: ev
            });
        };
        element.addEventListener('mousedown', mousedown);

        removeFunctions.push(function () {
            element.removeEventListener('touchstart', touchstart);
            element.removeEventListener('mousedown', mousedown);
        });
    };
    var click = 0;
    this.getClicks = function(){
        return click;
    }
    this.initialiseClicks = function(){
        click = 0;
    }

    /**
     * Register a callback to be called whenever there is a
     * touchend or mouseup event.
     * The callback should have the signature:
     *
     * function(position, {
     *     touch: boolean, // if the event was a touch event
     *     event: Object   // the original event object
     * })
     */
    this.onUp = function (cb) {
        click++;
//        console.log(getEventListeners(document))
        var touchend = function (ev) {
//            cb(undefined, { // TODO: There are no 'touches' in touchend
//                touch: true,
//                event: ev
//            });
            cb(getTouchPos1(ev), {
                touch: true,
                event: ev
            });
        };
        element.addEventListener('touchend', touchend);

        var mouseup = function (ev) {
            cb(getMousePos(ev), {
                touch: false,
                event: ev
            });
        };
        element.addEventListener('mouseup', mouseup);

        removeFunctions.push(function () {
            element.removeEventListener('touchend', touchend);
            element.removeEventListener('mouseup', mouseup);
        });
    };

    /**
     * Register a callback to be called whenever there is a
     * touchmove or mousemove event.
     *
     * function(position, {
     *     touch: boolean, // if the event was a touch event
     *     event: Object   // the original event object
     * })
     */
    this.onMove = function (cb) {
        var touchmove = function (ev) {
            cb(getTouchPos(ev), {
                touch: true,
                event: ev
            });
        };
        element.addEventListener('touchmove', touchmove);

        var mousemove = function (ev) {
            cb(getMousePos(ev), {
                touch: false,
                event: ev
            });
        };
        element.addEventListener('mousemove', mousemove);

        removeFunctions.push(function () {
            element.removeEventListener('touchmove', touchmove);
            element.removeEventListener('mousemove', mousemove);
        });
    };

    this.destroy = function () {
        removeFunctions.forEach(function (f) {
            f();
        });
    };
}
