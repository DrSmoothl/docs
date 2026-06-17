# MaiBot Documentation

This repository contains the official documentation for MaiBot. MaiBot is an intelligent chatbot designed for QQ groups, featuring LLM-based conversational capabilities, a memory system, and emotional expression.

## About the Documentation

This documentation site is built with [VitePress](https://vitepress.dev/), covering everything you need to install, deploy, configure, and develop (in progress) MaiBot.

## Documentation Sections

### Table of Contents

- **Installation Guide**
    Provides standard and beginner-friendly installation steps to help users get started quickly.

- **API Reference (in progress)**
    Detailed description of the API interfaces provided by MaiBot and how to use them.

- **Deployment Methods**
    Covers multiple deployment options, including Docker, Linux, Windows, and Synology NAS.

- **FAQ and Troubleshooting**
    A collection of common questions and their solutions to help users diagnose and resolve issues.

- **File Structure and Configuration**
    Explains the project file structure and configuration methods, allowing users to customize and extend.

## Local Development

### Local Deployment Requirements
Use Node.js to install the corresponding dependencies

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm docs:dev

# Build for production
pnpm docs:build

# Preview the production build
pnpm docs:preview
```

## Contributing

### Full Workflow
If you want to modify the documentation, first fork the repository, make your changes, and then submit a PR.

If you want to add a file, fork the repository, add your document to the appropriate directory (or create a new one), and update the `index.md` files at each level to include your document.

Then locate the `.vitepress/config.mts` file and modify the navigation so it correctly points to your file.

After that, submit a PR.

### Lazy Workflow
If you want to modify the documentation, first fork the repository, make your changes, and then submit a PR.

If you want to add a file, fork the repository, add your document to the root directory, submit a PR, and specify where you would like the file to be placed.

If the PR is approved, we will manually configure the directories for you.
