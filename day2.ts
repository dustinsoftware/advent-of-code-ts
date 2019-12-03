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
