import "dotenv/config"
import chalk from "chalk"
import fs from "fs"
import path from "path"
import { Octokit } from "@octokit/rest"
import { Command } from "commander"

import { hexToRgb } from "./hex-code-to-rgb.js"
import { generateCurrentDate, generateRandomNumber } from "./helpers/generate.js"

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
    const [r, g, b] = hexToRgb(color)
    await octokit.request("POST /repos/{owner}/{repo}/labels", {
      owner: OWNER,
      repo: REPO,
      name,
      color,
      description,
    })
    const colorStyled = chalk.bgRgb(r, g, b).black(`   `)
    console.log(
      `Created label: "${name}" | Color: ${color} ${colorStyled} | Description: ${description}`,
    )
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
      `Updated label: "${name}" to "${newName}" | Color: ${color} ${colorStyled} | Description: ${description}`,
    )
  } catch (error) {
    console.error(`Error updating label "${name}":`)
    console.error(error.response?.data || error.message)
  }
}

/**
 * `deleteAllLabels` deletes all labels in the GitHub repository.
 */
async function deleteAllLabels() {
  try {
    // Fetch all labels
    const { data: labels } = await octokit.request("GET /repos/{owner}/{repo}/labels", {
      owner: OWNER,
      repo: REPO,
    })

    if (labels.length === 0) {
      console.log("No labels found in the repository.")
      return
    }

    // Delete each label
    for (const label of labels) {
      try {
        await octokit.request("DELETE /repos/{owner}/{repo}/labels/{name}", {
          owner: OWNER,
          repo: REPO,
          name: label.name,
        })
        console.log(`Deleted label: "${label.name}"`)
      } catch (error) {
        console.error(`Error deleting label "${label.name}":`)
        console.error(error.response?.data || error.message)
      }
    }

    console.log("All labels deleted successfully!")
  } catch (error) {
    console.error("Error fetching or deleting labels:")
    console.error(error.message)
  }
}

/**
 * `createMultipleLabels` creates multiple labels in the GitHub repository
 */
async function createMultipleLabels() {
  const filePath = path.resolve("data", "labels.json")
  try {
    const data = fs.readFileSync(filePath, "utf8")
    const labels = JSON.parse(data)

    let successfulCount = 0
    let failedCount = 0

    for (const label of labels) {
      const created = await createLabel(label.name, label.color, label.description)
      if (created) {
        successfulCount++
      } else {
        failedCount++
      }
    }

    console.log(`All ${successfulCount} out of ${labels.length} labels created successfully!`)
  } catch (error) {
    console.error("Error reading labels file or creating labels:")
    console.error(error.message)
  }
}

/**
 * Fetch all labels from the GitHub repository and save them to a JSON file
 */
async function generateLabelCopy() {
  try {
    // Fetch all labels
    const { data: labels } = await octokit.request("GET /repos/{owner}/{repo}/labels", {
      owner: OWNER,
      repo: REPO,
    })

    // Extract relevant fields from each label
    const labelsCopy = labels.map(({ name, color, description }) => ({ name, color, description }))

    // Generate the filename
    const date = generateCurrentDate()
    const randomNumber = generateRandomNumber()
    const fileName = `${date}${randomNumber}.json`
    const filePath = path.resolve("copies", fileName)

    // Save labels to JSON file
    fs.writeFileSync(filePath, JSON.stringify(labelsCopy, null, 2), "utf8")
    console.log(`Labels copied to "${fileName}"`)
  } catch (error) {
    console.error("Error fetching labels or saving to file:")
    console.error(error.message)
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
program.option("--delete-all", "Delete all labels in the GitHub repository")
program.option("--multiple", "Create multiple labels from data/labels.json")
program.option("--generate-copy", "Generate a copy of all labels and save to a JSON file")

program.parse(process.argv)

const options = program.opts()

switch (true) {
  case !!options.create: {
    const [name, color, ...descriptionParts] = options.create
    const description = descriptionParts.join(" ")
    createLabel(name, color, description)
    break
  }

  case !!options.update: {
    const [name, newName, color, ...descriptionParts] = options.update
    const description = descriptionParts.join(" ")
    updateLabel(name, newName, color, description)
    break
  }

  case !!options.deleteAll: {
    deleteAllLabels()
    break
  }

  case !!options.multiple: {
    createMultipleLabels()
    break
  }

  case !!options.generateCopy: {
    generateLabelCopy()
    break
  }

  default:
    console.log("No valid option selected.")
    program.help()
}
