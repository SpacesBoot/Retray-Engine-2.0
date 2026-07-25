function onCollideCircle2d(x1, y1, x2, y2) {
    let distance = Math.sqrt((x1 - y1)**2 + (x2 - y2)**2);
    if (distance < 5) return true;
}

function onCollideSquare2d(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 || x1 + w1 > x2 || y1 < y2 + h2 || y1 + h1 > y2;
}