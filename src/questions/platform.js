import inquirer from "inquirer"

export async function choosePlatform() {
  const { platform } = await inquirer.prompt([
    {
      type: "list",
      name: "platform",
      message: "Which platform are you using?",
      choices: ["GitHub", "GitLab", "Exit"],
    },
  ])
  return platform
}
