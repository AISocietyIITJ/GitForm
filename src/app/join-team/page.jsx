import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import JoinTeamForm from "@/components/Dashboard/JoinTeamForm";
import { HeroHighlight } from "@/components/ui/hero-highlight";

export default async function JoinTeamPage() {
  const supabase = await createClient();

  // 1. Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  // 2. Check if the user is already on a team. If so, redirect to dashboard.
  const { data: existingMember, error: memberError } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", user.id)
    .single();

  if (existingMember) {
    return redirect("/dashboard");
  }

  // 3. Fetch all teams so the user can choose one to join
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("id, team_name")
    .order("team_name", { ascending: true });

  if (teamsError) {
    return <p className="p-4 text-red-500">Error loading teams.</p>;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <HeroHighlight
              containerClassName="flex-1 flex items-center justify-center"
              className="flex flex-col items-center justify-center px-4"
            >
      <div className="w-full max-w-2xl lg:max-w-2xl bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">  
      <JoinTeamForm teams={teams} userId={user.id} />
      </div>
      </HeroHighlight>
    </div>
  );
}