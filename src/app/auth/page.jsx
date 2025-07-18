import Authform from "@/components/Login/Authform";
import React from "react";

const Page = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-full max-w-sm border border-gray-200 rounded-lg p-8">
        {/* Logo on Top */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.svg" // Replace with your actual logo path
            alt="Company Logo"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Auth Form below */}
        <Authform />
      </div>
    </div>
  );
};

export default Page;
