"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import checkGitHubStar from "@/utils/star";

const generateCode = () => {
  return Math.random().toString(36).substring(2, 10).toLowerCase();
};

const CreateTeamForm = () => {
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [teamName, setTeamName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [starred, setStarred] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !rollNumber.trim()) {
      setError("Please fill in your full name and roll number.");
      return;
    }

    if (!teamName.trim()) {
      setError("Team name cannot be empty.");
      return;
    }
    if (!starred) {
      setError("You must star Pathway on GitHub before creating a team.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the terms before creating a team.");
      return;
    }

    setLoading(true);

    if (!await checkGitHubStar()) {
      setError("You must star Pathway on GitHub to create a team.");
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to create a team.");
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          roll_number: rollNumber.trim().toUpperCase(),
        })
        .eq("id", user.id);
      
      if (profileError) throw profileError;
      
      const { data: existingTeams, error: checkError } = await supabase
        .from("teams")
        .select("team_name")
        .eq("team_name", teamName.trim());
      
      if (checkError) throw checkError;

      if (existingTeams && existingTeams.length > 0) {
        setError("This team name is already taken. Please choose another one.");
        setLoading(false);
        return;
      }
      
      const { data: newTeam, error: createTeamError } = await supabase
        .from("teams")
        .insert({
          team_name: teamName.trim(),
          leader_id: user.id,
          join_code: generateCode(),
        })
        .select()
        .single();

      if (createTeamError) throw createTeamError;
      
      const { error: addMemberError } = await supabase
        .from("team_members")
        .insert({
          team_id: newTeam.id,
          user_id: user.id,
        });

      if (addMemberError) throw addMemberError;
      
      router.refresh();

    } catch (error) {
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
    <div className="w-full max-w-lg lg:max-w-2xl mx-auto">
      {/* Heading */}
      <h1 className="text-2xl font-semibold text-center mb-2 text-white">
        Create Your Team
      </h1>
      <p className="text-center text-gray-300 mb-6">
        First, let’s get your details.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 px-10">
        {/* Full Name */}
        <fieldset className="space-y-1">
          <legend className="text-sm font-medium text-gray-400">
            Your Full Name
          </legend>
          <input
            type="text"
            className="input input-bordered w-full bg-white/5 border-gray-600 text-gray-200 placeholder-gray-400"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
        </fieldset>

        {/* Roll Number */}
        <fieldset className="space-y-1">
          <legend className="text-sm font-medium text-gray-400">
            Your Roll Number
          </legend>
          <input
            type="text"
            className="input input-bordered w-full bg-white/5 border-gray-600 text-gray-200 placeholder-gray-400"
            value={rollNumber}
            onChange={(e) =>
              setRollNumber(e.target.value.toUpperCase())
            }
            disabled={loading}
          />
        </fieldset>

        <div className="border-t border-gray-700 my-4" />

        {/* Team Name */}
        <fieldset className="space-y-1">
          <legend className="text-sm font-medium text-gray-400">
            What is your team name?
          </legend>
          <input
            type="text"
            className="input input-bordered w-full bg-white/5 border-gray-600 text-gray-200 placeholder-gray-400"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            disabled={loading}
          />
        </fieldset>

        {/* GitHub Star */}
        <div className="flex items-center space-x-2">
          <input
            id="starred"
            type="checkbox"
            checked={starred}
            onChange={(e) => setStarred(e.target.checked)}
            className="checkbox checkbox-primary"
            disabled={loading}
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
            className="checkbox checkbox-primary"
            disabled={loading}
          />
          <label htmlFor="terms" className="text-sm text-gray-400">
            I agree to the terms and conditions
          </label>
        </div>

        {/* Error */}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-900 transition disabled:bg-gray-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
      </form>

      <Link
        href="/join-team"
        className="text-blue-400 underline mt-6 block text-center"
      >
        Join Team
      </Link>
    </div>
  );

};

export default CreateTeamForm;
