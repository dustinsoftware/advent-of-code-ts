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

export type XY = {
    X: number;
    Y: number;
    hasPainted: boolean;
    value: number;
};

export enum Direction {
    U = 0,
    D = 180,
    L = 270,
    R = 90
}

export type Robot = {
    direction: Direction;
    X: number;
    Y: number;
};

export let moveRobot = (robot: Robot, rotation: number): Robot => {
    let movedRobot = { ...robot };
    movedRobot.direction =
        (movedRobot.direction + (rotation < 0 ? rotation + 360 : rotation)) %
        360;
    if (movedRobot.direction == Direction.U) {
        movedRobot.Y += 1;
    }
    if (movedRobot.direction == Direction.D) {
        movedRobot.Y -= 1;
    }
    if (movedRobot.direction == Direction.R) {
        movedRobot.X += 1;
    }
    if (movedRobot.direction == Direction.L) {
        movedRobot.X -= 1;
    }
    return movedRobot;
};

export let getCell = (robot: Robot, cells: XY[]): XY => {
    let cell = cells.filter(
        cell => cell.X === robot.X && cell.Y === robot.Y
    )[0];

    if (!cell) {
        cell = { X: robot.X, Y: robot.Y, hasPainted: false, value: 0 };
        cells.push(cell);
    }

    return cell;
};

export function* runTestMovements(
    testMovements: number[]
): Generator<
    { instruction: number; output?: number },
    { instruction: number; output?: number },
    number | undefined
> {
    let movements = [...testMovements];
    while (movements.length) {
        let currentCellValue = yield { instruction: 3 };
        yield { instruction: 4, output: currentCellValue === 0 ? 1 : 0 };
        yield { instruction: 4, output: movements.shift() };
    }
    return { instruction: 99 };
}

export function walkOnGrid(program: string, testMovements: number[] = []) {
    let start: XY = { X: 0, Y: 0, hasPainted: false, value: 0 };
    let cells: XY[] = [start];
    let robot: Robot = { direction: Direction.U, X: 0, Y: 0 };

    // run the program
    let iterations = 0;
    let instance = testMovements.length
        ? runTestMovements(testMovements)
        : runOpcodes(program);
    let nextInput = undefined;
    let pendingColor: number | undefined = undefined;

    while (true) {
        if (iterations++ > 100000) {
            throw new Error('Logic error, infinite loop');
        }
        let nextOutput = instance.next(nextInput);
        nextInput = undefined;

        if (nextOutput.value.instruction === 3) {
            nextInput = getCell(robot, cells).value;
        } else if (nextOutput.value.instruction === 4) {
            if (nextOutput.value.output === undefined) {
                throw new Error('Logic error, empty output');
            }
            if (pendingColor !== undefined) {
                let cell = getCell(robot, cells);
                cell.hasPainted = true;
                cell.value = pendingColor;
                let rotation = nextOutput.value.output;
                robot = moveRobot(robot, rotation === 0 ? -90 : 90);

                pendingColor = undefined;
            } else {
                pendingColor = nextOutput.value.output;
            }
        } else if (nextOutput.value.instruction === 99) {
            break;
        } else {
            throw new Error(
                'Logic error, unexpected yield. ' + nextOutput.value.instruction
            );
        }
    }

    return cells.filter(x => x.hasPainted).length;
}
