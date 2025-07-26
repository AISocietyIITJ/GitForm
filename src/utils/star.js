import { createClient } from "@/utils/supabase/client";

export default async function checkGitHubStar(githubRepos = ['pathwaycom/pathway', 'pathwaycom/llm-app',    "pathwaycom/pathway-benchmarks",
    "pathwaycom/cookiecutter-pathway"]) {
  const supabase = createClient();

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error("Error getting session or user not logged in:", sessionError?.message);
    return false;
  }

  const accessToken = session.provider_token;

  if (!accessToken) {
    console.error("GitHub provider token not found. The user may not have logged in with GitHub.");
    return false;
  }

  try {
    const checkStar = async (repo) => {
      const response = await fetch('https://api.github.com/user/starred/'+repo, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });

      if (response.status === 204) {
        return true;
      } 
      else if (response.status === 404) {
        return false;
      } 
      else {
        console.error(`GitHub API returned an unexpected status: ${response.status}`);
        return false;
      }
    }
    const results = await Promise.all(githubRepos.map(checkStar));
    return results.every(Boolean);
  } catch (error) {
    console.error("Failed to call the GitHub API:", error);
    return false;
  }
}
