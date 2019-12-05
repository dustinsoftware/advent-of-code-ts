import {
    taxicabDistance,
    move,
    Direction,
    parseInstructions,
    mapToGrid,
    intersects
} from './day3';

test('taxicab distance', () => {
    expect(taxicabDistance({ X: 1, Y: 1 }, { X: 4, Y: 4 })).toBe(6);
    expect(taxicabDistance({ X: 4, Y: 0 }, { X: 1, Y: 0 })).toBe(3);
});

test('move', () => {
    expect(
        move({ X: 5, Y: 3 }, { direction: Direction.D, distance: 10 })
    ).toStrictEqual({ X: 5, Y: -7 });
    expect(
        move({ X: 5, Y: 3 }, { direction: Direction.U, distance: 10 })
    ).toStrictEqual({ X: 5, Y: 13 });
    expect(
        move({ X: 5, Y: 3 }, { direction: Direction.L, distance: 10 })
    ).toStrictEqual({ X: -5, Y: 3 });
    expect(
        move({ X: 5, Y: 3 }, { direction: Direction.R, distance: 10 })
    ).toStrictEqual({ X: 15, Y: 3 });
});

test('parse instructions', () => {
    expect(parseInstructions('U284,L447,D597,R888')).toStrictEqual([
        { direction: 'U', distance: 284 },
        { direction: 'L', distance: 447 },
        { direction: 'D', distance: 597 },
        { direction: 'R', distance: 888 }
    ]);
});

test('mapToGrid', () => {
    expect(mapToGrid({ X: 0, Y: 0 }, [])).toStrictEqual([]);
    expect(
        mapToGrid({ X: 0, Y: 0 }, [
            { direction: Direction.R, distance: 8 },
            { direction: Direction.U, distance: 5 },
            { direction: Direction.L, distance: 5 },
            { direction: Direction.D, distance: 3 }
        ]).pop()
    ).toStrictEqual({
        current: {
            X: 3,
            Y: 5
        },
        direction: 'D',
        next: {
            X: 3,
            Y: 2
        }
    });
});

test('intersects', () => {
    const updown = [
        mapToGrid({ X: 1, Y: 0 }, [{ direction: Direction.U, distance: 8 }]),
        mapToGrid({ X: 1, Y: 8 }, [{ direction: Direction.D, distance: 8 }])
    ];
    const leftright = [
        mapToGrid({ X: 0, Y: 1 }, [{ direction: Direction.R, distance: 8 }]),
        mapToGrid({ X: 8, Y: 1 }, [{ direction: Direction.L, distance: 8 }])
    ];

    const combinations = [
        [updown[0], leftright[0]],
        [updown[0], leftright[1]],
        [updown[1], leftright[0]],
        [updown[1], leftright[1]],
        [leftright[0], updown[0]],
        [leftright[0], updown[1]],
        [leftright[1], updown[0]],
        [leftright[1], updown[1]]
    ];

    for (let combination of combinations) {
        expect(intersects(combination[0], combination[1])).toStrictEqual([
            { X: 1, Y: 1 }
        ]);
    }
});

test.each([
    ['R8,U5,L5,D3', 'U7,R6,D4,L4', 6],
    [
        'R75,D30,R83,U83,L12,D49,R71,U7,L72',
        'U62,R66,U55,R34,D71,R55,D58,R83',
        159
    ],
    [
        'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51',
        'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7',
        135
    ]
])(
    'distance from provided input',
    (firstPath, secondPath, expectedDistance) => {
        const start = { X: 0, Y: 0 };
        const intersections = intersects(
            mapToGrid(start, parseInstructions(firstPath as string)),
            mapToGrid(start, parseInstructions(secondPath as string))
        );

        expect(
            intersections
                .map(xy => taxicabDistance(start, xy))
                .sort((a, b) => a - b)[0]
        ).toBe(expectedDistance);
    }
);

test('intersections from provided input', () => {
    const start = { X: 0, Y: 0 };
    const intersections = intersects(
        mapToGrid(start, parseInstructions('R8,U5,L5,D3')),
        mapToGrid(start, parseInstructions('U7,R6,D4,L4'))
    );

    expect(intersections).toStrictEqual([
        { X: 6, Y: 5 },
        { X: 3, Y: 3 }
    ]);
});
