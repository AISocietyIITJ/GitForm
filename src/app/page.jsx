import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
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

  if (teamMember) {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to GitForm</h1>
      <div className="space-x-4">
        <Link href="/create-team" className="text-blue-600 underline">Create Team</Link>
        <Link href="/join-team" className="text-blue-600 underline">Join Team</Link>
      </div>
    </div>
  );
}
