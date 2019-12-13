import { walkOnGrid, moveRobot, Direction, getCell, Robot, XY } from './day11';

test('day 11 test cases', () => {
    expect(
        walkOnGrid(
            '3,8,1005,8,311,1106,0,11,0,0,0,104,1,104,0,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,1,10,4,10,1001,8,0,29,1006,0,98,2,1005,8,10,1,1107,11,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,0,10,4,10,101,0,8,62,1006,0,27,2,1002,12,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,0,8,10,4,10,1002,8,1,90,1,1006,1,10,2,1,20,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,1,10,4,10,102,1,8,121,1,1003,5,10,1,1003,12,10,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,1,10,4,10,1002,8,1,151,1006,0,17,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,1002,8,1,175,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,101,0,8,197,2,6,14,10,1006,0,92,1006,0,4,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,1001,8,0,229,1006,0,21,2,102,17,10,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,1,10,4,10,1001,8,0,259,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,102,1,8,280,1006,0,58,1006,0,21,2,6,11,10,101,1,9,9,1007,9,948,10,1005,10,15,99,109,633,104,0,104,1,21101,937150919572,0,1,21102,328,1,0,1105,1,432,21101,0,387394675496,1,21102,1,339,0,1106,0,432,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21102,46325083283,1,1,21102,1,386,0,1106,0,432,21101,0,179519401051,1,21102,397,1,0,1106,0,432,3,10,104,0,104,0,3,10,104,0,104,0,21102,1,868410348308,1,21102,1,420,0,1105,1,432,21102,718086501140,1,1,21102,1,431,0,1105,1,432,99,109,2,22101,0,-1,1,21101,40,0,2,21101,0,463,3,21101,453,0,0,1106,0,496,109,-2,2105,1,0,0,1,0,0,1,109,2,3,10,204,-1,1001,458,459,474,4,0,1001,458,1,458,108,4,458,10,1006,10,490,1101,0,0,458,109,-2,2105,1,0,0,109,4,2102,1,-1,495,1207,-3,0,10,1006,10,513,21102,0,1,-3,22102,1,-3,1,22102,1,-2,2,21102,1,1,3,21102,1,532,0,1105,1,537,109,-4,2105,1,0,109,5,1207,-3,1,10,1006,10,560,2207,-4,-2,10,1006,10,560,22101,0,-4,-4,1105,1,628,22102,1,-4,1,21201,-3,-1,2,21202,-2,2,3,21102,1,579,0,1105,1,537,22101,0,1,-4,21102,1,1,-1,2207,-4,-2,10,1006,10,598,21102,1,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,620,22102,1,-1,1,21102,1,620,0,105,1,495,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2106,0,0'
        )
    ).toStrictEqual(1934);
});

test('testMovements', () => {
    expect(walkOnGrid('', [1,1,1,1])).toStrictEqual(4);
})

test('moveRobot', () => {
    expect(
        moveRobot({ X: 1, Y: 1, direction: Direction.U }, 90)
    ).toStrictEqual({ X: 2, Y: 1, direction: Direction.R });
    expect(
        moveRobot({ X: 2, Y: 1, direction: Direction.R }, 90)
    ).toStrictEqual({ X: 2, Y: 0, direction: Direction.D });
    expect(
        moveRobot({ X: 2, Y: 0, direction: Direction.D }, 90)
    ).toStrictEqual({ X: 1, Y: 0, direction: Direction.L });
    expect(
        moveRobot({ X: 1, Y: 0, direction: Direction.L }, 90)
    ).toStrictEqual({ X: 1, Y: 1, direction: Direction.U });

    expect(
        moveRobot({ X: 1, Y: 1, direction: Direction.U }, -90)
    ).toStrictEqual({ X: 0, Y: 1, direction: Direction.L });
    expect(
        moveRobot({ X: 0, Y: 1, direction: Direction.L }, -90)
    ).toStrictEqual({ X: 0, Y: 0, direction: Direction.D });
    expect(
        moveRobot({ X: 0, Y: 0, direction: Direction.D }, -90)
    ).toStrictEqual({ X: 1, Y: 0, direction: Direction.R });
    expect(
        moveRobot({ X: 1, Y: 0, direction: Direction.R }, -90)
    ).toStrictEqual({ X: 1, Y: 1, direction: Direction.U });
});

test('getCell', () => {
    let cells: XY[] = [{ X: 2, Y: 2, hasPainted: false, value: 1 }];
    let robot: Robot = { X: 1, Y: 1, direction: Direction.U };
    expect(getCell(robot, cells)).toStrictEqual({
        X: 1,
        Y: 1,
        hasPainted: false,
        value: 0
    });
    expect(cells.length).toBe(2);
    expect(cells[1]).toStrictEqual({ X: 1, Y: 1, hasPainted: false, value: 0 });
});
