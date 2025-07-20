import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BackgroundGradientAnimation } from "@/components/Ui/background-gradient-animation";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: teamMember } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", user.id)
    .single();

  if (teamMember) {
    redirect("/dashboard");
  }

  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex items-center justify-center px-4">

        <div className="max-w-5xl w-full bg-white/20 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/30 ring-1 ring-white/10">
          
          <div className="bg-white/10 backdrop-blur-xl px-6 py-3 flex items-center justify-between border-b border-white/20 sm:px-8 md:px-12 sm:py-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500/90 rounded-full hover:bg-red-500 cursor-pointer transition-all duration-200 shadow-sm sm:w-3.5 sm:h-3.5"></div>
              <div className="w-3 h-3 bg-yellow-500/90 rounded-full hover:bg-yellow-500 cursor-pointer transition-all duration-200 shadow-sm sm:w-3.5 sm:h-3.5"></div>
              <div className="w-3 h-3 bg-green-500/90 rounded-full hover:bg-green-500 cursor-pointer transition-all duration-200 shadow-sm sm:w-3.5 sm:h-3.5"></div>
            </div>
            
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <span className="text-white/90 text-sm font-medium drop-shadow-sm sm:text-base">
                RAID × Product Club
              </span>
            </div>
            
            <div className="w-12 sm:w-16"></div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl px-6 py-8 pointer-events-auto sm:px-10 sm:py-12 lg:px-16 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              
              <div className="text-center lg:text-left space-y-6 sm:space-y-8">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl mx-auto lg:mx-0 flex items-center justify-center shadow-lg border border-white/30 sm:w-28 sm:h-28">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center sm:w-18 sm:h-18">
                    <span className="text-white text-2xl sm:text-3xl">🚀</span>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-2xl font-semibold text-gray-900 tracking-tight sm:text-3xl lg:text-4xl">
                    Ready to Compete?
                  </h1>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg max-w-md mx-auto lg:mx-0">
                    Join the ultimate product development challenge and showcase your innovative skills
                  </p>
                </div>
              </div>
              
              {/* Right Column: Actions & Prize */}
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <Link 
                    href="/create-team" 
                    className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center w-full sm:py-4 lg:py-5 lg:px-10"
                  >
                    Create Team
                  </Link>
                  
                  <Link 
                    href="/join-team" 
                    className="bg-white/70 hover:bg-white/90 backdrop-blur-sm text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-gray-300/50 hover:border-gray-400/50 shadow-sm hover:shadow-md text-center w-full sm:py-4 lg:py-5 lg:px-10"
                  >
                    Join Team
                  </Link>
                </div>
                
                {/* Prize Information */}
                <div className="bg-gradient-to-r from-amber-100/70 to-orange-100/70 backdrop-blur-sm border border-amber-300/50 rounded-xl p-6 text-center sm:p-8">
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <span className="text-3xl sm:text-4xl">🏆</span>
                    <div>
                      <p className="text-amber-900 font-bold text-xl sm:text-2xl">₹50,000</p>
                      <p className="text-amber-800/80 text-sm sm:text-base lg:text-lg">Total Prize Pool</p>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
