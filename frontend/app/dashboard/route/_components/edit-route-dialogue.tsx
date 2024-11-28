import { useState, useEffect } from "react";
import { Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Route } from "@/lib/slices/route-slices";

type EditRouteDialogProps = {
  route: Route;
  onUpdate: (updatedRoute: Route) => void;
};

export default function EditRouteDialog({
  route,
  onUpdate,
}: EditRouteDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Route>({
    ...route,
  });

  useEffect(() => {
    setFormData({
      ...route,
    });
  }, [route]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdate(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="my-2.5 mr-2 cursor-pointer">
          <Pen className="h-4 w-4" />
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[940px] max-h-[600px] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>
              Update the details of the route and click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4 md:grid-cols-2">
            {/* Source */}
            <div className="grid gap-2">
              <Label htmlFor="source" className="text-gradient">
                Source
              </Label>
              <Input
                id="source"
                value={formData.source || ""}
                onChange={handleInputChange}
                placeholder="Enter source"
              />
            </div>

            {/* Source Station */}
            <div className="grid gap-2">
              <Label htmlFor="sourceStation" className="text-gradient">
                Source Station
              </Label>
              <Input
                id="sourceStation"
                value={formData.sourceStation || ""}
                onChange={handleInputChange}
                placeholder="Enter source station"
              />
            </div>

            {/* Destination */}
            <div className="grid gap-2">
              <Label htmlFor="destination" className="text-gradient">
                Destination
              </Label>
              <Input
                id="destination"
                value={formData.destination || ""}
                onChange={handleInputChange}
                placeholder="Enter destination"
              />
            </div>

            {/* Destination Station */}
            <div className="grid gap-2">
              <Label htmlFor="destinationStation" className="text-gradient">
                Destination Station
              </Label>
              <Input
                id="destinationStation"
                value={formData.destinationStation || ""}
                onChange={handleInputChange}
                placeholder="Enter destination station"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Route</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
