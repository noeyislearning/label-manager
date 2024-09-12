import { Octokit } from "@octokit/rest"
import "dotenv/config"
import { Command } from "commander"
import chalk from "chalk"
import { hexToRgb } from "./hex-code-to-rgb.js"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const OWNER = process.env.GITHUB_REPO_OWNER
const REPO = process.env.GITHUB_REPO_NAME

/**
 * `createLabel` creates a new label in the GitHub repository
 * @param {*} name
 * @param {*} color
 * @param {*} description
 */
async function createLabel(name, color, description) {
  try {
    await octokit.request("POST /repos/{owner}/{repo}/labels", {
      owner: OWNER,
      repo: REPO,
      name,
      color,
      description,
    })
    console.log(`Created successfully:\n${name}`)
  } catch (error) {
    console.error(`Error creating label "${name}":`)
    console.error(error.response?.data || error.message)
  }
}

/**
 * `updateLabel` updates an existing label in the GitHub repository
 * @param {*} name
 * @param {*} newName
 * @param {*} color
 * @param {*} description
 */
async function updateLabel(name, newName, color, description) {
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
      `Updated successfully!\n---------\nInformation\nLabels: (Old) "${name}" → (New) "${newName}"\nColor: ${color} ${colorStyled}\nDescription: ${description}\n---------`,
    )
  } catch (error) {
    console.error(`Error updating label "${name}":`)
    console.error(error.response?.data || error.message)
  }
}

/** CLI setup using commander */
const program = new Command()
program.version("1.0.0").description("A CLI tool to manage GitHub labels")
program.option(
  "--create <name> <color> [description...]",
  "Create a new label in the GitHub repository",
)
program.option(
  "--update <name> <newName> <color> [description...]",
  "Update an existing label in the GitHub repository",
)

program.parse(process.argv)

const options = program.opts()

if (options.create) {
  const [name, color, ...descriptionParts] = options.create
  const description = descriptionParts.join(" ")
  createLabel(name, color, description)
}

if (options.update) {
  const [name, newName, color, ...descriptionParts] = options.update
  const description = descriptionParts.join(" ")
  updateLabel(name, newName, color, description)
}
