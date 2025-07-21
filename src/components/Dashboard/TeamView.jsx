"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function TeamView({ team, members, currentUserId }) {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const isLeader = currentUserId === team.leader_id;

  const handleDeleteTeam = async () => {
    if (!confirm("Are you sure you want to delete this team? This action is irreversible.")) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error: rpcError } = await supabase.rpc("delete_team_and_members", {
        team_id_to_delete: team.id,
      });
      if (rpcError) throw rpcError;
      router.refresh();
    } catch (err) {
      console.error("Failed to delete team:", err.message);
      setError("Failed to delete team. Only the leader can perform this action.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(team.join_code);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000); // Reset message after 2 seconds
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  // --- NEW: Function to handle leaving the team ---
  const handleLeaveTeam = async () => {
    if (!confirm("Are you sure you want to leave this team?")) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      // The RLS policy ensures a user can only delete their own membership record.
      const { error: deleteError } = await supabase
        .from("team_members")
        .delete()
        .eq("user_id", currentUserId)
        .eq("team_id", team.id); // Match both user and team for precision

      if (deleteError) throw deleteError;
      
      // On success, refresh the page. The user will be shown the 'Create/Join' view.
      router.refresh();
      
    } catch (err) {
      console.error("Failed to leave team:", err.message);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // --- END NEW ---

  return (
    <div className="flex-grow flex items-center font-black justify-center bg-white px-4">
      <div className="w-full max-w-2xl border border-gray-200 rounded-lg p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{team.team_name}</h1>
            <p className="text-gray-500 mt-1">Welcome to your team dashboard.</p>
          </div>
          {isLeader && (
            <button
              onClick={handleDeleteTeam}
              disabled={loading}
              className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-400"
            >
              {loading ? "Deleting..." : "Delete Team"}
            </button>
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-600">Team Join Code</label>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-mono tracking-widest text-gray-800">
              {team.join_code}
            </p>
            <button
              onClick={handleCopyCode}
              className="bg-black text-white px-3 py-1 rounded-md text-sm hover:bg-neutral-800"
            >
              {copySuccess || 'Copy'}
            </button>
          </div>
        </div>

        {error && <div className="mt-4 text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Team Members ({members.length})</h2>
          <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Roll Number</th>
        <th>Role</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {members.map((member, index) => (
        <tr key={member.id} className="hover">
          <th>{index + 1}</th>
          <td className="font-medium">{member.full_name || "No name set"}</td>
          <td className="text-gray-500">{member.roll_number || 'No roll #'}</td>
          <td>
            {member.id === team.leader_id ? (
              <span className="badge badge-primary text-xs font-bold">
                LEADER
              </span>
            ) : (
              <span className="badge badge-ghost text-xs">
                MEMBER
              </span>
            )}
          </td>
          <td>
            {member.id === team.leader_id ? (
              <span className="text-xs text-gray-400">-</span>
            ) : member.id === currentUserId ? (
              // Show "Leave Team" button only to the current user if they are NOT the leader
              <button
                onClick={handleLeaveTeam}
                disabled={loading}
                className="btn btn-ghost btn-xs text-error hover:bg-error/10 disabled:text-gray-400"
              >
                Leave Team
              </button>
            ) : (
              <span className="text-xs text-gray-400">-</span>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </div>
      </div>
    </div>
  );
}