import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { useDocType } from '@/queries/frappe';
import WorkflowEditor from '@/components/workflows/editor';
import { Route as WorkflowDetailsRoute } from '@/routes/workflow.$id';
import { WorkflowConfigPanel } from '@/components/workflows/configPanel';

export function WorkflowDetails() {
  const params = WorkflowDetailsRoute.useParams();

  const { useSuspenseDoc } = useDocType<HazelWorkflow>('Hazel Workflow');
  const workflowDoc = useSuspenseDoc(params.id);

  return (
    <>
      <div className="h-full w-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={70}>
            <WorkflowEditor hazelWorkflow={workflowDoc.data} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30}>
            <WorkflowConfigPanel hazelWorkflow={workflowDoc.data} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
