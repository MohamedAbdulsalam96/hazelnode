import { Handle, NodeProps, Position, useOnSelectionChange } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useEditorStore } from '@/stores/editor';

export interface EditorNodeData {
  kind?: 'Action' | 'Trigger',
  name: string,
  type: string
}

export default function WorkflowNode({ data, selected }: NodeProps<EditorNodeData>) {
  const editorStore = useEditorStore((state) => ({
    setSelectedNode: state.setSelectedNode
  }));

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      for (const node of nodes) {
        if (node.id === data.name && data.kind === "Action") {
          // do something when a node is selected
          editorStore.setSelectedNode(node)
        }
      }
    },
  });

  return (
    <>
      <Card
        className={selected ? 'border-2 border-lime-400/80' : ''}
        style={{ minWidth: '24rem' }}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {data.type}
              <Badge
                className="ml-2"
                color={data.kind == 'Trigger' ? 'lime' : 'zinc'}
              >
                {data.kind}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </>
  );
}
