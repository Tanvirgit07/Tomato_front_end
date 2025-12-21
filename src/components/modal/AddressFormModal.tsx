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
import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("@/components/map/CustomarMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full flex items-center justify-center text-gray-500">
      Loading map...
    </div>
  ),
});

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
    latitude: 23.8103,
    longitude: 90.4125,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    for (const key of ["fullName", "phone", "address", "city", "postalCode"]) {
      if (!formData[key as keyof typeof formData]) {
        toast.error(`Please enter ${key}`);
        setLoading(false);
        return;
      }
    }

    // ✅ THIS IS THE MAIN FIX
    const payload = {
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      location: {
        lat: formData.latitude,
        lng: formData.longitude,
      },
    };

    toast.success("Delivery info saved!");
    onSubmitSuccess(payload);
    onOpenChange(false);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Home Delivery Information</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <Input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
          <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          <Input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          <Input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
          <Input name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} />

          <div className="mt-4 h-64 rounded-lg overflow-hidden border">
            <DeliveryMap
              position={[formData.latitude, formData.longitude]}
              onMapClick={handleMapClick}
            />
          </div>

          <p className="text-xs text-gray-500">
            Selected Latitude: {formData.latitude.toFixed(5)}, Longitude:{" "}
            {formData.longitude.toFixed(5)}
          </p>

          <DialogFooter>
            <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500">
              {loading ? "Saving..." : "Save Info"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
