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

export async function createOneLabel(platform, name, color, description) {
  if (platform === "GitHub") {
    await octokit.request("POST /repos/{owner}/{repo}/labels", {
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      name,
      color,
      description,
    })
  } else if (platform === "GitLab") {
    if (!color.startsWith("#")) {
      color = `#${color}`
    }
    await axios.post(
      `https://gitlab.com/api/v4/projects/${GITLAB_REPO_ID}/labels`,
      {
        name,
        color,
        description,
      },
      {
        headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
      },
    )
  } else {
    throw new Error("Unsupported platform. Please choose either 'GitHub' or 'GitLab'.")
  }
}
