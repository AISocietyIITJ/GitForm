import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import CreateTeamForm from "@/components/Dashboard/CreateTeamForm";
import { HeroHighlight } from "@/components/Ui/hero-highlight";

export default async function JoinTeamPage() {
const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  const { data: teamMember } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", user.id)
    .single();

  if (teamMember) {
    redirect("/dashboard");
    return;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar className="bg-transparent" />
      
      <HeroHighlight
        containerClassName="flex-1 flex items-center justify-center"
        className="flex flex-col items-center justify-center px-4"
      >
        <div className="w-full max-w-2xl lg:max-w-2xl bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">          
          <CreateTeamForm />
        </div>
      </HeroHighlight>
    </div>
  );
}