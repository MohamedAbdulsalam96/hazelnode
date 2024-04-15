import type { Edge, Node } from 'reactflow';

export function getProcessedNodes(hazelWorkflow: HazelWorkflow): Array<Node> {
  const processedNodes: Array<Node<HazelNode | null>> = [];

  let currentY = 100;
  const stepY = 120;
  const centerX = 300;

  for (const node of hazelWorkflow.nodes || []) {
    processedNodes.push({
      id: node.name,
      position: { x: centerX, y: currentY },
      data: { ...node },
      type: 'workflowNode',
      focusable: true,
      draggable: false,
      // deletable: false, TODO: Enable when we are handling this!
    });

    // layout vertically
    currentY += stepY;
  }

  // To allow user to set a trigger if not already done
  if (!hazelWorkflow.trigger_type) {
    processedNodes.push({
      id: 'set-trigger',
      position: { x: centerX, y: currentY },
      data: null,
      type: 'setTriggerButton',
      draggable: false,
      focusable: true,
    });
  }

  return processedNodes;
}


export function getProcessedEdges(processedNodes: Array<Node>): Array<Edge> {
    const processedEdges: Array<Edge> = [];

    // connect 1 with 2, 2 with 3, 3 with 4, etc.
    for (let i = 0; i < processedNodes.length - 1; i++) {
      processedEdges.push({
        id: `${processedNodes[i].id}-${processedNodes[i + 1].id}`,
        source: processedNodes[i].id,
        target: processedNodes[i + 1].id,
        deletable: false,
      });
    }

    return processedEdges;
  }
