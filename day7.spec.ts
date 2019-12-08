import { amplify, generatePermutations, getHighestThruster } from './day7';

test('day 7 runOpcodes', () => {
    expect(
        amplify('3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0', [
            4,
            3,
            2,
            1,
            0
        ])
    ).toStrictEqual(43210);
});

test('generatePermutations', () => {
    expect(generatePermutations([1, 2, 3])).toStrictEqual([
        [1, 2, 3],
        [2, 1, 3],
        [3, 1, 2],
        [1, 3, 2],
        [2, 3, 1],
        [3, 2, 1]
    ]);
});
test('getHighestThruster', () => {
    expect(
        getHighestThruster('3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0')
    ).toStrictEqual(43210);
});