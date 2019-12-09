export function* runOpcodes(
    instructionsString: string,
): Generator<{ instruction: number; output?: number }, { instruction: number; output?: number }, number> {
    let position = 0;
    let instructions = instructionsString.split(',').map(Number);

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
            const input = yield { instruction: 3 };
            if (input === undefined) {
                throw new Error('Logic error, no input provided');
            }
            instructions[newPosition] = input;
            position += 2;
        } else if (instruction === 4) {
            const positionA = instructions[position + 1];
            yield { instruction: 4, output: getA(positionA) };
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

    return { instruction: 99 };
}

export function amplify(program: string, amplifyInputs: number[]) {
    let currentResult = 0;
    while (true) {
        let input = amplifyInputs.shift();
        if (input === undefined) {
            break;
        }

        let iterator = runOpcodes(program);
        let nextOutput = iterator.next();

        if (nextOutput.value.instruction !== 3) {
            throw new Error('Logic error, expected input.');
        }
        nextOutput = iterator.next(input);
        if (nextOutput.value.instruction !== 3) {
            throw new Error('Logic error, expected input.');
        }
        nextOutput = iterator.next(currentResult);

        if (nextOutput.value.instruction !== 4 || nextOutput.value.output === undefined) {
            throw new Error('Logic error, expected output.');
        }
        currentResult = nextOutput.value.output;

        nextOutput = iterator.next(currentResult);
        if (nextOutput.value.instruction !== 99) {
            throw new Error('Logic error, expected halt.');
        }
    }
    return currentResult;
}

export function generatePermutations(inputs: number[]): number[][] {
    let foundPermutations: number[][] = [];
    let iterations = 0;
    function findPermutations(size: number, n: number) {
        if (iterations++ > 1000000) {
            throw new Error('infinite loop :(');
        }
        // heap's algorithm
        if (size === 1) {
            foundPermutations.push([ ...inputs ]);
        }

        for (let i = 0; i < size; i++) {
            findPermutations(size - 1, n);

            if (size % 2 === 1) {
                let temp = inputs[0];
                inputs[0] = inputs[size - 1];
                inputs[size - 1] = temp;
            } else {
                let temp = inputs[i];
                inputs[i] = inputs[size - 1];
                inputs[size - 1] = temp;
            }
        }
    }

    findPermutations(inputs.length, inputs.length);

    return foundPermutations;
}

export function getHighestThruster(program: string) {
    let max = 0;
    for (let combination of generatePermutations([0,1,2,3,4])) {
        max = Math.max(max, amplify(program, combination));
    }
    return max;
}