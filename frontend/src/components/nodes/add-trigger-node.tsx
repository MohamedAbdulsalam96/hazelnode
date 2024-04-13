import { useState } from 'react';

import { Button } from '@/components/ui/button';
import SetTriggerDialog from '@/components/workflows/set-trigger-dialog';

export function AddTriggerNode() {
  const [showDialog, setShowDialog] = useState(false);

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

      <SetTriggerDialog open={showDialog} onClose={setShowDialog} />
    </>
  );
}
