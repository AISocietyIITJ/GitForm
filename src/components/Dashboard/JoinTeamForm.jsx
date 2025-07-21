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
          roll_number: rollNumber.trim().toUpperCase(),
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
<div className="flex-grow flex items-center justify-center px-4">
  <div className="w-full max-w-md p-6 text-white">
    {/* Heading */}
    <h1 className="text-2xl font-semibold text-center mb-2">
      Join a Team
    </h1>
    <p className="text-center text-gray-300 mb-6">
      Enter your details and the 8-character team code.
    </p>

    <form onSubmit={handleJoinTeam} className="space-y-4">
      {/* Full Name */}
      <fieldset className="space-y-1">
        <legend className="text-sm font-medium text-gray-400">
          Your Full Name
        </legend>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g., Jane Smith"
          disabled={loading}
          className="input input-bordered w-full
                     bg-white/5 border-gray-600 
                     text-gray-200 placeholder-gray-400 mt-1"
        />
      </fieldset>

      {/* Roll Number */}
      <fieldset className="space-y-1">
        <legend className="text-sm font-medium text-gray-400">
          Your Roll Number
        </legend>
        <input
          type="text"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
          placeholder="e.g., EE-202"
          disabled={loading}
          className="input input-bordered w-full
                     bg-white/5 border-gray-600 
                     text-gray-200 placeholder-gray-400 mt-1"
        />
      </fieldset>

      <div className="border-t border-gray-700 my-4" />

      {/* Team Code */}
      <fieldset className="space-y-1">
        <legend className="text-sm font-medium text-gray-400">
          Team Code
        </legend>
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="xxxxxxxx"
          maxLength={8}
          disabled={loading}
          className="input input-bordered w-full text-center font-mono tracking-widest text-lg
                     bg-white/5 border-gray-600 
                     text-gray-200 placeholder-gray-400 mt-1"
        />
      </fieldset>

      {/* Star Pathway */}
      <div className="flex items-center space-x-2">
        <input
          id="starred"
          type="checkbox"
          checked={starred}
          onChange={(e) => setStarred(e.target.checked)}
          disabled={loading}
          className="checkbox checkbox-primary"
        />
        <label htmlFor="starred" className="text-sm text-gray-400">
          I have starred{" "}
          <Link
            href="https://github.com/pathwaycom/pathway"
            target="_blank"
            className="text-blue-400 underline"
          >
            Pathway
          </Link>{" "}
          on GitHub
        </label>
      </div>

      {/* Terms */}
      <div className="flex items-center space-x-2">
        <input
          id="terms"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          disabled={loading}
          className="checkbox checkbox-primary"
        />
        <label htmlFor="terms" className="text-sm text-gray-400">
          I agree to the terms and conditions
        </label>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !joinCode}
        className="w-full bg-purple-700 text-white py-2 rounded-md
                   hover:bg-purple-900 transition disabled:bg-gray-600"
      >
        {loading ? "Joining..." : "Join Team"}
      </button>
    </form>

    <Link
      href="/create-team"
      className="text-blue-400 underline mt-6 block text-center"
    >
      Create Team
    </Link>
  </div>
</div>

  );
}