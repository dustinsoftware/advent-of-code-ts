export function A() {
    return 2;
}

export function day2(input: string) {
    let position = 0;
    let instructions = input.split(',').map(Number);
    while (true)
    {
        let current = instructions[position];
        if (current === 1)
        {
            const [positionA, positionB, positionOut] = instructions.slice(position + 1, position + 4);
            instructions[positionOut] = instructions[positionA] + instructions[positionB];
            position += 4;
        }
        else if (current === 2)
        {
            const [positionA, positionB, positionOut] = instructions.slice(position + 1, position + 4);
            instructions[positionOut] = instructions[positionA] * instructions[positionB];
            position += 4;
        }
        else if (current === 99)
        {
            break;
        }
        else
        {
            throw new Error('Failed! ' + JSON.stringify(instructions));
        }
    }

    return instructions.join(',');
}

export function getFirstNumber(input: string) {
    return day2(input).split(',').map(Number)[0];
}

export function bruteForce(input: string) {
    for (let a = 0; a < 100; a++) {
        for (let b = 0; b < 100; b++) {
            let instructions = input.split(',').map(Number);
            instructions[1] = a;
            instructions[2] = b;
            if (getFirstNumber(instructions.join(',')) === 19690720) {
                return [a,b];
            }
        }
    }
    return [];
}

export function sillyMath(input: string) {
    const solution = bruteForce(input);
    return 100 * solution[0] + solution[1];
}
