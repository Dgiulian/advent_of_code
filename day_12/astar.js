function findPath(grid, start, end) {
  // Create a set to store the visited nodes
  const visited = new Set();

  // Create a set to store the unvisited nodes
  const unvisited = new Set();
  unvisited.add(start);

  // Create a map to store the previous node for each node
  const previous = new Map();

  // Create a map to store the distance from the start node for each node
  const distance = new Map();
  distance.set(start, 0);

  // Create a map to store the estimated total distance for each node
  const estimatedTotalDistance = new Map();
  estimatedTotalDistance.set(start, manhattanDistance(start, end));

  // Create a priority queue to store the unvisited nodes, ordered by their estimated total distance
  const queue = new PriorityQueue({
    comparator: (a, b) => estimatedTotalDistance.get(a) - estimatedTotalDistance.get(b)
  });
  queue.enqueue(start);

  // While there are unvisited nodes
  while (!queue.isEmpty()) {
    // Get the unvisited node with the smallest estimated total distance
    const current = queue.dequeue();

    // If the current node is the end node, return the path
    if (current.x === end.x && current.y === end.y) {
      return getPath(previous, end);
    }

    // Mark the current node as visited
    visited.add(current);

    // Get the neighbors of the current node
    const neighbors = getNeighbors(grid, current);

    // For each neighbor of the current node
    for (const neighbor of neighbors) {
      // If the neighbor is not visited and is not blocked
      if (!visited.has(neighbor) && !isBlocked(grid, neighbor)) {
        // Update the distance from the start node for the neighbor
        const newDistance = distance.get(current) + 1;
        if (!distance.has(neighbor) || newDistance < distance.get(neighbor)) {
          distance.set(neighbor, newDistance);
        }

        // Update the previous node for the neighbor
        previous.set(neighbor, current
