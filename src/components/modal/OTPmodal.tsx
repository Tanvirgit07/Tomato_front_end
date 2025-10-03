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
import { toast } from "sonner";

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | null;
  onSuccess?: () => void;
}

export default function OtpDialog({ open, onOpenChange, orderId, onSuccess }: OtpDialogProps) {
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async () => {
    if (!orderId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, otp }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Order confirmed successfully!");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("OTP verification failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full text-center rounded"
            maxLength={6}
          />
        </div>
        <DialogFooter className="mt-4 flex flex-col gap-2">
          <Button
            onClick={handleVerifyOTP}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white"
          >
            Verify OTP
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
