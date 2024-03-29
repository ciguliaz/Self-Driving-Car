const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
//------------------------------------
const lines = []
rl.on('line', (input) => {
    lines.push(input);
})
rl.on('close', () => {
    main(lines)
})


function main(lines) {

    const t = lines[0].trim().split(" ").map((x) => Number(x));
    // const arr = lines[1].trim().split(" ").map((x) => Number(x));

    for (let i = 0; i < t; i++) {
        const tmp = lines[2 * i + 1].trim().split(" ").map((x) => Number(x));
        const n = tmp[0], k = tmp[1];
        const arr = lines[2 * i + 2].trim().split(" ").map((x) => Number(x));


        console.log(solve(n, k, arr))
    }

    // .trim()
    // .replace(/\s+/g, ' ')
    // .split(' ')
    // .map(x => Number(x));
    // .map((x, i) => [+x, i]);

    // let output = []

    // console.log(output.join(' '))

}


function solve(n, k, x) {
    const mod = 1e9 + 7


    let { maxSum, subarray } = findMaxSubarraySum(x)

    if (maxSum < 0) {
        let sum = x.reduce((acc, ele) => (acc + ele) % mod, 0)
        return modo(sum, mod)

    } else {
        let sum = x.reduce((acc, ele) => (acc + ele) % mod, 0);
        for (let i = 0; i < k; i++) {
            sum = (sum + maxSum) % mod;
            maxSum = (maxSum * 2) % mod
            // console.log(n, sum, maxSum * (q + i))
        }
        return sum
    }
}
//------------------------------------
function modo(a, b) {
    if (a >= 0) return a % b;
    return (-((-a) % b) + b) % b;
}

function findMaxSubarraySum(arr) {
    let maxSum = -Infinity;
    let currentSum = 0;
    let start = 0;
    let end = 0;
    let tempStart = 0;

    for (let i = 0; i < arr.length; i++) {
        currentSum += arr[i];

        if (currentSum > maxSum) {
            maxSum = currentSum;
            start = tempStart;
            end = i;
        }

        if (currentSum < 0) {
            currentSum = 0;
            tempStart = i + 1;
        }
    }

    // console.log(maxSum, start, end);

    return {
        maxSum,
        subarray: arr.slice(start, end + 1)
    };
}
