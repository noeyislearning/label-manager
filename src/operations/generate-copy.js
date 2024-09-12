import fs from "fs"
import path from "path"
import { Octokit } from "@octokit/rest"
import { generateRandomNumber, generateCurrentDate } from "../helpers/generate.js"
import { OWNER, REPO, GITHUB_TOKEN } from "../constants.js"

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

export async function generateLabelCopy() {
  try {
    const { data: labels } = await octokit.request("GET /repos/{owner}/{repo}/labels", {
      owner: OWNER,
      repo: REPO,
    })

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
    const fileName = `${datePrefix}${randomSuffix}.json`
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
