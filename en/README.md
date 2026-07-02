# MaiBot Documentation

This repository is the official documentation for MaiBot. MaiBot is an intelligent chatbot designed specifically for QQ groups, featuring LLM-based conversation capabilities, a memory system, and emotional expression functions.

## About the Documentation

This documentation site is built with [VitePress](https://vitepress.dev/) and covers everything needed for installing, deploying, configuring, and developing (incomplete) MaiBot.

## Documentation Sections

### Documentation Directory

- **Installation Guide**
    Provides installation steps for both the standard version and the beginner-friendly version, helping users get started quickly.

- **API Reference (Incomplete)**
    Details the API interfaces provided by MaiBot and their usage methods.

- **Deployment Methods**
    Covers various deployment methods, including Docker, Linux, Windows, and Synology NAS.

- **FAQ and Troubleshooting**
    Collects common issues and their solutions to help users diagnose and resolve problems.

- **File Structure and Configuration**
    Explains the project's file structure and configuration methods, making it easy for users to customize and extend.

## Local Development

### Local Deployment Requirements
Use Node.js to install the corresponding dependencies.

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm docs:dev

# Build the production version
pnpm docs:build

# Preview the production version
pnpm docs:preview
```

## Contributing

### Full Method
If you want to modify the documentation, first fork the repository, make your changes, and then submit a PR.

If you want to add a file, after forking, add the document you wrote and place it in the corresponding directory (or create a new directory), and modify the index.md files at each level to include your document.

Then find the `config.mts` file under `.vitepress` and modify the navigation so that it correctly navigates to your file.

After that, submit a PR.

### Lazy Method
If you want to modify the documentation, first fork the repository, make your changes, and then submit a PR.

If you want to add a file, after forking, add the document you wrote and place it in the root directory, then submit a PR explaining the directory location where you want it placed.

If the PR is approved, we will manually configure the various directories for you.