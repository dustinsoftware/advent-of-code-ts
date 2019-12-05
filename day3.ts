export type XY = {
    X: number;
    Y: number;
};

export enum Direction {
    U = 'U',
    D = 'D',
    L = 'L',
    R = 'R'
}

export type Movement = {
    current: XY;
    next: XY;
    direction: Direction;
};

export type Path = {
    direction: Direction;
    distance: number;
};

export function taxicabDistance(source: XY, dest: XY) {
    return Math.abs(source.X - dest.X) + Math.abs(source.Y - dest.Y);
}

export function mapToGrid(start: XY, paths: Path[]): Movement[] {
    let grid: Movement[] = [];
    let next = { ...start };
    for (let path of paths) {
        let current = next;
        next = move(next, path);
        grid.push({ current, next, direction: path.direction });
    }

    return grid;
}

export function intersects(
    firstGrid: Movement[],
    secondGrid: Movement[]
): XY[] {
    // for each line in the grid
    // if LR, only consider UD in grid. vice versa.
    // for our UD line range, do any Y coordinates match a line in the grid?
    // if so, check the X range of grid line. will need to sort this. if line.X1 < current.X < line.X2, we have a collision.

    let intersections: XY[] = [];
    for (let firstGridMovement of firstGrid) {
        // an optimization, we could drop this..
        let directions = [Direction.U, Direction.D].includes(
            firstGridMovement.direction
        )
            ? [Direction.L, Direction.R]
            : [Direction.U, Direction.D];

        for (let secondGridMovement of secondGrid.filter(x =>
            directions.includes(x.direction)
        )) {
            if (
                [Direction.U, Direction.D].includes(
                    secondGridMovement.direction
                )
            ) {
                if (
                    secondGridMovement.current.X !== secondGridMovement.next.X
                ) {
                    throw new Error('Logic error, X coordinates must be equal');
                }
                if (firstGridMovement.current.Y !== firstGridMovement.next.Y) {
                    throw new Error('Logic error, Y coordinates must be equal');
                }
                // first is LR, sort X coordinates
                const [firstX, firstX2] = [
                    firstGridMovement.current.X,
                    firstGridMovement.next.X
                ].sort((a, b) => a - b);
                const [secondY, secondY2] = [
                    secondGridMovement.current.Y,
                    secondGridMovement.next.Y
                ].sort((a, b) => a - b);

                if (
                    firstX < secondGridMovement.current.X &&
                    secondGridMovement.current.X < firstX2 &&
                    secondY < firstGridMovement.current.Y &&
                    firstGridMovement.current.Y < secondY2
                )
                    intersections.push({ X: secondGridMovement.current.X, Y: firstGridMovement.current.Y });
            }

            // probably could rotate the grid 90 to avoid this duplication, but whatever...
            if (
                [Direction.L, Direction.R].includes(
                    secondGridMovement.direction
                )
            ) {
                if (
                    firstGridMovement.current.X !== firstGridMovement.next.X
                ) {
                    throw new Error('Logic error, X coordinates must be equal');
                }
                if (secondGridMovement.current.Y !== secondGridMovement.next.Y) {
                    throw new Error('Logic error, Y coordinates must be equal');
                }
                // first is UD, sort Y coordinates
                const [firstY, firstY2] = [
                    firstGridMovement.current.Y,
                    firstGridMovement.next.Y
                ].sort((a, b) => a - b);
                const [secondX, secondX2] = [
                    secondGridMovement.current.X,
                    secondGridMovement.next.X
                ].sort((a, b) => a - b);

                if (
                    firstY < secondGridMovement.current.Y &&
                    secondGridMovement.current.Y < firstY2 &&
                    secondX < firstGridMovement.current.X &&
                    firstGridMovement.current.X < secondX2
                )
                    intersections.push({ X: firstGridMovement.current.X, Y: secondGridMovement.current.Y });
            }
        }
    }
    return intersections;
}

export function parseInstructions(instructions: string): Path[] {
    return instructions.split(',').map(x => ({
        direction: x.substring(0, 1) as Direction,
        distance: Number(x.substring(1))
    }));
}

export function move(source: XY, path: Path): XY {
    let next = { ...source };
    if (path.direction === Direction.U) {
        next.Y += path.distance;
    }
    if (path.direction === Direction.D) {
        next.Y -= path.distance;
    }
    if (path.direction === Direction.L) {
        next.X -= path.distance;
    }
    if (path.direction === Direction.R) {
        next.X += path.distance;
    }

    return next;
}
