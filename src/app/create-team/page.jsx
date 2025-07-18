import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import CreateTeamForm from "@/components/Dashboard/CreateTeamForm";

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
    <div className="h-screen flex flex-col">
      <Navbar />
      <CreateTeamForm />
    </div>
  );
}