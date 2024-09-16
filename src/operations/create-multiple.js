import fs from "fs"
import path from "path"
import { createOneLabel } from "./create-one.js"

export async function createMultipleLabels() {
  const filePath = path.resolve("data", "labels.json")
  try {
    const data = fs.readFileSync(filePath, "utf8")
    const labels = JSON.parse(data)

    let createdCount = 0
    for (const label of labels) {
      try {
        await createOneLabel(label.name, label.color, label.description)
        createdCount++
      } catch (error) {
        console.error(`Error creating label "${label.name}":`)
        console.error(error.message)
      }
    }

    console.log(`All ${createdCount} labels created successfully!`)
  } catch (error) {
    console.error("Error reading labels file or creating labels:")
    console.error(error.message)
  }
}
