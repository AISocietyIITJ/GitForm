import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import  { HeroHighlight } from "@/components/Ui/hero-highlight";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user){
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .single();

    if (teamMember) {
      redirect("/dashboard");
    }
  }

  return (
     <div className="min-h-screen bg-black">
      <HeroHighlight
        containerClassName="h-screen lg:h-screen md:h-auto"
        className="flex flex-col items-center justify-center space-y-6 lg:space-y-8 px-4"
      >
        {/* Main Hero Section */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          {/* Call to Action Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white ">
            Join the{' '}
            <div className="inline-block px-3 py-1 lg:px-4 lg:py-2 font-black text-white">
              Gen AI Product
            </div>
            <br />
            <div className="inline-block px-3 py-1 lg:px-4 lg:py-2 font-black text-white rounded-md bg-[#6816D6] mt-2">
              Hackathon
            </div>
          </h1>
          
          {/* Subheading */}
          <div className="space-y-3">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed">
              <span className="text-white font-semibold">RAID X Product Club IIT Jodhpur</span>
              <br />
              <span className="font-medium">Partnership with Pathway - Pioneers of Live AI</span>
            </p>
            
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
<Link 
  href="/create-team" 
  className="group px-8 py-4 bg-purple-600 text-white font-bold text-xl rounded-full transition-all duration-500 min-w-[200px] backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:text-black"
>
  <span className="relative z-10">Create Team</span>
</Link>


<Link 
  href="/join-team" 
  className="group px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-bold text-xl rounded-full transition-all duration-500 min-w-[200px] flex items-center justify-center hover:bg-white hover:text-black"
>
  <span className="relative z-10">Join Team</span>
</Link>

</div>


        {/* Event Details */}
        <div className="text-center space-y-2">
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Registration Open</span>
            </div>
            <div>📅 July 25-27, 2025</div>
            <div className="text-green-400 font-semibold">🏆 ₹50,000+ Prizes</div>
            <div>👥 Limited Slots</div>
          </div>
        </div>

      </HeroHighlight>
    </div>
  );
}
