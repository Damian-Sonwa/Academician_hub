import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface MaterialViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fileUrl: string;
  fileType: string;
}

export default function MaterialViewer({
  open,
  onOpenChange,
  title,
  fileUrl,
  fileType,
}: MaterialViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {fileType === "MP4" ? (
            <video
              controls
              className="w-full h-full"
              src={fileUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              src={fileUrl}
              className="w-full h-full"
              title={title}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
