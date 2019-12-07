export function runOpcodes(
    instructionsString: string,
    inputValue = 1
): { output: number[]; instructions: number[] } {
    let position = 0;
    let instructions = instructionsString.split(',').map(Number);
    let output: number[] = [];

    let [immediateA, immediateB] = [false, false];
    let getA = (value: number) => (immediateA ? value : instructions[value]);
    let getB = (value: number) => (immediateB ? value : instructions[value]);
    while (true) {
        let currentAsString = String(instructions[position]).padStart(5, '0');

        immediateA = currentAsString[2] === '1';
        immediateB = currentAsString[1] === '1';

        let instruction = Number(currentAsString.substring(3));
        if (instruction === 1) {
            const [positionA, positionB, positionC] = instructions.slice(
                position + 1,
                position + 4
            );
            instructions[positionC] = getA(positionA) + getB(positionB);
            position += 4;
        } else if (instruction === 2) {
            const [positionA, positionB, positionC] = instructions.slice(
                position + 1,
                position + 4
            );
            instructions[positionC] = getA(positionA) * getB(positionB);
            position += 4;
        } else if (instruction === 3) {
            const newPosition = instructions[position + 1];
            instructions[newPosition] = inputValue;
            position += 2;
        } else if (instruction === 4) {
            const positionA = instructions[position + 1];
            output.push(getA(positionA));
            position += 2;
        } else if (instruction === 5) {
            // jump if true
            const [positionA, positionB] = instructions.slice(
                position + 1,
                position + 3
            );

            if (getA(positionA) !== 0) {
                position = getB(positionB);
            } else {
                position += 3;
            }
        } else if (instruction === 6) {
            // jump if false
            const [positionA, positionB] = instructions.slice(
                position + 1,
                position + 3
            );

            if (getA(positionA) === 0) {
                position = getB(positionB);
            } else {
                position += 3;
            }
        } else if (instruction === 7) {
            // less than
            const [positionA, positionB, positionC] = instructions.slice(
                position + 1,
                position + 4
            );

            instructions[positionC] =
                getA(positionA) < getB(positionB) ? 1 : 0;
            position += 4;
        } else if (instruction === 8) {
            // equals
            const [positionA, positionB, positionC] = instructions.slice(
                position + 1,
                position + 4
            );

            instructions[positionC] =
                getA(positionA) === getB(positionB) ? 1 : 0;
            position += 4;
        } else if (instruction === 99) {
            break;
        } else {
            throw new Error(
                'Illegal instruction! ' +
                    JSON.stringify({ instructions, instruction })
            );
        }
    }

    return { output, instructions };
}
