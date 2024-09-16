import chalk from "chalk"
import { Octokit } from "@octokit/rest"
import { hexToRgb } from "../helpers/hex-code-to-rgb.js"
import { OWNER, REPO, GITHUB_TOKEN } from "../constants.js"

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

export async function updateOneLabel(name, newName, color, description) {
  try {
    const [r, g, b] = hexToRgb(color)
    await octokit.request("PATCH /repos/{owner}/{repo}/labels/{name}", {
      owner: OWNER,
      repo: REPO,
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
      `Updated label from "${name}" to "${newName}" successfully!\nColor: ${color} ${colorStyled}\nDescription: ${description}`,
    )
  } catch (error) {
    console.error(`Error updating label "${name}":`)
    console.error(error.response?.data || error.message)
  }
}
