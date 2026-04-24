const graphService = require('../services/graphService');
const validators = require('../utils/validators');

const processGraphData = (req, res) => {
  try {
    const bodyData = req.body;
    
    // Check if body is valid
    if (!bodyData || !bodyData.data || !Array.isArray(bodyData.data)) {
      return res.status(400).json({ 
        is_success: false,
        error: "Missing or invalid 'data' array in request body" 
      });
    }
    
    const inputData = bodyData.data;
    
    // Step 1: Validation and duplicate extraction
    const validationResult = validators.validateEdges(inputData);
    const validEdges = validationResult.valid;
    const invalidEntries = validationResult.invalid;
    
    // Step 2: Extract unique edges and duplicates
    const uniqueResult = graphService.extractUniqueEdges(validEdges);
    const uniqueEdges = uniqueResult.unique;
    const duplicateEdges = uniqueResult.duplicates;
    
    // Step 3: Build the graph structure
    const graphStructure = graphService.buildAdjacencyList(uniqueEdges);
    const graph = graphStructure.graph;
    const allNodes = graphStructure.allNodes;
    const childNodes = graphStructure.childNodes;
    
    // Step 4: Group into connected components (forest)
    const components = graphService.findConnectedComponents(graph, allNodes);
    
    // Step 5: Process each component to find roots, cycles, and build trees
    const hierarchies = [];
    let totalCycles = 0;
    let totalTrees = 0;
    let largestTreeDepth = -1;
    let largestTreeRoot = "";
    
    // process each independent graph component
    components.forEach(compNodes => {
      // Find roots for this component
      let roots = graphService.findRoots(compNodes, childNodes);
      
      // If no roots exist in this component, it must be a pure cycle
      // We pick the lexicographically smallest node as an arbitrary root
      if (roots.length === 0) {
        compNodes.sort();
        roots = [compNodes[0]];
      }
      
      // Check each root
      roots.forEach(root => {
        // cycle detection with recursion stack
        const cycleFound = graphService.hasCycle(graph, root);
        
        if (cycleFound) {
          totalCycles++;
          hierarchies.push({
            root: root,
            tree: {},
            has_cycle: true
          });
        } else {
          // No cycle, build the actual tree object
          totalTrees++;
          const tree = graphService.buildTree(graph, root);
          const depth = graphService.calculateDepth(tree);
          
          hierarchies.push({
            root: root,
            tree: tree,
            depth: depth
          });
          
          // track largest tree
          if (depth > largestTreeDepth) {
            largestTreeDepth = depth;
            largestTreeRoot = root;
          } else if (depth === largestTreeDepth) {
            if (root < largestTreeRoot || largestTreeRoot === "") {
              largestTreeRoot = root;
            }
          }
        }
      });
    });
    
    // Construct final response
    const responsePayload = {
      is_success: true,
      user_id: "shashikumar_ezhilarasu_15082001",
      email_id: "shashikumarezhilarasu@gmail.com",
      college_roll_number: "RA2311003020094",
      hierarchies: hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: {
        total_trees: totalTrees,
        total_cycles: totalCycles,
        largest_tree_root: largestTreeRoot || ""
      }
    };
    
    return res.status(200).json(responsePayload);
    
  } catch (err) {
    console.error("Error processing graph data:", err);
    return res.status(500).json({
      is_success: false,
      error: "Internal Server Error during graph processing"
    });
  }
};

module.exports = {
  processGraphData
};
