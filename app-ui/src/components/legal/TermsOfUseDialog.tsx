import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TermsOfUseDialogProps {
  trigger: React.ReactNode;
}

export const TermsOfUseDialog: React.FC<TermsOfUseDialogProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Use</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {/* Content would go here */}
          <p>Terms of Use content will be placed here.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
