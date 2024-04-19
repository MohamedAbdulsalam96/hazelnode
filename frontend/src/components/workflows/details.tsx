import { toast } from 'sonner';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useConfirm } from '@/hooks/confirm';
import { useDocType } from '@/queries/frappe';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from '@tanstack/react-router';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { Route as WorkflowDetailsRoute } from '@/routes/workflow.$id';

import WorkflowEditor from './editor';
import SetTriggerDialog from '@/components/workflows/set-trigger-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';

interface TriggerConfig {
  [index: string]: string | undefined;
}

export function WorkflowDetails() {
  const params = WorkflowDetailsRoute.useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { useSuspenseDoc, useDeleteDocMutation, useSetValueMutation } =
    useDocType<HazelWorkflow>('Hazel Workflow');

  const workflowDoc = useSuspenseDoc(params.id);
  const deleteWorkflowMutation = useDeleteDocMutation();
  const setValueWorkflowMutation = useSetValueMutation();

  const { useDoc, useList } = useDocType<HazelNodeType>('Hazel Node Type');
  const actionsList = useList({
    fields: ['name', 'description'],
    filters: {
      kind: 'Action',
    },
  });

  const triggerDoc = useDoc(workflowDoc.data?.trigger_type || '');

  const [updateTriggerDialogOpen, setUpdateTriggerDialogOpen] = useState(false);

  const [triggerFormState, setTriggerFormState] = useState<TriggerConfig>({});

  useEffect(() => {
    const initTriggerFormState: TriggerConfig = {};

    const initConfig = JSON.parse(workflowDoc.data.trigger_config);

    if (triggerDoc.data) {
      for (const param of triggerDoc.data?.params || []) {
        initTriggerFormState[param.fieldname] = initConfig[param.fieldname];
      }
    }
    setTriggerFormState(initTriggerFormState);
  }, [triggerDoc.data]);

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

  async function handleSaveWorkflow() {
    const triggerConfig = JSON.stringify(triggerFormState);

    setValueWorkflowMutation.mutate(
      {
        name: workflowDoc.data.name.toString(),
        values: {
          trigger_config: triggerConfig,
        },
      },
      {
        onSuccess() {
          toast.success('Workflow Saved!');
        },
      },
    );
  }

  return (
    <>
      <div className="h-full w-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={70}>
            <WorkflowEditor hazelWorkflow={workflowDoc.data} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          {/* Sidebar */}
          <ResizablePanel defaultSize={30}>
            <ScrollArea className="h-full p-3">
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

              {(triggerDoc.data?.params || []).map((param) => {
                return (
                  <div>
                    <Label htmlFor={param.fieldname}>{param.label}</Label>
                    <Input
                      value={triggerFormState[param.fieldname]}
                      onChange={(v) =>
                        setTriggerFormState({
                          ...triggerFormState,
                          [param.fieldname]: v.target.value,
                        })
                      }
                      type="text"
                      name={param.fieldname}
                    />
                  </div>
                );
              })}

              <SetTriggerDialog
                open={updateTriggerDialogOpen}
                onClose={setUpdateTriggerDialogOpen}
              />

              <Button color="white" onClick={handleSaveWorkflow}>
                Save
              </Button>

              <br />
              <Button color="rose" onClick={handleDeleteWorkflow}>
                Delete Workflow
              </Button>

              <h2 className=" mt-4 text-xl font-bold text-gray-900">Actions</h2>
              <div className="mt-1 flex flex-col gap-2">
                {actionsList.data?.map((node) => {
                  return <Button color="yellow">{node.name}</Button>;
                })}
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
