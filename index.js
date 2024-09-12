import axios from "axios"
import "dotenv/config"

const TOKEN = process.env.GITHUB_TOKEN
const OWNER = process.env.GITHUB_REPO_OWNER
const REPO = process.env.GITHUB_REPO_NAME

const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/labels`

const githubAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `token ${TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  },
})

async function createLabel(name, color, description) {
  try {
    const response = await githubAPI.post("", {
      name,
      color,
      description,
    })
    console.log(`Label "${name}" created successfully`)
    console.log(response.data)
  } catch (error) {
    console.error(`Error creating label "${name}"`)
    console.error(error.response.data)
  }
}

;(async () => {
  await createLabel("bug2", "d73a4a", "Something isn't working")
})()
