import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { DocTypeQueryParams, useDocType } from '@/queries/frappe';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';

export function AddTriggerNode() {
  const [showDialog, setShowDialog] = useState(false);

  const { useList } = useDocType<HazelNodeType>('Hazel Node Type');
  const { useSetValueMutation } = useDocType<HazelWorkflow>('Hazel Workflow');

  const setValue = useSetValueMutation();

  function setTrigger(trigger: HazelNodeType) {
    setValue.mutate(
      {
        name: '26',
        values: {
          trigger_type: trigger.name,
        },
      },
      {
        onSuccess() {
          setShowDialog(false);
          toast.success("Trigger set successfully!")
        },
      },
    );
  }

  const triggerListParams: DocTypeQueryParams<HazelNodeType> = {
    filters: {
      kind: 'Trigger',
    },
    fields: ['name', 'description', 'preview_image'],
  };

  const triggerNodesList = useList(triggerListParams);

  if (triggerNodesList.isLoading) {
    return <Skeleton></Skeleton>;
  }

  if (triggerNodesList.isError) {
    return <div>Error occurred loading triggers!</div>;
  }

  return (
    <>
      <Button
        color="lime"
        className="cursor-default"
        onClick={() => setShowDialog(true)}
      >
        <div className="grid place-content-center py-2">
          <span>Set a trigger</span>
        </div>
      </Button>
      <Dialog open={showDialog} onClose={setShowDialog} size="3xl">
        <DialogTitle>Select a trigger</DialogTitle>
        <DialogDescription>
          The event that will trigger a run of this workflow
        </DialogDescription>
        <DialogBody>
          <ol>
            {triggerNodesList.data?.map((trigger) => {
              return (
                <li>
                  <Button onClick={() => setTrigger(trigger)} color="fuchsia">
                    {trigger.name}
                  </Button>
                </li>
              );
            })}
          </ol>
        </DialogBody>
      </Dialog>
    </>
  );
}
