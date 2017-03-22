function Renderer(ctx, width, height) {
    var renderFuncs = [];

    function render() {
        ctx.clearRect(0, 0, width, height);
        for (var i in renderFuncs) {
            ctx.save();
            renderFuncs[i](ctx);
            ctx.restore();
        }
        requestAnimationFrame(render);
    }

    this.startRenderingLoop = function() {
        render();
    };

    this.addRenderFunc = function(func) {
        renderFuncs.push(func);
    };

    this.removeRenderFunc = function(func) {
        var idx = renderFuncs.indexOf(func);
        if (idx > 0) {
            renderFuncs.splice(idx, 1);
        }
    };

    this.clearRenderFuncs = function() {
        renderFuncs = [];
    };

    /**
     * Utility functions
     */
    this.drawNotificationCircle = function(opt) {
        var x = opt.x;
        var y = opt.y;
        var text = opt.text || '';
        var time = opt.time || 5;
        var maxRadius = opt.radius || 20;
        var animate = opt.animate || false;

        var animationStart = Date.now();

        var self = this;

        function draw(ctx) {
            var timeDelta = (Date.now() - animationStart) / 1000;
            if (timeDelta > time) {
                self.removeRenderFunc(draw);
                return;
            }

            var radius;
            if (animate) {
                var halfTime = time / 2;
                var timeDeltaHalf = timeDelta / 2;
                var radius = maxRadius / halfTime * Math.pow(timeDeltaHalf, 3);
                if (timeDelta >= time / 2) {
                    radius = maxRadius - radius;
                }
                radius = Math.max(radius, 0);
            } else {
                radius = maxRadius;
            }

            ctx.save();
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();

            if (text) {
                // ctx.font = "bold 32px arial, sans-serif";
                // ctx.fillStyle = 'green';
                // ctx.fillText(text, x + maxRadius, y - maxRadius);
            }
            ctx.restore();
        }
        this.addRenderFunc(draw);
    }

    this.drawLineBetweenPoints = function(p1, p2, color) {
        function draw(ctx) {
            color = color || 'blue';
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
        this.addRenderFunc(draw);
    }
}
