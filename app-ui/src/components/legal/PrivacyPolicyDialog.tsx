import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PrivacyPolicyDialogProps {
  trigger: React.ReactNode;
}

export const PrivacyPolicyDialog: React.FC<PrivacyPolicyDialogProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {/* Content would go here */}
          <p>Privacy Policy content will be placed here.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
