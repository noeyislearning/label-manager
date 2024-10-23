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

export async function deleteAllLabels(platform) {
  try {
    if (platform === "GitHub") {
      const { data: labels } = await octokit.request("GET /repos/{owner}/{repo}/labels", {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
      })

      if (labels.length === 0) {
        console.log("No labels found in the repository.")
        return
      }

      let deletedCount = 0
      for (const label of labels) {
        try {
          await octokit.request("DELETE /repos/{owner}/{repo}/labels/{name}", {
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            name: label.name,
          })
          console.log(`Deleted label: "${label.name}"`)
          deletedCount++
        } catch (error) {
          console.error(`Error deleting label "${label.name}":`)
          console.error(error.response?.data || error.message)
        }
      }

      console.log(`All ${deletedCount} labels deleted successfully on GitHub!`)
    } else if (platform === "GitLab") {
      const { data: labels } = await axios.get(
        `https://gitlab.com/api/v4/projects/${GITLAB_REPO_ID}/labels`,
        {
          headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
        },
      )

      if (labels.length === 0) {
        console.log("No labels found in the repository.")
        return
      }

      let deletedCount = 0
      for (const label of labels) {
        try {
          await axios.delete(
            `https://gitlab.com/api/v4/projects/${GITLAB_REPO_ID}/labels/${encodeURIComponent(
              label.name,
            )}`,
            {
              headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
            },
          )
          console.log(`Deleted label: "${label.name}"`)
          deletedCount++
        } catch (error) {
          console.error(`Error deleting label "${label.name}":`)
          console.error(error.response?.data || error.message)
        }
      }

      console.log(`All ${deletedCount} labels deleted successfully on GitLab!`)
    } else {
      console.error("Unsupported platform. Please choose either 'GitHub' or 'GitLab'.")
    }
  } catch (error) {
    console.error("Error fetching or deleting labels:")
    console.error(error.message)
  }
}
