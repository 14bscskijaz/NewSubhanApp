"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Route, setRoute } from "@/lib/slices/route-slices";
import { createRoute, getAllRoutes } from "@/app/actions/route.action";
import { useToast } from "@/hooks/use-toast";

const newRouteSchema = z.object({
  source: z.string().nonempty("Source is required").max(32, "Maximum 32 characters"),
  sourceStation: z.string().nonempty("Source Station is required").max(32, "Maximum 32 characters"),
  destination: z.string().nonempty("Destination is required").max(32, "Maximum 32 characters"),
  destinationStation: z.string().nonempty("Destination Station is required").max(32, "Maximum 32 characters"),
});

type NewRouteFormValues = z.infer<typeof newRouteSchema>;

export default function NewRouteDialog() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewRouteFormValues>({
    resolver: zodResolver(newRouteSchema),
    defaultValues: {
      source: "",
      sourceStation: "",
      destination: "",
      destinationStation: "",
    },
  });

  const onSubmit = async (data: NewRouteFormValues) => {
    try {
      const newRoute: Omit<Route, "id"> = {
        sourceCity: data.source,
        sourceAdda: data.sourceStation,
        destinationCity: data.destination,
        destinationAdda: data.destinationStation,
      };

      await createRoute(newRoute);
      const getRoutes = await getAllRoutes();
      dispatch(setRoute(getRoutes));

      toast({
        title: "Success",
        description: "Route added successfully",
        variant: "default",
        duration: 1000,
      });

      setOpen(false);
      reset();
    } catch (error: any) {
      console.error(error.message);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Route
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[500px] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              Add New <span className="text-gradient">Route</span>
            </DialogTitle>
            <DialogDescription>
              Enter the details of the new route here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="source" className="text-gradient">Source</Label>
              <Input
                id="source"
                placeholder="Enter source"
                {...register("source")}
              />
              {errors.source && (
                <p className="text-red-500 text-sm">{errors.source.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sourceStation">Source Station</Label>
              <Input
                id="sourceStation"
                placeholder="Enter source station"
                {...register("sourceStation")}
              />
              {errors.sourceStation && (
                <p className="text-red-500 text-sm">
                  {errors.sourceStation.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="Enter destination"
                {...register("destination")}
              />
              {errors.destination && (
                <p className="text-red-500 text-sm">
                  {errors.destination.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destinationStation">Destination Station</Label>
              <Input
                id="destinationStation"
                placeholder="Enter destination station"
                {...register("destinationStation")}
              />
              {errors.destinationStation && (
                <p className="text-red-500 text-sm">
                  {errors.destinationStation.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Route</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
