/**
 * Get a new version of the array that has a specific size.
 * If the requested size is too large, the elements are interpolated.
 * If the requested size is too low, elements are removed randomly.
 *
 * @param array The array to be adjusted
 * @param n The number of items the new array should approximately have
 * @return The adjusted array
 */
function getArrayWithAdjustedLength(array, n) {
    var l = array.length;
    // If the requested size is the same as the size of the input array,
    // just return it.
    if (n === l) {
        return array;
    }
    // If the input array is empty or has only one element, we can't
    // do anything with it.
    if (l === 0 || l === 1) {
        throw new Error('ERROR: Cannot get eveny spaced sample of array with length 0 or 1');
    }
    var arr; // the modified input array
    // If the requested size is larger than the input array,
    // we need to interpolate the points as many times as necessary.
    if (n > l) {
        arr = array;
        while (true) {
            arr = interpolate(arr);
            if (n <= arr.length) {
                break;
            }
        }
    } else {
        arr = array;
    }

    // Randomly remove elements from the array until the size fits.
    // TODO: Could also exclude elements in a binary-search fashion,
    // always checking if enough elements have been removed.
    // This might be less disruptive to the path.

    // Create the removal mask
    var arrLength = arr.length;
    var shouldRemove = [];
    var i;
    for (i = 0; i < arrLength; i++) {
        shouldRemove.push(false);
    }
    // At all positions that were randomly chosen for deletion,
    // set the boolean flag to true.
    var sizeDelta = arr.length - n;
    var idxsForRemoval = _.sampleSize(_.range(0, arr.length), sizeDelta);
    for (i = 0; i < sizeDelta; i++) {
        shouldRemove[idxsForRemoval[i]] = true;
    }
    // Finally, push only those elements into the adjusted
    // array that are not flagged for removal.
    var adjustedArr = [];
    for (i = 0; i < arrLength; i++) {
        if (!shouldRemove[i]) {
            adjustedArr.push(arr[i]);
        }
    }

    function interpolate(points) {
        var n = points.length;
        var newPoints = [];
        var p1, p2, pi;
        for (var i = 0; i < n - 1; i += 2) {
            p1 = points[i];
            p2 = points[i + 1];
            pi = {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2
            };
            newPoints.push(p1);
            newPoints.push(pi);
            newPoints.push(p2);
        }
        return newPoints;
    }

    return adjustedArr;
}

function intersectCircleWithTwoPoints(radius, center, point) {
    var cx = center.x;
    var cy = center.y;
    var px = point.x;
    var py = point.y;
//    var m = (py - cy) / (px - cx);
//    var p = cy - (m * cx);
    var distance = euclDistance2D([cx, cy], [px, py]);
    var facteur = radius / distance;
    var Xb = ((px - cx) * facteur) + cx;
    var Yb = ((py - cy) * facteur) + cy;
    var intersect = {x: Xb, y: Yb};
    return intersect;

}

/**
 * Compute the euclidean distance between two 2d vectors.
 * @param p1 [x1, y1]
 * @param p2 [x2, y2]
 * @return number
 */
function euclDistance2D(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function mean(xs) {
    var n = xs.length;
    if (n < 1) {
        throw new Error('The array of observations has to be > 0!');
    }
    var sum = 0;
    for (var i = 0; i < n; i++) {
        sum += xs[i];
    }
    return sum / n;
}

function variance(xs) {
    var n = xs.length;
    if (n <= 1) {
        throw new Error('The array of observations has to be > 1!');
    }
    var mu = mean(xs);
    var var_ = 0;
    for (var i = 0; i < n; i++) {
        var_ += Math.pow(xs[i] - mu, 2);
    }
    return var_ / (n - 1);
}

function stdev(xs) {
    var var_ = variance(xs);
    return Math.sqrt(var_);
}

function drawLineBetweenPoints(ctx, p1, p2, color) {
    return function draw(ctx) {
        color = color || 'grey';
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    };
}

function markPoint(ctx, x, y, r, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
}
