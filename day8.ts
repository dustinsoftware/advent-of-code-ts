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

export function mergeLayers(grid: XY[]): string {
    let layerSize = grid
        .map(x => (x.X + 1) * (x.Y + 1))
        .sort((a, b) => b - a)[0];

    let columnSize = grid
        .map(x => x.X)
        .sort((a, b) => b - a)[0] + 1;

    // sigh, another layer swapping
    let totalLayers = grid.length / layerSize;
    let layeredGrid: XY[][] = Array(totalLayers).fill(0).map(() => []);

    for (let point in grid) {
        let layerNumber = Math.floor(Number(point) / layerSize);
        let layer = layeredGrid[totalLayers - layerNumber - 1];
        layer[Number(point) % layerSize] = grid[point];
    }

    let finalLayer = layeredGrid[0].map(x => x.value === 0 ? ' ' : 'B');
    for (let layer of layeredGrid) {
        for (let point in layer) {
            finalLayer[point] = layer[point].value === 0 ? ' ' : layer[point].value === 1 ? 'B' : finalLayer[point];
        }
    }

    let layerAsString: string = finalLayer.map((value, i) => i % columnSize === 0 ? value + '\n' : value).join('');

    // a bit lazy to fix this up
    // console.log(layerAsString);
    return '';
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
                a.filter(x => x.value === 0).length -
                b.filter(x => x.value === 0).length
        )[0];
}

// 0,1,2,3
// 4,5,6,7
