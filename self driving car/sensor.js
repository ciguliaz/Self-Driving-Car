class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 11;
        this.rayLength = 180;
        this.raySpread = Math.PI * 4/5 ;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic) {
        // console.log('input', roadBorders);

        this.#castRays();
        this.readings = [];
        for (const ray of this.rays) {
            // console.log(ray)
            // console.log("/-----")
            // console.log(roadBorders)
            this.readings.push(
                this.#getReading(ray, roadBorders, traffic)
            )

        }
    }

    #getReading(ray, roadBorders, traffic) {
        let touches = [];
        for (const roadBorder of roadBorders) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorder[0],
                roadBorder[1]
            )
            if (touch) {
                touches.push(touch)
                // console.log(touch);
            }
            // else console.log('no touches');
        }
        for (const car of traffic) {
            const poly = car.polygon;
            for (let i = 0; i < poly.length; i++) {
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[i],
                    poly[(i + 1) % poly.length]
                );
                if (value) {
                    touches.push(value);
                }
            }
        }
        if (touches.length == 0) {
            // console.log('no touches');
            return null;
        } else {
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            // console.log('touches',touches);
            return touches.find(e => e.offset == minOffset);
        }

    }


    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount != 1 ? i / (this.rayCount - 1) : 0.5
            ) + this.car.angle;

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            }
            this.rays.push([start, end]);
            // console.log(this.rays)
        }
    }

    draw(ctx) {
        // console.log(this.rays);
        // console.log(this.readings);
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i]
                // console.log(end);
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
}