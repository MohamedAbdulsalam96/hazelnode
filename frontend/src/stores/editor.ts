import { create } from 'zustand';
import type { NodeChange, EdgeChange, Node, Edge } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { getProcessedEdges, getProcessedNodes } from '@/utils/editor';
import { EditorNodeData } from '@/components/nodes/node';

interface WorkflowEditorState {
  nodes: Array<Node>;
  edges: Array<Edge>;
  activeAction: Node | null;
  setNodes: (nodes: Array<Node>) => void;
  setEdges: (edges: Array<Edge>) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  syncWithWorkflowDoc: (workflowDoc: HazelWorkflow) => void;
  addNode: (node: EditorNodeData) => void;
  setActiveAction: (actionNode: Node) => void;
  removeNode: (index: number) => void;
  isFirstNode: () => boolean;
}

export const useEditorStore = create<WorkflowEditorState>()((set, get) => ({
  nodes: [],
  edges: [],
  activeAction: null,
  setActiveAction(actionNode: Node) {
    set({
      activeAction: actionNode,
    });
  },
  setNodes(nodes) {
    set({
      nodes,
    });
  },
  setEdges(edges) {
    set({
      edges,
    });
  },
  addNode(node: EditorNodeData) {
    // create an edge between the new node and the last one
    const currentState = get();
    const currentNodes = currentState.nodes;
    const currentEdges = currentState.edges;
    const isFirstNode = get().isFirstNode();

    const newNode: Node = {
      id: node.name,
      position: {x: 300, y: 100},
      data: {
        name: node.name,
        type: node.type,
        kind: node.kind,
      },
      type: 'workflowNode',
    };


    if (!isFirstNode) {
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
        edges: updatedEdges,
      });
      newNode.position.y = lastNode.position.y + 120;
    }

    set({
      nodes: [...currentNodes, newNode],
    });
  },
  isFirstNode() {
    return get().nodes.length === 0;
  },
  removeNode(index: number) {
    const currentNodes = get().nodes;
    currentNodes.splice(index, 1);

    set({
      nodes: [...currentNodes],
    });
  },
  onNodesChange(changes: NodeChange[]) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange(changes: EdgeChange[]) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  syncWithWorkflowDoc(workflowDoc: HazelWorkflow) {
    const nodes = getProcessedNodes(workflowDoc);
    const edges = getProcessedEdges(nodes);
    set({
      nodes,
      edges,
    });
  },
}));
