import fs from "fs"
import path from "path"
import { Octokit } from "@octokit/rest"
import axios from "axios"
import { generateRandomNumber, generateCurrentDate } from "../helpers/generate.js"
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

export async function generateLabelCopy(platform) {
  try {
    let labels = []

    if (platform === "GitHub") {
      if (!GITHUB_OWNER || !GITHUB_REPO) {
        throw new Error("GitHub owner or repository name is not set.")
      }
      let page = 1
      let fetchedLabels
      do {
        const { data } = await octokit.request("GET /repos/{owner}/{repo}/labels", {
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          per_page: 100,
          page,
        })
        fetchedLabels = data
        labels = labels.concat(fetchedLabels)
        page++
      } while (fetchedLabels.length === 100)
    } else if (platform === "GitLab") {
      if (!GITLAB_TOKEN || !GITLAB_REPO_ID) {
        throw new Error("GitLab token or repository ID is not set.")
      }
      const response = await axios.get(
        `https://gitlab.com/api/v4/projects/${GITLAB_REPO_ID}/labels?with_counts=true`,
        {
          headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
        },
      )
      labels = response.data
    }

    if (labels.length === 0) {
      console.log("No labels found in the repository.")
      return
    }

    const labelsToSave = labels.map(({ name, color, description }) => ({
      name,
      color,
      description,
    }))

    const datePrefix = generateCurrentDate()
    const randomSuffix = generateRandomNumber()
    const fileName = `${platform.toUpperCase()}-${datePrefix}${randomSuffix}.json`
    const directoryPath = path.join("copies")

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath)
      console.log(`Directory 'copies' created.`)
    }

    const filePath = path.join(directoryPath, fileName)
    fs.writeFileSync(filePath, JSON.stringify(labelsToSave, null, 2))
    console.log(`Labels copied to ${filePath}`)
  } catch (error) {
    console.error("Error fetching or saving labels:")
    console.error(error.message)
  }
}
