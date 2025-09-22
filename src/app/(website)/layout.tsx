import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="mt-[90px]">{children}</div>
      <Footer />
    </div>
  );
}

export default layout;
