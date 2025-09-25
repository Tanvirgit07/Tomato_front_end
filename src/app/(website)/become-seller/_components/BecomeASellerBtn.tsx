"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SellerRequestModal } from "@/components/modal/SellerRequestModal";

const BecomeASellerBtn = () => {
     const [open, setOpen] = useState(false);
  return (
    <>
      <div className="fixed right-6 bottom-6 z-50">
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 
                     text-white font-bold px-7 h-[50px] rounded-full shadow-xl hover:scale-105 
                     transition-transform duration-300 hover:shadow-2xl"
        >
          Become a Seller
          <ArrowRight className="w-5 h-5 animate-bounce" />
        </Button>
      </div>

      {/* Modal */}
      <SellerRequestModal open={open} setOpen={setOpen} />
    </>
  );
};

export default BecomeASellerBtn;
