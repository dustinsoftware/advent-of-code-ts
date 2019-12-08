import { parseInput, buildGraph } from './day6';

test('parseInput', () => {
    expect(
        parseInput(`
COM)B
B)C
C)D`)
    ).toStrictEqual([
        ['COM', 'B'],
        ['B', 'C'],
        ['C', 'D']
    ]);
});

test('buildGraph', () => {
    expect(
        buildGraph(`
COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`)
    ).toStrictEqual(42);
    expect(
        buildGraph(`
B)C
B)G
C)D
COM)B
D)E
D)I
E)F
E)J
G)H
J)K
K)L
`)
    ).toStrictEqual(42);
});
