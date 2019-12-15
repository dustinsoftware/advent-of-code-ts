import {
    parseInput,
    getPairs,
    simulateVelocity,
    setVelocity,
    setPositions,
    totalEnergy,
    printTable,
    findHistoryForAxis,
    SearchTree,
    treeContains,
    insertIntoTree,
    Axis,
    lowestMultiple
} from './day12';

test('parseInput', () => {
    expect(
        parseInput(`<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>`)
    ).toStrictEqual([
        { X: -1, Y: 0, Z: 2 },
        { X: 2, Y: -10, Z: -7 }
    ]);
});

test('getPairs', () => {
    // AB, AC, AD, BC, BD, CD
    let moons = parseInput(`<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`);
    expect(getPairs(moons).length).toStrictEqual(6);
});

test('simulateVelocity', () => {
    let getMoons = () =>
        parseInput(`<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`);

    expect(printTable(simulateVelocity(getMoons(), 0)))
        .toStrictEqual(`pos=<x=-1, y=  0, z= 2>, vel=<x= 0, y= 0, z= 0>
pos=<x= 2, y=-10, z=-7>, vel=<x= 0, y= 0, z= 0>
pos=<x= 4, y= -8, z= 8>, vel=<x= 0, y= 0, z= 0>
pos=<x= 3, y=  5, z=-1>, vel=<x= 0, y= 0, z= 0>`);

    expect(printTable(simulateVelocity(getMoons(), 1)))
        .toStrictEqual(`pos=<x= 2, y=-1, z= 1>, vel=<x= 3, y=-1, z=-1>
pos=<x= 3, y=-7, z=-4>, vel=<x= 1, y= 3, z= 3>
pos=<x= 1, y=-7, z= 5>, vel=<x=-3, y= 1, z=-3>
pos=<x= 2, y= 2, z= 0>, vel=<x=-1, y=-3, z= 1>`);

    expect(printTable(simulateVelocity(getMoons(), 10)))
        .toStrictEqual(`pos=<x= 2, y= 1, z=-3>, vel=<x=-3, y=-2, z= 1>
pos=<x= 1, y=-8, z= 0>, vel=<x=-1, y= 1, z= 3>
pos=<x= 3, y=-6, z= 1>, vel=<x= 3, y= 2, z=-3>
pos=<x= 2, y= 0, z= 4>, vel=<x= 1, y=-1, z=-1>`);
});

test('totalEnergy', () => {
    let getMoons = () =>
        parseInput(`<x=3, y=3, z=0>
<x=4, y=-16, z=2>
<x=-10, y=-6, z=5>
<x=-3, y=0, z=-13>`);

    expect(totalEnergy(simulateVelocity(getMoons(), 1000))).toStrictEqual(
        12351
    );
});

test('findHistory', () => {
    let getMoons = () =>
        parseInput(`<x=3, y=3, z=0>
<x=4, y=-16, z=2>
<x=-10, y=-6, z=5>
<x=-3, y=0, z=-13>`);

    expect(
        lowestMultiple([
            findHistoryForAxis(getMoons(), Axis.X),
            findHistoryForAxis(getMoons(), Axis.Y),
            findHistoryForAxis(getMoons(), Axis.Z)
        ])
    ).toStrictEqual(380635029877596);
});

test('lowestMultiple', () => {
    expect(lowestMultiple([1, 2, 3])).toBe(6);
    expect(lowestMultiple([7, 13, 17])).toBe(1547);
    expect(lowestMultiple([18, 28, 44])).toBe(2772);
});

test('setVelocity', () => {
    expect(
        setVelocity(
            { moon: { X: 1, Y: 2, Z: 3 }, velocity: { X: 2, Y: 0, Z: 0 } },
            { moon: { X: 4, Y: 2, Z: 3 }, velocity: { X: 2, Y: 0, Z: 0 } }
        )
    ).toStrictEqual({
        moonA: { moon: { X: 1, Y: 2, Z: 3 }, velocity: { X: 3, Y: 0, Z: 0 } },
        moonB: { moon: { X: 4, Y: 2, Z: 3 }, velocity: { X: 1, Y: 0, Z: 0 } }
    });
});

test('setPositions', () => {
    expect(
        setPositions({
            moon: { X: 1, Y: 2, Z: 3 },
            velocity: { X: 1, Y: 0, Z: 0 }
        })
    ).toStrictEqual({
        moon: { X: 2, Y: 2, Z: 3 },
        velocity: { X: 1, Y: 0, Z: 0 }
    });
});

test('treeContains', () => {
    let tree: SearchTree<number> = { value: false, child: new Map() };

    let insertAndVerify = (numbers: number[]) => {
        expect(treeContains(numbers, tree)).toBe(false);
        expect(insertIntoTree(numbers, tree));
        expect(treeContains(numbers, tree)).toBe(true);
    };

    insertAndVerify([1, 2, 3]);
    insertAndVerify([1]);
    insertAndVerify([2, 3, 4]);
    insertAndVerify([1, 2, 3, 4]);
});
