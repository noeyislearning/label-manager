import inquirer from "inquirer"
import { generateLabelCopy } from "../operations/generate-copy.js"
import { createOneLabel } from "../operations/create-one.js"
import { updateOneLabel } from "../operations/update-one.js"
import { deleteOneLabel } from "../operations/delete-one.js"
import { deleteAllLabels } from "../operations/delete-all.js"
import { createMultipleLabels } from "../operations/create-multiple.js"
import { GITLAB_TOKEN, GITLAB_REPO_ID } from "../constants.js"

function checkGitLabCredentials() {
  if (!GITLAB_TOKEN || !GITLAB_REPO_ID) {
    console.log("GitLab token or repository ID is not set. Please update your .env file.")
    process.exit(0)
  }
}

async function askToContinue() {
  const { continueUsing } = await inquirer.prompt([
    {
      type: "confirm",
      name: "continueUsing",
      message: "Do you want to continue using the tool?",
      default: true,
    },
  ])
  return continueUsing
}

export async function gitLabMenu() {
  checkGitLabCredentials()

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do on GitLab?",
        choices: [
          "Create a label",
          "Update a label",
          "Delete a label",
          "Delete all labels",
          "Generate a copy of labels",
          "Create multiple labels",
          "Exit",
        ],
      },
    ])

    switch (action) {
      case "Create a label":
        const { name, color, description } = await inquirer.prompt([
          { type: "input", name: "name", message: "Label name:" },
          { type: "input", name: "color", message: "Label color (hex):" },
          { type: "input", name: "description", message: "Label description:" },
        ])
        await createOneLabel("GitLab", name, color, description)
        break

      case "Update a label":
        const { currentName, newName, updateColor, updateDescription } = await inquirer.prompt([
          { type: "input", name: "currentName", message: "Current label name:" },
          { type: "input", name: "newName", message: "New label name:" },
          { type: "input", name: "updateColor", message: "New label color (hex):" },
          { type: "input", name: "updateDescription", message: "New label description:" },
        ])
        await updateOneLabel("GitLab", currentName, newName, updateColor, updateDescription)
        break

      case "Delete a label":
        const { deleteName } = await inquirer.prompt([
          { type: "input", name: "deleteName", message: "Label name to delete:" },
        ])
        await deleteOneLabel("GitLab", deleteName)
        break

      case "Delete all labels":
        await deleteAllLabels("GitLab")
        break

      case "Generate a copy of labels":
        await generateLabelCopy("GitLab")
        break

      case "Create multiple labels":
        await createMultipleLabels("GitLab")
        break

      case "Exit":
        console.log("Exiting the application.")
        process.exit(0)

      default:
        console.log("Invalid option selected")
    }

    const continueUsing = await askToContinue()
    if (!continueUsing) {
      console.log("Exiting the application.")
      process.exit(0)
    }
  }
}
