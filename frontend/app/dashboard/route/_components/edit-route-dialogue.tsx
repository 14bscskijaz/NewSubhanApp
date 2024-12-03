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
            {/* Source City */}
            <div className="grid gap-2">
              <Label htmlFor="sourceCity" className="text-gradient">
                Source City
              </Label>
              <Input
                id="sourceCity"
                value={formData.sourceCity || ""}
                onChange={handleInputChange}
                placeholder="Enter source city"
              />
            </div>

            {/* Source Adda */}
            <div className="grid gap-2">
              <Label htmlFor="sourceAdda" className="text-gradient">
                Source Adda
              </Label>
              <Input
                id="sourceAdda"
                value={formData.sourceAdda || ""}
                onChange={handleInputChange}
                placeholder="Enter source adda"
              />
            </div>

            {/* Destination City */}
            <div className="grid gap-2">
              <Label htmlFor="destinationCity" className="text-gradient">
                Destination City
              </Label>
              <Input
                id="destinationCity"
                value={formData.destinationCity || ""}
                onChange={handleInputChange}
                placeholder="Enter destination city"
              />
            </div>

            {/* Destination Adda */}
            <div className="grid gap-2">
              <Label htmlFor="destinationAdda" className="text-gradient">
                Destination Adda
              </Label>
              <Input
                id="destinationAdda"
                value={formData.destinationAdda || ""}
                onChange={handleInputChange}
                placeholder="Enter destination adda"
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
