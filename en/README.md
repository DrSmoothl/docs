# MaiBot Documentation

This repository is the official documentation for MaiBot. MaiBot is an intelligent chatbot specifically designed for QQ groups, featuring LLM-based conversation capabilities, a memory system, and emotional expression functions.

## About the Documentation

This documentation site is built using [VitePress](https://vitepress.dev/), covering everything needed for the installation, deployment, configuration, and development (incomplete) development of MaiBot.

## Documentation Sections

### Table of Contents

- **Installation Guide**
    Provides installation steps for both the standard version and a beginner-friendly version to help users get started quickly.

- **API Reference (Incomplete)**
    Detailed introduction to the API interfaces provided by MaiBot and how to use them.

- **Deployment Methods**
    Covers various deployment methods, including Docker, Linux, Windows, and Synology NAS.

- **FAQ and Troubleshooting**
    Collects common issues and their solutions to help users troubleshoot and resolve problems.

- **File Structure and Configuration**
    Explains the project's file structure and configuration methods to facilitate user customization and extension.

## Local Development

### Local Deployment Requirements
Use Nodejs to install the corresponding dependencies

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm docs:dev

# 构建生产版本
pnpm docs:build

# 预览生产版本
pnpm docs:preview
```

## Contribution

### Full Method
If you want to modify the documentation, first fork the repository, make your changes, and then submit a PR.

If you want to add files, after forking, add the documentation you wrote and place it in the corresponding directory (or create a new directory), and modify the `index.md` at each level to include your documentation.

Then, find the `config.mts` file under `.vitepress` and modify the navigation within it so that it can correctly navigate to your file.

After that, you can initiate a PR.

### Lazy Method
If you want to modify the documentation, first fork the repository, make your changes, and then submit a PR.

If you want to add files, after forking, add the documentation you wrote and place it in the root directory, then initiate a PR and specify the directory location where you want it placed.

If the PR is approved, we will manually help you configure the various directories.