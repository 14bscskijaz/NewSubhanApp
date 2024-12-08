"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
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
import { Route, addRoute } from "@/lib/slices/route-slices";
import { createRoute } from "@/app/actions/route.action";

export default function NewRouteDialog() {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("");
  const [sourceStation, setSourceStation] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationStation, setDestinationStation] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newRoute:Omit<Route,"id"> = {
      sourceCity:source,
      sourceAdda:sourceStation,
      destinationCity:destination,
      destinationAdda:destinationStation,
    };
    // await createRoute(newRoute)
    dispatch(addRoute(newRoute));
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSource("");
    setSourceStation("");
    setDestination("");
    setDestinationStation("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Route
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[500px] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit}>
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
                value={source}
                onChange={(e) => setSource(e.target.value)}
                maxLength={32}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sourceStation">Source Station</Label>
              <Input
                id="sourceStation"
                placeholder="Enter source station"
                value={sourceStation}
                onChange={(e) => setSourceStation(e.target.value)}
                maxLength={32}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                maxLength={32}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destinationStation">Destination Station</Label>
              <Input
                id="destinationStation"
                placeholder="Enter destination station"
                value={destinationStation}
                onChange={(e) => setDestinationStation(e.target.value)}
                maxLength={32}
              />
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
