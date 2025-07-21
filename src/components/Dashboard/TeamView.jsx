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
  <div className="flex-grow flex items-center justify-center bg-gray-50 px-4" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}>
    <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{team.team_name}</h1>
          <p className="text-lg text-gray-600 mt-2 font-medium">Welcome to your team dashboard</p>
        </div>
        {isLeader && (
          <button
            onClick={handleDeleteTeam}
            disabled={loading}
            className="bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:bg-gray-400"
          >
            {loading ? "Deleting..." : "Delete Team"}
          </button>
        )}
      </div>

      {/* Team Join Code Section */}
      <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
        <label className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Team Join Code</label>
        <div className="flex items-center justify-between mt-3">
          <p className="text-3xl font-mono font-bold tracking-widest text-blue-900 select-all">
            {team.join_code}
          </p>
          <button
            onClick={handleCopyCode}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            {copySuccess || 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 text-center text-red-700 bg-red-50 border border-red-200 p-4 rounded-lg font-medium">
          {error}
        </div>
      )}

      {/* Team Members Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Team Members 
          <span className="text-lg font-medium text-gray-500 ml-2">({members.length}/4)</span>
        </h2>
        
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-sm font-semibold text-gray-900 px-6 py-4">#</th>
                <th className="text-left text-sm font-semibold text-gray-900 px-6 py-4">Name</th>
                <th className="text-left text-sm font-semibold text-gray-900 px-6 py-4">Roll Number</th>
                <th className="text-left text-sm font-semibold text-gray-900 px-6 py-4">Role</th>
                <th className="text-left text-sm font-semibold text-gray-900 px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member, index) => (
                <tr 
                  key={member.id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-base">
                      {member.full_name || "No name set"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {member.roll_number || 'No roll #'}
                  </td>
                  <td className="px-6 py-4">
                    {member.id === team.leader_id ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        👑 LEADER
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        👤 MEMBER
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {member.id === team.leader_id ? (
                      <span className="text-xs text-gray-400">—</span>
                    ) : member.id === currentUserId ? (
                      <button
                        onClick={handleLeaveTeam}
                        disabled={loading}
                        className="text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-md transition-colors disabled:text-gray-400"
                      >
                        Leave Team
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
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