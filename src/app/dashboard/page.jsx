import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateTeamForm from "@/components/Dashboard/CreateTeamForm";
import TeamView from "@/components/Dashboard/TeamView";
import Navbar from "@/components/Navbar/Navbar";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: teamMember } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", user.id)
    .single();

  if (!teamMember) {
    redirect("/");
  }

  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("*, members:team_members(*, profiles(*))") 
    .eq("id", teamMember.team_id)
    .single();

  if (teamError) {
    // console.log('team: null')
    // console.log('Error fetching team details:', teamError)
    return <div className="p-4 text-red-500">Error fetching team details. Could not load members.</div>;
  }

  const membersWithProfiles = team.members.map(member => member.profiles).filter(Boolean);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <TeamView team={team} members={membersWithProfiles} currentUserId={user.id} />
    </div>
  );
}
