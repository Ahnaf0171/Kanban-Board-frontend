import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/atoms/Dialog";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  dismissible?: boolean;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  dismissible = true,
}: ModalProps) {
  const handleOpenChange = (
    isOpen: boolean,
    eventDetails?: { reason?: string },
  ) => {
    if (!dismissible && !isOpen) {
      const blockedReasons = ["outside-press", "escape-key"];
      if (blockedReasons.includes(eventDetails?.reason ?? "")) return;
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
