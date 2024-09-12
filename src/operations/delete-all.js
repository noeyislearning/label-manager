import { Octokit } from "@octokit/rest"
import { OWNER, REPO, GITHUB_TOKEN } from "../constants.js"

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

export async function deleteAllLabels() {
  try {
    const { data: labels } = await octokit.request("GET /repos/{owner}/{repo}/labels", {
      owner: OWNER,
      repo: REPO,
    })

    if (labels.length === 0) {
      console.log("No labels found in the repository.")
      return
    }

    let deletedCount = 0
    for (const label of labels) {
      try {
        await octokit.request("DELETE /repos/{owner}/{repo}/labels/{name}", {
          owner: OWNER,
          repo: REPO,
          name: label.name,
        })
        console.log(`Deleted label: "${label.name}"`)
        deletedCount++
      } catch (error) {
        console.error(`Error deleting label "${label.name}":`)
        console.error(error.response?.data || error.message)
      }
    }

    console.log(`All ${deletedCount} labels deleted successfully!`)
  } catch (error) {
    console.error("Error fetching or deleting labels:")
    console.error(error.message)
  }
}
