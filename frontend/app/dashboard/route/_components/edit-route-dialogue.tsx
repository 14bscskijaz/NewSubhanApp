import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Route } from "@/lib/slices/route-slices";

// Validation schema using Zod
const editRouteSchema = z.object({
  sourceCity: z.string().min(1, "Source City is required").max(32),
  sourceAdda: z.string().min(1, "Source Adda is required").max(32),
  destinationCity: z.string().min(1, "Destination City is required").max(32),
  destinationAdda: z.string().min(1, "Destination Adda is required").max(32),
});

type EditRouteFormData = z.infer<typeof editRouteSchema>;

type EditRouteDialogProps = {
  route: Route;
  onUpdate: (updatedRoute: Route) => void;
};

export default function EditRouteDialog({
  route,
  onUpdate,
}: EditRouteDialogProps) {
  const [open, setOpen] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditRouteFormData>({
    resolver: zodResolver(editRouteSchema),
    defaultValues: {
      sourceCity: route.sourceCity,
      sourceAdda: route.sourceAdda,
      destinationCity: route.destinationCity,
      destinationAdda: route.destinationAdda,
    },
  });

  // Handle form submission
  const onSubmit = (data: EditRouteFormData) => {
    onUpdate({ ...route, ...data });
    setOpen(false);
    reset(); // Reset the form after submission
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="my-2.5 mr-2 cursor-pointer">
          <Pen className="h-4 w-4" />
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[940px] max-h-[600px] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                placeholder="Enter source city"
                {...register("sourceCity")}
              />
              {errors.sourceCity && (
                <p className="text-red-500 text-sm">{errors.sourceCity.message}</p>
              )}
            </div>

            {/* Source Adda */}
            <div className="grid gap-2">
              <Label htmlFor="sourceAdda" className="text-gradient">
                Source Adda
              </Label>
              <Input
                id="sourceAdda"
                placeholder="Enter source adda"
                {...register("sourceAdda")}
              />
              {errors.sourceAdda && (
                <p className="text-red-500 text-sm">{errors.sourceAdda.message}</p>
              )}
            </div>

            {/* Destination City */}
            <div className="grid gap-2">
              <Label htmlFor="destinationCity" className="text-gradient">
                Destination City
              </Label>
              <Input
                id="destinationCity"
                placeholder="Enter destination city"
                {...register("destinationCity")}
              />
              {errors.destinationCity && (
                <p className="text-red-500 text-sm">{errors.destinationCity.message}</p>
              )}
            </div>

            {/* Destination Adda */}
            <div className="grid gap-2">
              <Label htmlFor="destinationAdda" className="text-gradient">
                Destination Adda
              </Label>
              <Input
                id="destinationAdda"
                placeholder="Enter destination adda"
                {...register("destinationAdda")}
              />
              {errors.destinationAdda && (
                <p className="text-red-500 text-sm">{errors.destinationAdda.message}</p>
              )}
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
