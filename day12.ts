export type XYZ = {
    X: number;
    Y: number;
    Z: number;
};

export type MoonVelocity = {
    moon: XYZ;
    velocity: XYZ;
};

export function parseInput(source: string): XYZ[] {
    let moons: XYZ[] = [];

    for (let moonString of source.split('\n') || []) {
        let groupedInput = /\<x=(-?\d+), y=(-?\d+), z=(-?\d+)\>/.exec(
            moonString
        );
        if (groupedInput?.length !== 4) {
            throw new Error('Logic error, expected 3 matches');
        }
        moons.push({
            X: Number(groupedInput[1]),
            Y: Number(groupedInput[2]),
            Z: Number(groupedInput[3])
        });
    }

    return moons;
}

export function simulateVelocity(moons: XYZ[], steps: number) {
    let moonsWithVelocity: MoonVelocity[] = moons.map(moon => ({
        moon,
        velocity: { X: 0, Y: 0, Z: 0 }
    }));
    for (let i = 0; i < steps; i++) {
        for (let pairs of getPairs(moonsWithVelocity)) {
            setVelocity(pairs.moonA, pairs.moonB);
        }

        for (let moon of moonsWithVelocity) {
            setPositions(moon);
        }
    }
    return moonsWithVelocity;
}

export function setPositions(moon: MoonVelocity) {
    moon.moon.X += moon.velocity.X;
    moon.moon.Y += moon.velocity.Y;
    moon.moon.Z += moon.velocity.Z;
    return moon;
}

export function setVelocity(moonA: MoonVelocity, moonB: MoonVelocity) {
    let velocityForAxis = (velocity: number, a: number, b: number) =>
        velocity + (a < b ? 1 : a > b ? -1 : 0);

    moonA.velocity.X = velocityForAxis(
        moonA.velocity.X,
        moonA.moon.X,
        moonB.moon.X
    );
    moonA.velocity.Y = velocityForAxis(
        moonA.velocity.Y,
        moonA.moon.Y,
        moonB.moon.Y
    );
    moonA.velocity.Z = velocityForAxis(
        moonA.velocity.Z,
        moonA.moon.Z,
        moonB.moon.Z
    );

    moonB.velocity.X = velocityForAxis(
        moonB.velocity.X,
        moonB.moon.X,
        moonA.moon.X
    );
    moonB.velocity.Y = velocityForAxis(
        moonB.velocity.Y,
        moonB.moon.Y,
        moonA.moon.Y
    );
    moonB.velocity.Z = velocityForAxis(
        moonB.velocity.Z,
        moonB.moon.Z,
        moonA.moon.Z
    );

    return { moonA, moonB };
}

export function printTable(moonsWithVelocity: MoonVelocity[]) {
    let maxXColumns =
        String(largest(moonsWithVelocity.map(x => Math.abs(x.moon.X)))).length +
        1;
    let maxYColumns =
        String(largest(moonsWithVelocity.map(x => Math.abs(x.moon.Y)))).length +
        1;
    let maxZColumns =
        String(largest(moonsWithVelocity.map(x => Math.abs(x.moon.Z)))).length +
        1;

    let maxXVelocityColumns =
        String(largest(moonsWithVelocity.map(x => Math.abs(x.velocity.X))))
            .length + 1;
    let maxYVelocityColumns =
        String(largest(moonsWithVelocity.map(x => Math.abs(x.velocity.Y))))
            .length + 1;
    let maxZVelocityColumns =
        String(largest(moonsWithVelocity.map(x => Math.abs(x.velocity.Z))))
            .length + 1;
    return moonsWithVelocity
        .map(
            pair =>
                `pos=<x=${String(pair.moon.X).padStart(
                    maxXColumns
                )}, y=${String(pair.moon.Y).padStart(maxYColumns)}, z=${String(
                    pair.moon.Z
                ).padStart(maxZColumns)}>, vel=<x=${String(
                    pair.velocity.X
                ).padStart(maxXVelocityColumns)}, y=${String(
                    pair.velocity.Y
                ).padStart(maxYVelocityColumns)}, z=${String(
                    pair.velocity.Z
                ).padStart(maxZVelocityColumns)}>`
        )
        .join('\n');
}

export function getPairs<T>(moons: T[]): { moonA: T; moonB: T }[] {
    let pairs: { moonA: T; moonB: T }[] = [];

    for (let moonA of moons) {
        for (let moonB of moons.filter(x => x !== moonA)) {
            if (
                pairs.filter(x => x.moonA === moonA && x.moonB === moonB)[0] ===
                    undefined &&
                pairs.filter(x => x.moonB === moonA && x.moonA === moonB)[0] ===
                    undefined
            ) {
                pairs.push({ moonA, moonB });
            }
        }
    }

    return pairs;
}

export function largest(numbers: number[]): number {
    return numbers.sort((a, b) => b - a)[0];
}

export function totalEnergy(moons: MoonVelocity[]): number {
    return moons
        .map(
            moonVelocity =>
                (Math.abs(moonVelocity.moon.X) +
                    Math.abs(moonVelocity.moon.Y) +
                    Math.abs(moonVelocity.moon.Z)) *
                (Math.abs(moonVelocity.velocity.X) +
                    Math.abs(moonVelocity.velocity.Y) +
                    Math.abs(moonVelocity.velocity.Z))
        )
        .reduce((prev, curr) => prev + curr, 0);
}
