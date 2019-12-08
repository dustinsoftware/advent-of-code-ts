export type Node = {
    children: Node[];
    name: string;
    parentName: string;
};

export function parseInput(source: string) {
    return source
        .split('\n')
        .filter(Boolean)
        .map(x => x.split(')'));
}

export function buildGraph(source: string) {
    let nodeMap: Map<string, Node> = new Map();
    nodeMap.set('COM', { children: [], name: 'COM', parentName: '' });

    for (let pair of parseInput(source)) {
        nodeMap.set(pair[1], {
            children: [],
            name: pair[1],
            parentName: pair[0],
        });
    }

    for (let node of nodeMap) {
        if (node[0] === 'COM') {
            continue;
        }
        const parentNode = nodeMap.get(node[1].parentName);
        if (!parentNode) {
            throw new Error('Logic error, parent could not be found. ' + node[1].parentName);
        }
        parentNode.children.push(node[1]);
    }

    // set the weights now that the graph has loaded
    // for each node, set the weight of all children, traverse all the way down
    // alternate strategy: if a node is not loaded, push it on to the temporary stack until we find its parent.
    // could be expensive depending on how many we find..
    let runningWeight = 0;
    let stack = [{ value: nodeMap.get('COM')!, weight: 0 }];
    let currentNode: { value: Node, weight: number } | undefined;
    while (currentNode = stack.pop()) {
        if (currentNode === undefined) {
            break;
        }
        runningWeight += currentNode.weight;
        stack.push(...currentNode.value.children.map(value => ({ value, weight: currentNode!.weight + 1 })));
    }

    return runningWeight;
}
