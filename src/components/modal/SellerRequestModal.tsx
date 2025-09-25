"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BecomeSellerForm } from "@/app/(website)/become-seller/_components/BecomeSellerForm";

// Modal component
export const SellerRequestModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
            Become a Seller
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 text-lg sm:text-xl text-center">
            Fill out the form below to start your seller journey and showcase
            your products to millions of customers.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <BecomeSellerForm />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
