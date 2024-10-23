import inquirer from "inquirer"
import { createOneLabel } from "../operations/create-one.js"
import { updateOneLabel } from "../operations/update-one.js"
import { deleteOneLabel } from "../operations/delete-one.js"
import { deleteAllLabels } from "../operations/delete-all.js"
import { createMultipleLabels } from "../operations/create-multiple.js"
import { generateLabelCopy } from "../operations/generate-copy.js"
import { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } from "../constants.js"

function checkGitHubCredentials() {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    console.log(
      "GitHub token, repository owner, or repository name is not set. Please update your .env file.",
    )
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

export async function gitHubMenu() {
  checkGitHubCredentials()

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do on GitHub?",
        choices: [
          "Create a label",
          "Update a label",
          "Delete a label",
          "Delete all labels",
          "Create multiple labels",
          "Generate a copy of labels",
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
        await createOneLabel("GitHub", name, color, description)
        break

      case "Update a label":
        const { currentName, newName, updateColor, updateDescription } = await inquirer.prompt([
          { type: "input", name: "currentName", message: "Current label name:" },
          { type: "input", name: "newName", message: "New label name:" },
          { type: "input", name: "updateColor", message: "New label color (hex):" },
          { type: "input", name: "updateDescription", message: "New label description:" },
        ])
        await updateOneLabel("GitHub", currentName, newName, updateColor, updateDescription)
        break

      case "Delete a label":
        const { deleteName } = await inquirer.prompt([
          { type: "input", name: "deleteName", message: "Label name to delete:" },
        ])
        await deleteOneLabel("GitHub", deleteName)
        break

      case "Delete all labels":
        const { confirmDelete } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirmDelete",
            message: "Are you sure you want to delete all labels?",
            default: false,
          },
        ])
        if (confirmDelete) {
          await deleteAllLabels("GitHub")
        } else {
          console.log("Delete operation canceled.")
        }
        break

      case "Create multiple labels":
        await createMultipleLabels("GitHub")
        break

      case "Generate a copy of labels":
        await generateLabelCopy("GitHub")
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
