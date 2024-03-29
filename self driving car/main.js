const carCanvas = document.getElementById('carCanvas')
// canvas.height= window.innerHeight;
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas')
// canvas.height= window.innerHeight;
networkCanvas.width = 0;
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 4)

const N = 1000;
const t = 0.2;
let buttonClicked = false;
let cars = generateCars(N);
let bestCar = cars[0]
let savedBrain;
if (localStorage.getItem("bestBrain")) {
    savedBrain = JSON.parse(
        localStorage.getItem("bestBrain")
    )
}

let attempt = 0;
if (localStorage.getItem("number of tries")) {
    attempt = JSON.parse(
        localStorage.getItem("number of tries")
    )
}
localStorage.setItem("number of tries", JSON.stringify(attempt + 1));
console.log('attempt ', attempt + 1);

// let worstCar;
// console.log(localStorage.getItem("bestBrain"))
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        )
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, Math.random() > 0.5 ? t : -t);
        }
    }

}

// const timeout = setTimeout(reloadBtn.click(), 300000); // 30 sec
// console.log(timeout);

// const car = new Car(road.getLaneCenter(3), y = 100, width = 30, height = 50, controlType = "AI", maxSpeed = 3);
// car.draw(carCtx,road.borders);!!!!!!!!!!!!!!!

// const traffics = [
//     new Car(road.getLaneCenter(1), -100, 50, 50, "DUMMY", 1),
//     new Car(road.getLaneCenter(0), -400, 50, 50, "DUMMY", 1),
//     new Car(road.getLaneCenter(2), -400, 50, 50, "DUMMY", 1),
//     new Car(road.getLaneCenter(0), -700, 50, 50, "DUMMY", 1),
//     new Car(road.getLaneCenter(1), -700, 50, 50, "DUMMY", 1),
//     new Car(road.getLaneCenter(1), -1000, 50, 50, "DUMMY", 1),
//     new Car(road.getLaneCenter(2), -1000, 50, 50, "DUMMY", 1),
// ]
let traffic = generateTraffic(10)
    traffic.unshift(new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 1));
// let traffic = traffics



function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
function discard() {
    localStorage.removeItem("bestBrain");
}
function reload() {
    window.location.reload();
}
function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 15, 25, "AI", 2))
        // console.log('car'+i)
    }
    return cars;
}
function generateTraffic(rows) {
    const traffic = [];
    const laneCount = road.laneCount;
    const startLine = -100;
    const carInRow = (traffic, row) => {
        const sum = traffic.reduce((acc, cars) => cars.row == row ? acc + 1 : acc, 0);
        return sum
    }


    const randomFunc = (carsInRow, lanesCount, amount) => {
        const res = (carsInRow ** 2 / lanesCount + carsInRow * amount) / lanesCount;
        console.log(res);
        return res;
    }
    for (let row = 0; row < rows; row++) {
        const genStart = startLine - row * 200;

        let numOfCars = Math.floor(Math.random() * (laneCount));
        if (numOfCars == 0) numOfCars += 1;
        const carsPositions = [];


        while (carsPositions.length < numOfCars) {
            const carsPosition = Math.floor(Math.random() * (laneCount + 1));
            if (!carsPositions.includes(carsPosition)) {
                carsPositions.push(carsPosition);
            }
        }
        // obstacles.push(obstaclePositions);
        carsPositions.forEach((carPos) => {
            traffic.push({
                car: new Car(road.getLaneCenter(carPos), genStart, 40, 35, "DUMMY", 1),
                row: row
            })
        })



        // for (let i = 0; i < Math.random() * laneCount; i++) {
        //     // if (Math.random() > randomFunc(carInRow(traffic, row), laneCount, 0)) {
        //     if (Math.random() > 0.5 && carInRow(traffic, row) < laneCount) {
        //         traffic.push({
        //             car: new Car(road.getLaneCenter(i), genStart, 30, 50, "DUMMY", 1),
        //             row: row
        //         })
        //     }
        // }
    }

    return traffic.map(traffic => traffic.car);
}
// function addCars() {
//     // const cars = [];

//         // cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))

//     return new Car(road.getLaneCenter(1), 100, 30, 50, "AI")
// }
animate();
function animate(time) {

    bestCar = cars.find(
        car => car.y == Math.min(
            ...cars.map(car => car.y)
        )
    )
    // console.log("Best car is at y=" + bestCar.angle);
    // let bestWorkingCar = cars.find(
    //     car => car.y == Math.min(
    //         ...cars.map(car => {
    //             if (!car.damaged) return car.y;
    //             else return 0;
    //         })
    //     )
    // )
    worstCar = cars.find(
        car => car.y == Math.max(
            ...cars.map(car => car.y)
        )
    )

    worstWorkingCar = cars.reduce(function (maxCar, currentCar) {
        if (!currentCar.damaged && currentCar.y > maxCar.y) {
            return currentCar;
        } else {
            return maxCar;
        }
    }, worstCar);


    for (const obCar of traffic) {
        obCar.update(road.borders, []);
    }
    for (const AIcar of cars) {


        AIcar.update(road.borders, traffic);
        if (AIcar.y - bestCar.y > 300) AIcar.suicide();

    }





    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.8);

    road.draw(carCtx);
    for (const obCar of traffic) {
        obCar.draw(carCtx);
    }

    // if (bestCar.y - worstCar.y < -50) {
    //     try {
    //         worstCar.damaged = true;
    //         cars.splice(cars.indexOf(worstCar), 1);
    //         cars.push(bestWorkingCar);
    //         NeuralNetwork.mutate(cars[cars.length - 1].brain, 0.3);
    //     }
    //     catch (e) {
    //         console.log("Error in removing Car");
    //     }
    // }

    carCtx.globalAlpha = 0.15;
    for (let i = 0; i < cars.length; i++) {
        // if (cars[i].damaged && cars[i] != bestCar) {
        //     cars = cars.splice(i, 1);
        //     console.log(cars)
        //     // cars.push(addCars())
        //     // addCars();

        //     // continue;
        // }
        // if (cars.length < N) {
        //     cars.push(bestWorkingCar);
        //     // NeuralNetwork.mutate(cars[cars.length].brain, 0.1);

        // }
        // if(bestCar-worstCar < -50){
        //     cars.splice(cars.indexOf(worstCar), 1);
        //     cars.push(bestWorkingCar);
        //     NeuralNetwork.mutate(cars[cars.length].brain, 0.1);
        // }
        try {
            cars[i].update(road.borders, traffic);
            cars[i].draw(carCtx, 'orange');
        } catch (e) {
            console.log('Error drawing car: ', e);
        }
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, 'blue', true);
    // bestCar.draw(carCtx, 'brown', true);
    worstWorkingCar.draw(carCtx, 'yellow', false);
    // worstCar.draw(carCtx, 'red', false);



    carCtx.restore();

    // networkCtx.lineDashOffset= -time/10;
    // Visualizer.drawNetwork(networkCtx, bestCar.brain);
    if (cars.every(car => car.damaged)) {
        console.log('every car crashed!! Reloading...!!');
        function rere () {
            buttonClicked = true;
            let bruh = setInterval(() => reload(), 1000);

        };
        rere();
    }
    else if (bestCar.y - traffic[traffic.length - 1].y < -500) {
        save();
        const reloadBtn = document.getElementById('reloadBtn');
        reloadBtn.click();

    } else {
        requestAnimationFrame(animate);
    }


}
