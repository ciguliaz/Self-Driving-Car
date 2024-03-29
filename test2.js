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
    let l = 1;
    const t = lines[0].trim().split(" ").map((x) => Number(x));
    // const arr = lines[1].trim().split(" ").map((x) => Number(x));
    // .trim()
    // .replace(/\s+/g, ' ')
    // .split(' ')
    // .map(x => Number(x));
    // .map((x, i) => [+x, i]);

    for (let i = 0; i < t; i++) {
        const tmp = lines[l++].trim().split(" ").map((x) => Number(x));
        const n = tmp[0], k = tmp[1];
        let list = [];
        for (let j = 0; j < n - 1; j++) {
            const arr = lines[l++].trim().split(" ").map((x) => Number(x));
            list.push(arr)
        }




        console.log(solve(n, k, list))
    }



    // let output = []

    // console.log(output.join(' '))

}


function solve(n, k, x) {

    while (k > 0) {
        for (let i = 1; i <= n; i++) {
            if (isLone(i, x)) {
                const loneEdge = isLone(i, x)
                let j = 0;
                loneEdge[0] == i ? j = loneEdge[1] : j = loneEdge[0]
                console.log(i,j)
            }
        }
    }
    return 'end'
}

function isLone(v, x) {
    let count = 0;
    let source, target

    for (let i = 0; i < x.length; i++) {
        [source, target] = x[i];

        if (source === v || target === v) {
            count++;
        }

        if (count > 1) {
            return false;
        }
    }

    return [source, target]
}