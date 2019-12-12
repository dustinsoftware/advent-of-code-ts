export function* runOpcodes(
    instructionsString: string
): Generator<
    { instruction: number; output?: number },
    { instruction: number; output?: number },
    number | undefined
> {
    let position = 0;
    let instructions = instructionsString.split(',').map(Number);
    let iterations = 0;
    let relativeBase = 0;
    let [
        immediateA,
        immediateB,
        immediateC,
        relativeA,
        relativeB,
        relativeC
    ] = [false, false, false, false, false, false];
    let makeUndefinedZero = (input: number | undefined) =>
        input === undefined ? 0 : input;
    let getA = (value: number) =>
        makeUndefinedZero(
            immediateA
                ? value
                : relativeA
                ? instructions[value + relativeBase]
                : instructions[value]
        );
    let getB = (value: number) =>
        makeUndefinedZero(
            immediateB
                ? value
                : relativeB
                ? instructions[value + relativeBase]
                : instructions[value]
        );

    while (true) {
        if (iterations++ > 1000000) {
            throw new Error('Infinite loop :(');
        }
        let currentAsString = String(instructions[position]).padStart(5, '0');

        if (!['0', '1', '2'].includes(currentAsString[2])) {
            throw new Error('Invalid instruction type: ' + currentAsString[2]);
        }
        if (!['0', '1', '2'].includes(currentAsString[1])) {
            throw new Error('Invalid instruction type: ' + currentAsString[2]);
        }
        immediateA = currentAsString[2] === '1';
        immediateB = currentAsString[1] === '1';
        immediateC = currentAsString[0] === '1';
        relativeA = currentAsString[2] === '2';
        relativeB = currentAsString[1] === '2';
        relativeC = currentAsString[0] === '2';

        if (immediateC) {
            throw new Error('Logic error, C should never be immediate mode');
        }

        let instruction = Number(currentAsString.substring(3));
        if (instruction === 1) {
            const [positionA, positionB, positionC] = instructions.slice(
                position + 1,
                position + 4
            );
            instructions[relativeC ? positionC + relativeBase : positionC] =
                getA(positionA) + getB(positionB);
            position += 4;
        } else if (instruction === 2) {
            const [positionA, positionB, positionC] = instructions.slice(
                position + 1,
                position + 4
            );
            instructions[relativeC ? positionC + relativeBase : positionC] =
                getA(positionA) * getB(positionB);
            position += 4;
        } else if (instruction === 3) {
            const newPosition = instructions[position + 1];
            const input = yield { instruction: 3 };
            if (input === undefined) {
                throw new Error('Logic error, no input provided');
            }
            instructions[
                relativeA ? newPosition + relativeBase : newPosition
            ] = input;
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

            instructions[relativeC ? positionC + relativeBase : positionC] =
                getA(positionA) < getB(positionB) ? 1 : 0;
            position += 4;
        } else if (instruction === 8) {
            // equals
            const [positionA, positionB, positionC] = instructions.slice(
                position + 1,
                position + 4
            );

            instructions[relativeC ? positionC + relativeBase : positionC] =
                getA(positionA) === getB(positionB) ? 1 : 0;
            position += 4;
        } else if (instruction === 9) {
            // shift relative base
            const [positionA] = instructions.slice(position + 1, position + 2);

            relativeBase += getA(positionA);
            position += 2;
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

export function getAllOutput(program: string, inputs: number[]): number[] {
    let instance = runOpcodes(program);
    let outputs: number[] = [];
    let iterations = 0;

    let nextInput = undefined;
    while (true) {
        if (iterations++ > 100000) {
            throw new Error('Logic error, infinite loop');
        }
        let nextOutput = instance.next(nextInput);
        nextInput = undefined;
        if (nextOutput.value.instruction === 3) {
            nextInput = inputs.shift();
        } else if (nextOutput.value.instruction === 4) {
            if (nextOutput.value.output !== undefined) {
                outputs.push(nextOutput.value.output);
            } else {
                break;
            }
            continue;
        } else if (nextOutput.value.instruction === 99) {
            break;
        } else {
            throw new Error(
                'Logic error, unexpected yield. ' + nextOutput.value.instruction
            );
        }
    }

    return outputs;
}

export function amplify(program: string, amplifyInputs: number[]) {
    let currentResult = 0;
    let programInstances = Array(amplifyInputs.length)
        .fill(0)
        .map(() => runOpcodes(program));
    let halt = false;
    let iterations = 0;

    if (amplifyInputs.length !== 5) {
        throw new Error('Logic error, expected 5 input');
    }

    // load initial combination
    for (let input in amplifyInputs) {
        programInstances[input].next(); // initial run
        programInstances[input].next(amplifyInputs[input]);
    }

    while (!halt && iterations++ < 1000000) {
        for (let program of programInstances) {
            // guaranteed to be waiting on an input instruction
            let nextOutput = program.next(currentResult);

            if (nextOutput.value === undefined) {
                throw new Error('Logic error, generator returned undefined');
            }
            if (
                nextOutput.value.instruction !== 4 ||
                nextOutput.value.output === undefined
            ) {
                throw new Error(
                    'Logic error, expected output. Got ' +
                        nextOutput.value.instruction
                );
            }

            currentResult = nextOutput.value.output;
            nextOutput = program.next(); // continue from output, next call will either be input or exit
            if (nextOutput.value.instruction === 99) {
                halt = true;
            } else if (nextOutput.value.instruction !== 3) {
                throw new Error(
                    'Logic error, expected input. Got ' +
                        nextOutput.value.instruction
                );
            }
        }
    }
    if (iterations === 1000000) {
        throw new Error('Logic error, infinite loop');
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
            foundPermutations.push([...inputs]);
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

export function getHighestThruster(program: string, combinations: number[]) {
    let max = 0;
    for (let combination of generatePermutations(combinations)) {
        max = Math.max(max, amplify(program, combination));
    }
    return max;
}
