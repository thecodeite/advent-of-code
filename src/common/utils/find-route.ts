export interface TreeNode {
  id: string;
  //parent?: TreeNode;
  path: string[];
  distance: number;
}

export function buildMinimumSpanTree(
  idMap: Record<string, string[] | undefined>,
  from: string,
) {
  const root: TreeNode = {
    id: from,
    distance: 0,
    path: [],
  };
  let nodes: Record<string, TreeNode | undefined> = { [from]: root };
  let unvisited = [root];

  let limit = 10000000;
  for (;;) {
    if (limit-- < 0) throw new Error("Too many steps");
    const currentCheck = unvisited.shift();
    if (!currentCheck) break;
    const current = currentCheck;

    const neighbours = (idMap[current.id] ?? []).filter(n => !nodes[n]);

    neighbours.forEach(id => {
      const node = {
        id,
        distance: current.distance + 1,
        path: [...current.path, id],
        //parent: current,
      };
      nodes[id] = node;
      unvisited.push(node);
    });
  }
  return nodes;
}
