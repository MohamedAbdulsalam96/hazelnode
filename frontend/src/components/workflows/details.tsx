import { toast } from 'sonner';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useConfirm } from '@/hooks/confirm';
import { useDocType } from '@/queries/frappe';
import { useNavigate } from '@tanstack/react-router';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { Route as WorkflowDetailsRoute } from '@/routes/workflow.$id';

import WorkflowEditor from './editor';
import SetTriggerDialog from '@/components/workflows/set-trigger-dialog';

export function WorkflowDetails() {
  const params = WorkflowDetailsRoute.useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { useSuspenseDoc, useDeleteDocMutation } =
    useDocType<HazelWorkflow>('Hazel Workflow');
  const workflowDoc = useSuspenseDoc(params.id);
  const deleteWorkflowMutation = useDeleteDocMutation();

  const [updateTriggerDialogOpen, setUpdateTriggerDialogOpen] = useState(false);

  async function handleDeleteWorkflow() {
    const deleteConfirmed = await confirm({
      title: 'Delete Workflow',
      description: 'Are you sure?',
      actionType: 'danger',
    });

    if (!deleteConfirmed) {
      return;
    }

    deleteWorkflowMutation.mutate(
      {
        name: params.id,
      },
      {
        onSuccess: () => {
          navigate({
            to: '/',
          });
          toast.success('🗑️ Workflow deleted!');
        },
      },
    );
  }

  return (
    <>
      <div className="h-full w-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={80}>
            <WorkflowEditor hazelWorkflow={workflowDoc.data} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20}>
            <strong>{workflowDoc.data.title}</strong>

            <ul>
              {workflowDoc.data.trigger_type && (
                <li>
                  Trigger: {workflowDoc.data.trigger_type}
                  <Button
                    onClick={() => setUpdateTriggerDialogOpen(true)}
                    outline={true}
                  >
                    Change
                  </Button>
                </li>
              )}
            </ul>

            <SetTriggerDialog
              open={updateTriggerDialogOpen}
              onClose={setUpdateTriggerDialogOpen}
            />

            <Button color="rose" onClick={handleDeleteWorkflow}>
              Delete Workflow
            </Button>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
