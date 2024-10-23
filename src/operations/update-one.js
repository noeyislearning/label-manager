import chalk from "chalk"
import { Octokit } from "@octokit/rest"
import axios from "axios"
import { hexToRgb } from "../helpers/hex-code-to-rgb.js"
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

export async function updateOneLabel(platform, name, newName, color, description) {
  try {
    if (platform === "GitHub") {
      const [r, g, b] = hexToRgb(color)
      await octokit.request("PATCH /repos/{owner}/{repo}/labels/{name}", {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        name,
        new_name: newName,
        color,
        description,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      const colorStyled = chalk.bgRgb(r, g, b).black(`   `)
      console.log(
        `Updated label from "${name}" to "${newName}" successfully on GitHub! ${colorStyled}`,
      )
    } else if (platform === "GitLab") {
      const updateData = {}
      if (newName) updateData.new_name = newName
      if (color) {
        if (!color.startsWith("#")) {
          color = `#${color}`
        }
        updateData.color = color
      }
      if (description) updateData.description = description

      await axios.put(
        `https://gitlab.com/api/v4/projects/${GITLAB_REPO_ID}/labels/${encodeURIComponent(name)}`,
        updateData,
        {
          headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
        },
      )
      console.log(`Updated label from "${name}" to "${newName}" successfully on GitLab!`)
    } else {
      console.error("Unsupported platform. Please choose either 'GitHub' or 'GitLab'.")
    }
  } catch (error) {
    console.error(`Error updating label "${name}":`)
    console.error(error.response?.data || error.message)
  }
}
