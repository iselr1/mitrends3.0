function StartEndArea(opt) {
    this.name = opt.name;
    this.canvas = opt.canvas;
    this.ctx = opt.canvas.getContext('2d');
    this.radius = opt.radius;
    this.position = opt.position;
    this.start = opt.start;
    this.end = !opt.start;
    this.emitter = new EventEmitter();
    this.mouseTracker = opt.mouseTracker;

    this.draw(false);

    this.active = false;

    var mousedown = false;
    var mouseWasInsideArea = false;
    var hasLeft = true;
    var hasEntered = false;
    var locked = false;

    //
    // Setup mouse event listeners
    //
    this.mouseTracker.onDown(function(pos) {
        if (locked) {
            return;
        }
        mousedown = true;
        if (this.start && this.isPositionInside(pos)) {
            this.active = true;
            this.draw();
            hasLeft = false;
        }
    }.bind(this));

    this.mouseTracker.onMove(function(pos) {
        if (locked) {
            return;
        }

        if (this.isPositionInside(pos)) {
            if (mousedown && !hasEntered) {
                this.emitter.emit('ENTERED_AREA', {
                    position: pos,
                    area: this
                });
                this.active = true;
                hasEntered = true;
            }
            this.draw();
            mouseWasInsideArea = true;
        } else {
            if (mousedown && mouseWasInsideArea && !hasLeft) {
                this.emitter.emit('LEFT_AREA', {
                    position: pos,
                    area: this
                });
                hasLeft = true;
            }
            if (!mousedown) {
                // this.active = false;
                // this.draw();
            }
            mouseWasInsideArea = false;
        }
    }.bind(this));

    this.mouseTracker.onUp(function(pos) {
        if (locked) {
            return;
        }
        mousedown = false;
        hasLeft = true;
        hasEntered = false;
        if (!this.end && this.isPositionInside(pos)) {
            this.active = false;
            this.draw();
        }
    }.bind(this));

    this.lock = function() {
        locked = true;
    };

    this.unlock = function() {
        locked = false;
    };

}

StartEndArea.prototype.on = function(event, data, context) {
    this.emitter.on(event, data, context);
};

StartEndArea.prototype.draw = function() {
    var highlight = this.active;
    this.ctx.save();
    // Draw start area
    this.ctx.beginPath();
    if (highlight) {
        this.ctx.fillStyle = LineTestConfig.START_AREA_HIGHLIGHT_COLOR;
    } else {
        this.ctx.fillStyle = 'white';
    }
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = LineTestConfig.REFERENCE_LINE_COLOR;
    this.ctx.arc(
        this.position.x, this.position.y,
        this.radius,
        0, 2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.stroke();

    // Draw text at start
    this.ctx.beginPath();
    this.ctx.font = "bold 24px arial, sans-serif";
    if (highlight) {
        this.ctx.fillStyle = 'white';
    } else {
        this.ctx.fillStyle = LineTestConfig.REFERENCE_LINE_COLOR;
    }
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.name, this.position.x, this.position.y);
    this.ctx.restore();
};

/**
 * Check if a position lies inside this area.
 * @param pos An object with x and y properties.
 * @return boolean
 */
StartEndArea.prototype.isPositionInside = function(pos) {
    var d = euclDistance2D([pos.x, pos.y], [this.position.x, this.position.y]);
    return d < this.radius;
};

function StartArea(opt) {
    StartEndArea.call(this, _.defaults(opt, {
        name: 'Start'
    }));

}
StartArea.prototype = Object.create(StartEndArea.prototype);
StartArea.prototype.constructor = StartArea;

function EndArea(opt) {
    StartEndArea.call(this, _.defaults(opt, {
        name: 'Ende'
    }));
}
EndArea.prototype = Object.create(StartEndArea.prototype);
EndArea.prototype.constructor = EndArea;
