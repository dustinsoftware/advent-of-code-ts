export type XY = {
    X: number;
    Y: number;
    value: number;
    layer: number;
};

export function parseGrid(grid: string, columns: number, rows: number): XY[] {
    return grid
        .trim()
        .split('')
        .map(Number)
        .map((x, i) => ({
            X: i % columns,
            Y: Math.floor((i % (columns * rows)) / columns),
            layer: Math.floor(i / (columns * rows)),
            value: x
        }));
}

export function findFewestZerosLayer(grid: XY[]): XY[] {
    let layerSize = grid
        .map(x => (x.X + 1) * (x.Y + 1))
        .sort((a, b) => b - a)[0];

    let layerMap: Map<number, XY[]> = new Map();
    for (let point in grid) {
        let layerNumber = Math.floor(Number(point) / layerSize);
        let layer = layerMap.get(layerNumber);
        if (layer) {
            layer.push(grid[point]);
        } else {
            layerMap.set(layerNumber, [grid[point]]);
        }
    }


    return Array(...layerMap)
        .map(x => x[1])
        .sort(
            (a, b) =>
                a.filter(x => x.value === 0).length - b.filter(x => x.value === 0).length
        )[0];
}

// 0,1,2,3
// 4,5,6,7
