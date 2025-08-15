import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HowItWorksDialogProps {
  trigger: React.ReactNode;
}

export const HowItWorksDialog: React.FC<HowItWorksDialogProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How It Works</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {/* Content would go here */}
          <p>How It Works content will be placed here.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
