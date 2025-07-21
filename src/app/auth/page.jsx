import Authform from "@/components/Login/Authform";
import React from "react";
import { HeroHighlight } from "@/components/Ui/hero-highlight";

const Page = () => {
  return (
    <div className="min-h-screen bg-black">
      <HeroHighlight
        containerClassName="h-screen lg:h-screen md:h-auto"
        className="flex flex-col items-center justify-center px-4"
      >
        {/* Login Card */}
        <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6 space-y-3">
            {/* Main Organizers - RAID X Product Club */}
            <div className="flex items-center justify-center space-x-4">
              <img
                src="/raid.png"
                alt="RAID Logo"
                className="w-20 h-20 object-contain"
              />
              <div className="text-purple-400 text-lg font-bold">×</div>
              <img
                src="/raid.png"
                alt="Product Club Logo"
                className="w-20 h-20 object-contain"
              />
            </div>
            
            {/* Sponsor Section */}
            <div className="border-t border-white/10 pt-2 w-full">
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">Sponsored by</p>
                <img
                  src="/pathway.png"
                  alt="Pathway Logo"
                  className="w-32 h-16 object-contain mx-auto"
                />
              </div>
            </div>
          </div>
          
          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300 text-sm">Sign in to continue with registration</p>
          </div>
          
          {/* Auth Form */}
          <Authform />
        </div>

        {/* Event branding footer */}
        {/* <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            <span className="text-purple-400 font-semibold">Gen AI Product Hackathon</span>
            <br />
            RAID X Product Club IIT Jodhpur
            <br />
            <span className="text-xs text-gray-500">Sponsored by Pathway</span>
          </p>
        </div> */}
      </HeroHighlight>
    </div>
  );
};

export default Page;
