
// Importing the module
const readline = require("readline");
// 'use strict';
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

    let l = 0;
    let t = +lines[l++]
    const output = []

    for (let i = 0; i < t; i++) {
        const [n, k] = lines[l++].trim().split(' ').map(Number)
        // console.log(n, k)
        output[i] = solve(n, k)
    }
    console.log(output.join('\n'))
    // })()



}
function solve(n, k) {
    const log = Math.ceil(Math.log2(n))
    let s = 0
    for (let i = 0; i <= log; i++) {
        const x = Math.ceil(Math.floor(n / (1 << i)) / 2)
        if (s + x < k) {
            s += x
        } else {
            const d = k - s
            return (1 << i) * (2 * d - 1)
        }
        // console.log(k, x, s)
    }
    // return [n, k]
}
//------------------------------------