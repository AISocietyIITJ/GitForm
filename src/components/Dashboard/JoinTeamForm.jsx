"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import checkGitHubStar from "@/utils/star";
import Link from "next/link";

export default function JoinTeamForm({ userId }) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [starred, setStarred] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setError("");
    const codeToJoin = joinCode.trim().toLowerCase();

    if (!fullName.trim() || !rollNumber.trim()) {
      setError("Please fill in your full name and roll number.");
      return;
    }

    if (!starred) {
      setError("You must star Pathway on GitHub before joining a team.");
      return;
    }

    if (!agreed) {
      setError("You must agree to the terms before joining a team.");
      return;
    }

    if (!codeToJoin) {
      setError("Please enter a team code.");
      return;
    }

    setLoading(true);

    if (!await checkGitHubStar()) {
      setError("You must star Pathway on GitHub to join a team.");
      setLoading(false);
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          roll_number: rollNumber.trim().toLowerCase(),
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      const { error: rpcError } = await supabase.rpc("join_team_with_code", {
        join_code_to_use: codeToJoin,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }
      
      router.refresh();

    } catch (err) {
      console.error("Error joining team:", err.message);
      if (err.message.includes('profiles_roll_number_key')) {
        setError("This roll number is already registered.");
      } else {
        setError(`An error occurred: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-2">Join a Team</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your details and the 8-character team code.
        </p>
        <form onSubmit={handleJoinTeam} className="space-y-4">
          <fieldset>
            <legend className="text-sm font-medium text-gray-700">Your Full Name</legend>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input input-bordered w-full mt-1"
              placeholder="e.g., Jane Smith"
              disabled={loading}
            />
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-gray-700">Your Roll Number</legend>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="input input-bordered w-full mt-1"
              placeholder="e.g., EE-202"
              disabled={loading}
            />
          </fieldset>

          <div className="border-t my-4"></div>

          <fieldset>
            <legend className="text-sm font-medium text-gray-700">Team Code</legend>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="input input-bordered w-full text-center font-mono tracking-widest text-lg mt-1"
              placeholder="xxxxxxxx"
              maxLength="8"
              disabled={loading}
            />
          </fieldset>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={starred}
              onChange={(e) => setStarred(e.target.checked)}
              className="checkbox"
              disabled={loading}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I I have starred <Link href="https://github.com/pathwaycom/pathway" className="text-blue-600 underline" target="_blank">Pathway</Link> on GitHub
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="checkbox"
              disabled={loading}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the terms and conditions
            </label>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-neutral-800 transition disabled:bg-gray-400"
            disabled={loading || !joinCode}
          >
            {loading ? "Joining..." : "Join Team"}
          </button>
        </form>
        <Link href="/create-team" >Create Team</Link>
      </div>
    </div>
  );
}