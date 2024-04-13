import { toast } from 'sonner';

import {
  Dialog,
  DialogDescription,
  DialogBody,
  DialogTitle,
} from '@/components/ui/dialog';
import { type DialogProps as HeadlessDialogProps } from '@headlessui/react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DocTypeQueryParams, useDocType } from '@/queries/frappe';

export default function SetTriggerDialog({
  open,
  onClose,
}: {
  open: boolean | undefined;
  onClose: (isOpen: boolean) => void;
} & HeadlessDialogProps) {
  const { useList } = useDocType<HazelNodeType>('Hazel Node Type');

  const triggerListParams: DocTypeQueryParams<HazelNodeType> = {
    filters: {
      kind: 'Trigger',
    },
    fields: ['name', 'description', 'preview_image'],
  };

  const triggerNodesList = useList(triggerListParams);

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
          onClose(false);
          toast.success('Trigger set successfully!');
        },
      },
    );
  }

  return (
    <Dialog open={open} onClose={onClose} size="3xl">
      <DialogTitle>Select a trigger</DialogTitle>
      <DialogDescription>
        The event that will trigger a run of this workflow
      </DialogDescription>

      <DialogBody>
        {triggerNodesList.isLoading && (
          <Skeleton className="h-12 w-full"></Skeleton>
        )}
        {triggerNodesList.isError && (
          <span>Error fetching list of triggers...</span>
        )}

        {!triggerNodesList.isError && triggerNodesList.data && (
          <ol className="flex flex-col gap-2">
            {triggerNodesList.data?.map((trigger) => {
              return (
                <li key={trigger.name}>
                  <Button onClick={() => setTrigger(trigger)} color="fuchsia">
                    {trigger.name}
                  </Button>
                </li>
              );
            })}
          </ol>
        )}
      </DialogBody>
    </Dialog>
  );
}
