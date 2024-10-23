import { choosePlatform } from "./questions/platform.js"
import { gitHubMenu } from "./questions/github-menu.js"
import { gitLabMenu } from "./questions/gitlab-menu.js"

async function start() {
  while (true) {
    const platform = await choosePlatform()
    if (platform === "GitHub") {
      const result = await gitHubMenu()
      if (result === "Exit") {
        break
      }
    } else if (platform === "GitLab") {
      const result = await gitLabMenu()
      if (result === "Exit") {
        break
      }
    } else {
      console.log("Exiting the application.")
      break
    }
  }
}

start()
