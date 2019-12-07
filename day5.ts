export function runOpcodes(
    instructionsString: string
): { output: number[]; instructions: number[] } {
    const inputValue = 1; // apparently this could be changed later?
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
        } else if (instruction === 99) {
            break;
        } else {
            throw new Error(
                'Failed! ' + JSON.stringify({ instructions, instruction })
            );
        }
    }

    return { output, instructions };
}
