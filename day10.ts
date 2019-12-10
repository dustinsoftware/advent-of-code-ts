export type XY = {
    X: number;
    Y: number;
    value?: number;
};

export function parseGrid(grid: string): XY[] {
    return grid
        .split('\n')
        .filter(Boolean)
        .map((row, y) =>
            row.split('').map((char, x) => {
                let value = char === '#' ? 1 : 0;
                return { value, X: x, Y: y } as XY;
            })
        )
        .reduce((prev, curr) => [...prev, ...curr], [] as XY[]);
}

export function getAngle(a: XY, b: XY) {
    let degrees = (Math.atan2(b.X - a.X, b.Y - a.Y) * 180) / Math.PI;
    return degrees < 0 ? degrees + 360 : degrees;
}

export function getSortedPoints(points: XY[], angle: number): XY[] {
    if (points.length === 0) {
        return [];
    }

    return points.sort((a, b) =>
        angle === 0 || (angle > 0 && angle < 90)
            ? a.Y - b.Y
            : angle === 90 || (angle > 90 && angle < 180)
            ? a.X - b.X
            : angle === 180 || (angle > 180 && angle < 270)
            ? b.Y - a.Y
            : angle === 270 || (angle > 270 && angle < 360)
            ? b.X - a.X
            : 0
    );
}

export function findVisiblePoints(grid: XY[], current: XY): XY[] {
    // for each point on the grid, calculate angle between point and current position
    // identify points inside box drawn between that point and current position
    // if the angle of any of those points match the current angle, the view is obstructed
    // return all the non obstructed points

    let points = grid
        .filter(x => x.value === 1 && (x.X !== current.X || x.Y !== current.Y))
        .map(point => ({ angle: getAngle(current, point), point }));

    // remove duplicate angles
    let angleMap: Map<number, XY[]> = new Map();
    for (let point of points) {
        let mapReference = angleMap.get(point.angle);
        if (mapReference) {
            mapReference.push(point.point);
        } else {
            angleMap.set(point.angle, [point.point]);
        }
    }

    let reducedPoints: XY[] = [];
    for (let angle of angleMap) {
        reducedPoints.push(getSortedPoints(angle[1], angle[0])[0]);
    }
    return reducedPoints;
}

export function findBestPoint(grid: XY[]): { point: XY; visiblePoints: XY[] } {
    return grid
        .map(point => ({
            point,
            visiblePoints: findVisiblePoints(grid, point)
        }))
        .sort((a, b) => b.visiblePoints.length - a.visiblePoints.length)[0];
}

export function nukeGrid(grid: XY[], current: XY, stopValue: number): XY {
    let iterations = 0;
    let nukedPoints: { angle: number, point: XY}[] = [];
        let nukedPointsSet: Set<XY> = new Set();

    while (grid.length && nukedPoints.length < stopValue) {
        if (iterations++ > 1000000) {
            throw new Error('Logic error, infinite loop');
        }

        // grid has to be flipped which throws a lot of logic off
        let points = grid
            .filter(
                x => x.value === 1 && (x.X !== current.X || x.Y !== current.Y)
            )
            .map(point => ({ angle: (getAngle(current, point) + 180) % 360, point }));

        // remove duplicate angles
        let angleMap: Map<number, XY[]> = new Map();
        for (let point of points) {
            let mapReference = angleMap.get(point.angle);
            if (mapReference) {
                mapReference.push(point.point);
            } else {
                angleMap.set(point.angle, [point.point]);
            }
        }

        let reducedPoints: { angle: number, points: XY[] }[] = [];
        for (let angle of angleMap) {
            reducedPoints.push({ angle: angle[0], points: getSortedPoints(angle[1], angle[0]) });
        }

        let orderedByAngle = reducedPoints.sort((a, b) => a.angle - b.angle);

        for (let angle of orderedByAngle) {
            nukedPoints.push({ angle: angle.angle, point: angle.points[0] });
            nukedPointsSet.add(angle.points[0]);

        }

        grid = grid.filter(x => !nukedPointsSet.has(x));
    }
    return nukedPoints[stopValue - 1].point;
}
