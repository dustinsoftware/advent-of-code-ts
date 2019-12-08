export type Node = {
    children: Node[];
    name: string;
    parentName: string;
    santaWeight?: number;
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
            parentName: pair[0]
        });
    }

    for (let node of nodeMap) {
        if (node[0] === 'COM') {
            continue;
        }
        const parentNode = nodeMap.get(node[1].parentName);
        if (!parentNode) {
            throw new Error(
                'Logic error, parent could not be found. ' + node[1].parentName
            );
        }
        parentNode.children.push(node[1]);
    }

    // set the weights now that the graph has loaded
    // for each node, set the weight of all children, traverse all the way down
    // alternate strategy: if a node is not loaded, push it on to the temporary stack until we find its parent.
    // could be expensive depending on how many we find..
    let runningWeight = 0;
    let stack = [{ value: nodeMap.get('COM')!, weight: 0 }];
    let currentNode: { value: Node; weight: number } | undefined;
    while ((currentNode = stack.pop())) {
        if (currentNode === undefined) {
            break;
        }
        runningWeight += currentNode.weight;
        stack.push(
            ...currentNode.value.children.map(value => ({
                value,
                weight: currentNode!.weight + 1
            }))
        );
    }

    return runningWeight;
}

export function buildSantaGraph(source: string) {
    let nodeMap: Map<string, Node> = new Map();
    nodeMap.set('COM', { children: [], name: 'COM', parentName: '' });

    for (let pair of parseInput(source)) {
        nodeMap.set(pair[1], {
            children: [],
            name: pair[1],
            parentName: pair[0]
        });
    }

    for (let node of nodeMap) {
        if (node[0] === 'COM') {
            continue;
        }
        const parentNode = nodeMap.get(node[1].parentName);
        if (!parentNode) {
            throw new Error(
                'Logic error, parent could not be found. ' + node[1].parentName
            );
        }
        parentNode.children.push(node[1]);
    }

    // set the weights now that the graph has loaded
    // for each node, set the weight of all children, traverse all the way down
    // alternate strategy: if a node is not loaded, push it on to the temporary stack until we find its parent.
    // could be expensive depending on how many we find..
    let runningWeight = 0;
    let stack = [{ value: nodeMap.get('SAN')!, weight: 0 }];
    let currentNode: { value: Node; weight: number } | undefined;
    let iterations = 0;
    let visited: Set<Node> = new Set();

    while ((currentNode = stack.pop())) {
        if (visited.has(currentNode.value)) {
            throw new Error('Logic error, already visited');
        }
        visited.add(currentNode.value);
        if (iterations++ > 1000000) {
            throw new Error('infinite loop :(');
        }
        if (currentNode === undefined) {
            break;
        }

        currentNode.value.santaWeight = currentNode.weight;
        runningWeight += currentNode.weight;
        stack.push(
            ...currentNode.value.children.filter(node => !visited.has(node)).map(
                value => ({ value, weight: currentNode!.weight + 1 }),
            ),
        );

        let parentNode = nodeMap.get(currentNode.value.parentName);
        if (parentNode && !visited.has(parentNode)) {
            stack.push({ value: parentNode, weight: currentNode!.weight + 1 });
        }
    }

    return nodeMap.get('YOU')!.santaWeight! - 2;
}
