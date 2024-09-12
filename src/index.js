import inquirer from "inquirer"
import { createLabel } from "./operations/create.js"
import { updateLabel } from "./operations/update.js"
import { deleteAllLabels } from "./operations/delete-all.js"
import { createMultipleLabels } from "./operations/create-multiple.js"
import { generateLabelCopy } from "./operations/generate-copy.js"

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "Create a label",
        "Update a label",
        "Delete all labels",
        "Create multiple labels",
        "Generate a copy of labels",
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
      await createLabel(name, color, description)
      break

    case "Update a label":
      const { currentName, newName, updateColor, updateDescription } = await inquirer.prompt([
        { type: "input", name: "currentName", message: "Current label name:" },
        { type: "input", name: "newName", message: "New label name:" },
        { type: "input", name: "updateColor", message: "New label color (hex):" },
        { type: "input", name: "updateDescription", message: "New label description:" },
      ])
      await updateLabel(currentName, newName, updateColor, updateDescription)
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
        await deleteAllLabels()
      } else {
        console.log("Delete operation canceled.")
      }
      break

    case "Create multiple labels":
      await createMultipleLabels()
      break

    case "Generate a copy of labels":
      await generateLabelCopy()
      break

    default:
      console.log("Invalid option selected")
  }
}

mainMenu()
