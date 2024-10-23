import { Octokit } from "@octokit/rest"
import axios from "axios"
import {
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_TOKEN,
  GITLAB_TOKEN,
  GITLAB_REPO_ID,
} from "../constants.js"

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

export async function deleteOneLabel(platform, name) {
  try {
    if (platform === "GitHub") {
      await octokit.request("DELETE /repos/{owner}/{repo}/labels/{name}", {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        name,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      console.log(`Deleted label "${name}" successfully on GitHub!`)
    } else if (platform === "GitLab") {
      await axios.delete(
        `https://gitlab.com/api/v4/projects/${GITLAB_REPO_ID}/labels/${encodeURIComponent(name)}`,
        {
          headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
        },
      )
      console.log(`Deleted label "${name}" successfully on GitLab!`)
    } else {
      console.error("Unsupported platform. Please choose either 'GitHub' or 'GitLab'.")
    }
  } catch (error) {
    console.error(`Error deleting label "${name}":`)
    console.error(error.response?.data || error.message)
  }
}
