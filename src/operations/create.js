import { Octokit } from "@octokit/rest"
import { OWNER, REPO, GITHUB_TOKEN } from "../constants.js"

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

export async function createLabel(name, color, description) {
  try {
    await octokit.request("POST /repos/{owner}/{repo}/labels", {
      owner: OWNER,
      repo: REPO,
      name,
      color,
      description,
    })
    console.log(`Created label "${name}" successfully!`)
  } catch (error) {
    console.error(`Error creating label "${name}":`)
    console.error(error.response?.data || error.message)
  }
}
