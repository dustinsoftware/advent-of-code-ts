import { parseGrid, findVisiblePoints, getSortedPoints, getAngle } from './day10';

test('should work', () => {
    expect(
        parseGrid(`
.#..#
.....
#####
....#
...##`).map(x => x.value)
    ).toStrictEqual([
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        1
    ]);
});

test('getAngle', () => {
    expect(getAngle({ X: 0, Y: 0 }, { X: 1, Y: 0})).toBe(90);
    expect(getAngle({ X: 0, Y: 0 }, { X: 0, Y: 1})).toBe(0);
    expect(getAngle({ X: 0, Y: 0 }, { X: 0, Y: -1})).toBe(180);
    expect(getAngle({ X: 0, Y: 0 }, { X: -1, Y: 0})).toBe(270);
})
test('findVisiblePoints', () => {
    let grid = parseGrid(`
.#..#
.....
#####
....#
...##`);
    expect(findVisiblePoints(grid, { X: 1, Y: 0, value: 1 }).length).toStrictEqual(7);
    expect(findVisiblePoints(grid, { X: 3, Y: 4, value: 1 }).length).toStrictEqual(8);

    let grid2 = parseGrid(`
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`);

    expect(findVisiblePoints(grid2, { X: 11, Y: 13, value: 1 }).length).toStrictEqual(210);
});
