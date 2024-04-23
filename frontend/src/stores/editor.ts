import { create } from 'zustand';

import type { NodeChange, EdgeChange, Node, Edge } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { EditorNodeData } from '@/components/nodes/node';

interface WorkflowEditorState {
  flowNodes: Array<Node>;
  flowEdges: Array<Edge>;
  activeWorkflow: HazelWorkflow | null;
  selectedNode: Node | null;
}

interface WorkflowEditorActions {
  setFlowNodes: (nodes: Array<Node>) => void;
  setFlowEdges: (edges: Array<Edge>) => void;
  onFlowNodesChange: (changes: NodeChange[]) => void;
  onFlowEdgesChange: (changes: EdgeChange[]) => void;
  isFlowEmpty: () => boolean;
  setSelectedNode: (node: Node | null) => void;
  removeNode: (index: number) => void;
  appendNode: (node: EditorNodeData) => void;
  resetFlows: () => void;
}

const initialState: WorkflowEditorState = {
  flowNodes: [],
  flowEdges: [],
  activeWorkflow: null,
  selectedNode: null,
};

export const useEditorStore = create<
  WorkflowEditorState & WorkflowEditorActions
>()((set, get) => ({
  ...initialState,
  resetFlows() {
    set({
      flowNodes: [],
      flowEdges: [],
      selectedNode: null
    });
  },
  setFlowNodes(nodes) {
    set({
      flowNodes: nodes,
    });
  },
  setFlowEdges(edges) {
    set({
      flowEdges: edges,
    });
  },
  onFlowNodesChange(changes) {
    set({
      flowNodes: applyNodeChanges(changes, get().flowNodes),
    });
  },
  onFlowEdgesChange(changes) {
    set({
      flowEdges: applyEdgeChanges(changes, get().flowEdges),
    });
  },
  isFlowEmpty() {
    return get().flowNodes.length === 0;
  },
  setSelectedNode(node) {
    set({
      selectedNode: node,
    });
  },
  removeNode(index) {
    const currentNodes = get().flowNodes;
    currentNodes.splice(index, 1);

    set({
      flowNodes: [...currentNodes],
    });
  },
  appendNode(node) {
    const currentState = get();
    const currentNodes = currentState.flowNodes;
    const currentEdges = currentState.flowEdges;

    const newNode: Node = {
      id: node.name,
      position: { x: 300, y: 100 },
      data: {
        name: node.name,
        type: node.type,
        kind: node.kind,
      },
      type: 'workflowNode',
    };

    if (!get().isFlowEmpty()) {
      // connect to the already existing last one
      const lastNode = currentNodes[currentNodes.length - 1];
      const newEdge = {
        id: `${lastNode.id}-${newNode.id}`,
        source: lastNode.id,
        target: newNode.id,
        deletable: false,
      };

      const updatedEdges = [...currentEdges, newEdge];
      set({
        flowEdges: updatedEdges,
      });
      newNode.position.y = lastNode.position.y + 120;
    }

    set({
      flowNodes: [...currentNodes, newNode],
    });
  },
}));
