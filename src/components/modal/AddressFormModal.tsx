/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface HomeDeliveryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess: (formData: any) => void;
}

export default function AddressFormModal({
  open,
  onOpenChange,
  onSubmitSuccess,
}: HomeDeliveryModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        toast.error(`Please enter ${key}`);
        setLoading(false);
        return;
      }
    }

    try {
      // You can send formData to backend here if needed
      // const res = await fetch("/api/delivery-info", { method: "POST", body: JSON.stringify(formData) });

      toast.success("Delivery info saved!");
      onSubmitSuccess(formData);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save delivery info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Home Delivery Information</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <Input
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          <Input
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Input
            placeholder="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <Input
            placeholder="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
          />

          <DialogFooter>
            <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-white">
              {loading ? "Saving..." : "Save Info"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
