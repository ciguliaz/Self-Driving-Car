class Car {
    constructor(pos_x, pos_y, width, height, controlType, maxSpeed = 2) {
        this.x = pos_x;
        this.y = pos_y;
        this.width = width;
        this.height = height;
        // this.polygon = [{x:0, y:0}];

        this.speed = 0; // pixels per second
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.turnRate = 0.03;
        this.damaged = false;

        this.useBrain = controlType == "AI";

        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount + 2, 10, 7, 4]);

            this.timedSuicide(15000);
        }

        this.controls = new Controls(controlType);


    }

    suicide() {

        // !this.damaged? console.log('car exploded!!'):
        this.damaged = true;
    }

    timedSuicide(time) {
        let timer = setInterval(()=>{
            this.suicide();
        }, time);
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);

            if (this.sensor) {
                this.sensor.update(roadBorders, traffic);
                let offsets = this.sensor.readings.map(
                    s => s == null ? 0 : 1 - s.offset
                )
                offsets.push(this.speed / this.maxSpeed)
                offsets.push(this.angle % ((Math.PI / 2)) / Math.PI)
                // console.log(offsets)
                // console.log('angle',(this.angle%(Math.PI/2))/Math.PI)
                const outputs = NeuralNetwork.feedForward(
                    offsets, this.brain);
                // console.log(outputs);

                if (this.useBrain) {
                    this.controls.forward = outputs[0];
                    this.controls.left = outputs[1];
                    this.controls.right = outputs[2];
                    this.controls.reverse = outputs[3];
                }
            }

        }


        // console.log(roadBorders);
    }
    #assessDamage(roadBorders, traffic) {
        for (const border of roadBorders) {
            if (polysIntersec(this.polygon, border)) { return true; }
        }
        // return false;
        // console.log(typeof(traffic));
        for (const car of traffic) {
            if (polysIntersec(this.polygon, car.polygon)) { return true; }
        }
        return false;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - rad * Math.sin(this.angle - alpha),
            y: this.y - rad * Math.cos(this.angle - alpha)
        });
        points.push({
            x: this.x - rad * Math.sin(this.angle + alpha),
            y: this.y - rad * Math.cos(this.angle + alpha)
        });
        points.push({
            x: this.x - rad * Math.sin(Math.PI + this.angle - alpha),
            y: this.y - rad * Math.cos(Math.PI + this.angle - alpha)
        });
        points.push({
            x: this.x - rad * Math.sin(Math.PI + this.angle + alpha),
            y: this.y - rad * Math.cos(Math.PI + this.angle + alpha)
        });
        // console.log(points)
        return points;
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        if (this.speed >= this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed <= -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += this.turnRate * flip;
            }
            if (this.controls.right) {
                this.angle -= this.turnRate * flip;
            }
        }
        // might be improve it with Box2d

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx, color = 'black', drawSensor = false) {
        if (this.damaged) {
            ctx.fillStyle = 'gray';

        } else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (const point of this.polygon.slice(1)) {
            ctx.lineTo(point.x, point.y);
            // console.log(point)
        }

        ctx.fill();
        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }

    }
}