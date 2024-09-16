![banner](https://i.imgur.com/rJerzGV.png)

<div align='center'>

![GitHub commit activity](https://img.shields.io/github/commit-activity/t/noeyislearning/label-manager?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/noeyislearning/label-manager?style=flat-square)
![GitHub License](https://img.shields.io/github/license/noeyislearning/label-manager?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/noeyislearning/label-manager?style=flat-square)

</div>

A command-line tool designed to simplify and automate the management of GitHub repository labels. This tool streamlines the process of creating, updating, deleting, and copying labels, making it easier to maintain organized and consistent label structures across your projects.

## 🔥 Activity

<div style="width: 100%">

![Alt](https://repobeats.axiom.co/api/embed/f818f5f7da9db323a050f1cb3d981968c342a9a9.svg "Repobeats analytics image")

</div>

## ⚙️ Features

1. **Create Label** - Easily create new label in your GitHub repository by specifying the label name, color (hex code), and description.

2. **Update Label** - Modify existing label with new name, color, or description. This helps in refining the categorization of issues and PRs without losing their historical context.

3. **Delete Label** - Remove a specific label from the repository by providing the label name.

4. **Delete All Labels** - Quickly delete all labels from the repository. A confirmation prompt is provided to ensure accidental deletions are avoided.

5. **Create Multiple Labels** - Import a list of labels from a labels.json file and automatically create them in your repository. This feature saves time when initializing projects or applying standard label sets.

6. **Generate Label Copy** - Export a copy of all labels in a repository to a JSON file. The file is automatically named with the current date and a random suffix to ensure uniqueness.

## 🔨 Installation

1. **Install Bun**

   Refer to [Bun's official documentation](https://bun.sh/docs) for installation instructions.

2. **Clone the Repository**

   Clone the repository to your local machine using the following command:

   ```bash
   $ git clone https://github.com/your-repo/label-manager.git
   $ cd label-manager
   ```

3. **Install Dependencies**

   Install the required dependencies using the following command:

   ```bash
   $ bun install
   ```

4. Set up your environment variables. Create a `.env` file with the following content:

   ```bash
   GITHUB_TOKEN=your_github_token
   GITHUB_REPO_OWNER=your_repo_owner
   GITHUB_REPO_NAME=your_repo_name
   ```

   Replace `your_github_token` with a valid GitHub personal access token, `your_repo_owner` with the name of the repository owner, and `your_repo_name` with the name of the repository.

   - To get a GitHub personal access token, follow the instructions [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

## 🌴 Usage

After installing the dependencies and setting up the environment variables, you can run the tool by executing the following command:

```bash
$ bun start
```

You will be prompted with a menu of actions to choose from:

- `Create a label`: Add a single label to your repository.
- `Update a label`: Modify an existing label’s name, color, or description.
- `Delete all labels`: Remove all labels from the repository. You will be asked for confirmation before the action is executed.
- `Create multiple labels`: Load and create multiple labels from a predefined `labels.json` file.
- `Generate a copy of labels`: Export all labels from your repository to a `.json` file saved in the `copies` directory.

### Example Commands

#### Creating Multiple Labels

For bulk label creation, prepare a `labels.json` file with the following format:

```json
[
  {
    "name": "bug",
    "color": "d73a4a",
    "description": "Issues related to bugs or defects"
  },
  {
    "name": "feature",
    "color": "a2eeef",
    "description": "New features or enhancements"
  }
]
```

Place this file in the `data/` directory and run the tool with the "Create multiple labels" option.

#### Generating a Copy of Labels

This feature will save all current labels into a file with a name in the format `MMDDYYYY<random_number>.json` in the `copies/` directory.

## 🚧 Future Enhancements

- [ ] Ability to delete a specific label instead of all labels.
- [ ] Update multiple labels from a file similar to bulk creation.
- [ ] Sync labels across multiple repositories for consistency.
- [ ] A confirmation prompt is displayed to prevent accidental deletions.
