# Node Hierarchy Analyzer (Full Stack Project)

## Overview

Node Hierarchy Analyzer is a full-stack application that processes hierarchical node relationships and generates structured insights. It validates input, constructs tree structures, detects cycles, computes depth, and provides summary metrics.

The system is designed to handle multiple independent graphs, invalid inputs, duplicate edges, and complex hierarchical relationships efficiently.

---

## Live Deployment

### Backend API (Render)
https://shashikumar-ezhilarasu-bfhl.onrender.com

**Endpoint**
`POST /bfhl`

### Frontend (Vercel)
https://node-hierarchy-analyzer-frontend.vercel.app/

---

## Repositories

### Backend Repository (Current)
https://github.com/Shashikumar-ezhilarasu/Node-Hierarchy-Analyzer--backend

### Frontend Repository
https://github.com/Shashikumar-ezhilarasu/Node-Hierarchy-Analyzer-frontend

---

## System Architecture

The application follows a modular full-stack architecture with clear separation of concerns.

### Backend Architecture
Built with **Node.js** and **Express.js**, the backend follows a clean Service-Controller-Route design pattern:
- **Routes (`routes/bfhl.js`)**: Defines the HTTP endpoints and maps them to controllers.
- **Controllers (`controllers/bfhlController.js`)**: Orchestrates the data flow, manages the request/response cycle, and enforces strictly formatted JSON output.
- **Services (`services/graphService.js`)**: Houses the core graph theory algorithms. Handles adjacency list creation, multi-parent conflict resolution, Breadth-First / Depth-First traversal, and cycle detection logic.
- **Utils (`utils/validators.js`)**: Enforces input structure and validation cleanly before data hits the processing layer.

### Algorithmic Processing Flow & Rules
1. **Validation Pipeline**: 
   - Trims whitespace and strictly validates the `X->Y` pattern (single uppercase letters).
   - Rejects self-loops (e.g., `A->A`), multi-character nodes (`AB->C`), or malformed strings, routing them to an `invalid_entries` array.
2. **Duplicate Edge Handling**: 
   - Utilizes a `Set` to enforce $O(1)$ lookup times. First occurrences are used for tree construction, and later duplicates are pushed uniquely to `duplicate_edges`.
3. **Multi-Parent Resolution**: 
   - In diamond configurations (e.g., `A->D` and `B->D`), the system adopts a "First Parent Wins" protocol, discarding subsequent parental claims to enforce strict tree topology.
4. **Graph Construction & Roots**: 
   - Uses an adjacency list to map directed edges. 
   - A root is identified as any node possessing an in-degree of 0 (never appears as a child). If a graph component is a pure cycle (no root), the lexicographically smallest node is artificially chosen as the root.
5. **Cycle Detection**: 
   - Implemented via a DFS algorithm mapping the recursion stack to identify back-edges. Cyclic groups immediately return `has_cycle: true` with an empty tree `{}` and no depth.
6. **Depth Calculation**: 
   - Recursively counts the node levels across the longest root-to-leaf path. Non-cyclic trees omit the `has_cycle` key entirely, per specifications.

---

## Performance
The algorithms have been explicitly optimized to run in $O(V + E)$ time and space complexity using heavy object-mapping and Sets. The server processes graphs containing up to 50 nodes in typically under `10ms`, effortlessly passing the `< 3 seconds` baseline.

---

## Local Development Setup

To run the backend locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shashikumar-ezhilarasu/Node-Hierarchy-Analyzer--backend.git
   cd Node-Hierarchy-Analyzer--backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

The backend server will natively initialize on `http://localhost:3001` to prevent port conflicts with typical frontend dev servers on port `3000`.
