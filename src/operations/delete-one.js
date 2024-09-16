import chalk from "chalk"
import { Octokit } from "@octokit/rest"
import { OWNER, REPO, GITHUB_TOKEN } from "../constants.js"

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

export async function deleteOneLabel(name) {
  try {
    await octokit.request("DELETE /repos/{owner}/{repo}/labels/{name}", {
      owner: OWNER,
      repo: REPO,
      name,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    console.log(`Deleted label "${name}" successfully!`)
  } catch (error) {
    console.error(`Error deleting label "${name}":`)
    console.error(error.response?.data || error.message)
  }
}
