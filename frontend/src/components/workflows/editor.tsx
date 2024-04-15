import 'reactflow/dist/style.css';

import { useEffect, useMemo } from 'react';
import ReactFlow, { Background, BackgroundVariant, Controls } from 'reactflow';

import WorkflowNode from '@/components/nodes/node';
import { useEditorStore } from '@/stores/editor';
import { AddTriggerNode } from '@/components/nodes/add-trigger-node';
import { getProcessedNodes, getProcessedEdges } from '@/utils/editor';

export default function WorkflowEditor({
  hazelWorkflow,
}: {
  hazelWorkflow: HazelWorkflow;
}) {
  // Registering custom node types
  const nodeTypes = useMemo(
    () => ({
      workflowNode: WorkflowNode,
      setTriggerButton: AddTriggerNode,
    }),
    [],
  );

  const editorStore = useEditorStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
  }));

  useEffect(() => {
    const processedNodes = getProcessedNodes(hazelWorkflow);
    editorStore.setNodes(processedNodes);
    editorStore.setEdges(getProcessedEdges(processedNodes));
  }, [hazelWorkflow.nodes]);

  return (
    <ReactFlow
      className="h-full w-full"
      nodes={editorStore.nodes}
      edges={editorStore.edges}
      onNodesChange={editorStore.onNodesChange}
      onEdgesChange={editorStore.onEdgesChange}
      nodeTypes={nodeTypes}
    >
      <Controls position={'top-right'} />
      <Background
        className="bg-zinc-50"
        variant={BackgroundVariant.Dots}
        gap={18}
        size={1}
      />
    </ReactFlow>
  );
}
