function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER) {
    // console.log('getNearestPoint', loc);
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;

    for (const point of points) {
        const dist = distance(point, loc);
        if (dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = point;
        }
    }
    // console.log(nearest);
    return nearest;
}

function getNearestSegment(loc, segments, threshold = Number.MAX_SAFE_INTEGER) {
    // console.log('getNearestPoint', loc);
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;

    for (const seg of segments) {
        const dist = seg.distanceToPoint(loc);
        if (dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = seg;
        }
    }
    // console.log(nearest);
    return nearest;
}

function distance(p1, p2) {
    // console.log('tf happen')
    // console.log(Math.hypot(p1.x - p2.x, p1.y - p2.y))
    return Math.hypot(p1.x - p2.x, p1.y - p2.y)
}

function average(p1, p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
}

function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y)
}

function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y)
}

function scale(p, scaler) {
    return new Point(p.x * scaler, p.y * scaler)
}

function normalize(p) {
    return scale(p, 1 / magnitude(p));
}

function magnitude(p) {
    return Math.hypot(p.x, p.y)
}

function perpendicular(p) {
    return new Point(-p.y, p.x)
}

function translate(loc, angle, offset) {
    return new Point(
        loc.x + Math.cos(angle) * offset,
        loc.y + Math.sin(angle) * offset
    )
}

function angle(p) {
    return Math.atan2(p.y, p.x)
}

function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (B.x - A.x) * (A.y - C.y) - (B.y - A.y) * (A.x - C.x);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);  //Used to check if the lines are parallel or not

    const eps = 0.0001
    if (Math.abs(bottom) > eps) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}

function lerp(A, B, t) {
    return A + (B - A) * t;
}

function lerp2D(A, B, t) {
    return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t))
}

function getRandomColor() {
    const hue = 190 + Math.random() * 260;
    return 'hsl(' + hue + ',100%,55%)'; //'rgb('+(Math.floor((Math.random() *
}

function degToRad(degree) {
    return degree * Math.PI / 180;
}



function getFake3dPoint(point, viewPoint, height) {
    const dir = normalize(subtract(point, viewPoint));
    const dist = distance(point, viewPoint);
    const scaler = Math.atan(dist / 300) / (Math.PI / 2);
    return add(point, scale(dir, height * scaler));
}