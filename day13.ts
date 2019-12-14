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

export function drawGame(outputs: number[]): XY[] {
    let grid: XY[] = [];
    let runningOutputs = [...outputs];
    let iterations = 0;
    while (runningOutputs.length) {
        if (iterations++ > 100000) {
            throw new Error('Logic error, infinite loop');
        }
        let [x, y, tileId] = runningOutputs.splice(0, 3);
        getCell({ X: x, Y: y }, grid).value = tileId;
    }

    return grid;
}

export function playGame(program: string): XY[] {
    let grid: XY[] = [];
    let iterations = 0;
    let instance = runOpcodes(program);
    let outputs: number[] = [];
    let initialGameRun = true;

    let nextInput = undefined;
    while (true) {
        if (iterations++ > 100000) {
            throw new Error('Logic error, infinite loop');
        }
        let nextOutput = instance.next(nextInput);
        nextInput = undefined;

        if (nextOutput.value.instruction === 3) {
            initialGameRun = false;

            let ball = grid.filter(x => x.value === 3)[0];
            let paddle = grid.filter(x => x.value === 4)[0];

            if (paddle.X < ball.X) {
                nextInput = -1;
            } else if (paddle.X > ball.X) {
                nextInput = 1;
            } else {
                nextInput = 0; // neutral position
            }
        } else if (nextOutput.value.instruction === 4) {
            if (nextOutput.value.output !== undefined) {
                outputs.push(nextOutput.value.output);
                if (outputs.length === 3) {
                    let [x, y, tileId] = outputs;
                    outputs = [];
                    getCell({ X: x, Y: y }, grid).value = tileId;
                }
            }
        } else if (nextOutput.value.instruction === 99) {
            break;
        }
    }

    return grid;
}

export type XY = {
    X: number;
    Y: number;
    value: number;
};

export let getCell = (XY: { X: number; Y: number }, cells: XY[]): XY => {
    let cell = cells.filter(cell => cell.X === XY.X && cell.Y === XY.Y)[0];

    if (!cell) {
        cell = { X: XY.X, Y: XY.Y, value: 0 };
        cells.push(cell);
    }

    return cell;
};
