/**
 * Service to handle all graph-related operations
 */

function extractUniqueEdges(edges) {
  const seen = new Set();
  const unique = [];
  const duplicates = [];
  
  for(let i = 0; i < edges.length; i++){
    const edge = edges[i];
    
    if(seen.has(edge)) {
      // tracking duplicates but only adding to list once
      if(!duplicates.includes(edge)) {
        duplicates.push(edge);
      }
    } else {
      seen.add(edge);
      unique.push(edge);
    }
  }
  
  return { unique, duplicates };
}

function buildAdjacencyList(edges) {
  const graph = {};
  const childNodes = new Set();
  const allNodes = new Set();
  
  // Also track incoming edges to handle multi-parent (first parent wins)
  const nodeParents = {};
  
  edges.forEach(edge => {
    const parts = edge.split('->');
    const parent = parts[0];
    const child = parts[1];
    
    allNodes.add(parent);
    allNodes.add(child);
    
    if (!graph[parent]) {
      graph[parent] = [];
    }
    
    if (!graph[child]) {
      graph[child] = []; // initialize leaves
    }
    
    // Multi-parent handling: "first parent wins, ignore later parent edges"
    if (!nodeParents[child]) {
      nodeParents[child] = parent;
      
      // Add child to parent's list only if it's the first parent
      graph[parent].push(child);
      childNodes.add(child);
    } else {
      // Child already has a parent, so we ignore this edge to strictly 
      // adhere to the "First parent wins" requirement
      // Not adding to graph[parent]
    }
  });
  
  return { graph, allNodes, childNodes };
}

// Group nodes into connected components to handle multiple disconnected graphs
function findConnectedComponents(graph, allNodesSet) {
  const components = [];
  const visitedGlobal = new Set();
  
  function dfsGroup(node, currentComp) {
    if (visitedGlobal.has(node)) return;
    
    visitedGlobal.add(node);
    currentComp.push(node);
    
    // go to children
    if (graph[node]) {
      graph[node].forEach(child => {
        dfsGroup(child, currentComp);
      });
    }
    
    // go to parents (undirected traversal for components)
    for (const p in graph) {
      if (graph[p].includes(node)) {
        dfsGroup(p, currentComp);
      }
    }
  }
  
  // Convert set to array for iteration
  const nodes = Array.from(allNodesSet);
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!visitedGlobal.has(node)) {
      const comp = [];
      dfsGroup(node, comp);
      components.push(comp);
    }
  }
  
  return components;
}

function findRoots(compNodes, childNodes) {
  const roots = [];
  
  // A root is a node that never appears as a child
  for (let i = 0; i < compNodes.length; i++) {
    const node = compNodes[i];
    if (!childNodes.has(node)) {
      roots.push(node);
    }
  }
  
  return roots;
}

function hasCycle(graph, startNode) {
  const visited = new Set();
  const recStack = new Set();
  
  function dfsCheck(node) {
    visited.add(node);
    recStack.add(node);
    
    if (graph[node]) {
      for (let i = 0; i < graph[node].length; i++) {
        const child = graph[node][i];
        
        if (!visited.has(child)) {
          if (dfsCheck(child)) {
            return true; // found cycle deeper down
          }
        } else if (recStack.has(child)) {
          // back edge!
          return true;
        }
      }
    }
    
    recStack.delete(node);
    return false;
  }
  
  return dfsCheck(startNode);
}

function buildTree(graph, rootNode) {
  // To protect against any weird edge cases or remaining cycle links
  const globalVisited = new Set();
  
  function recursiveBuild(node) {
    if (globalVisited.has(node)) {
      return null;
    }
    
    globalVisited.add(node);
    const nodeObj = {};
    
    if (graph[node] && graph[node].length > 0) {
      graph[node].forEach(child => {
        const childTree = recursiveBuild(child);
        if (childTree !== null) {
          nodeObj[child] = childTree;
        }
      });
    }
    
    return nodeObj;
  }
  
  return { [rootNode]: recursiveBuild(rootNode) };
}

function calculateDepthFixed(tree) {
  if (!tree || Object.keys(tree).length === 0) return 0;
  
  function getDepth(nodeObj) {
    if (typeof nodeObj !== 'object' || nodeObj === null) return 1;
    
    const children = Object.keys(nodeObj);
    if (children.length === 0) return 1;
    
    let maxChildDepth = 0;
    for (let i = 0; i < children.length; i++) {
      const childDepth = getDepth(nodeObj[children[i]]);
      if (childDepth > maxChildDepth) {
        maxChildDepth = childDepth;
      }
    }
    
    return 1 + maxChildDepth;
  }
  
  return getDepth(tree) - 1; 
}

module.exports = {
  extractUniqueEdges,
  buildAdjacencyList,
  findConnectedComponents,
  findRoots,
  hasCycle,
  buildTree,
  calculateDepth: calculateDepthFixed
};
