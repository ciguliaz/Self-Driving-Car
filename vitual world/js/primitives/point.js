class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(point) {
        return this.x == point.x && this.y == point.y;
    }



    draw(ctx, { size = 10, color = 'black', outline = false, fill = false } = {}) {
        const rad = size / 2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2)
        ctx.fill();

        // console.log(outline)

        if (outline) {
            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = "yellow";
            ctx.arc(this.x, this.y, rad * 0.8, 0, Math.PI * 2)
            ctx.stroke();
        }
        if (fill) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, rad * 0.35, 0, Math.PI * 2)
            ctx.fillStyle= 'yellow';
            ctx.fill();
        }
    }


}