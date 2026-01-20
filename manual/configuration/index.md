# MaiBot 配置快速入门

## 配置文件

MaiBot 现在使用以下三个主要配置文件：

1. **`bot_config.toml`** - 位于 `config` 文件夹，MaiBot行为配置文件，包含机器人的名称、性格设定及功能开关。
2. **`model_config.toml`** - 位于 `config` 文件夹，模型和API配置文件，包含AI模型配置、API服务商设置等。
3. **`.env`** - 位于根目录，负责配置MaiBot监听的地址和端口;以及webui的启用、监听的地址和端口、模式。  

为了让MaiBot连接上qq等其他平台，你还需要编辑对应的适配器的配置文件

## 配置文件详细说明

[bot_config配置教程](./configuration_standard.md)

[model_config模型配置教程](./configuration_model_standard.md)

## 知识库导入要求

MaiBot 支持通过 OpenIE 技术导入知识库。文件命名需以 `-openie.json` 结尾，具体要求请参考 [LPMM 知识库导入要求](./lpmm/lpmm_knowledge_template)。

## 常见问题

如果在配置过程中遇到问题，请参考 [常见问题](/manual/faq/) 寻求解决方案。

### 配置文件相关

**Q: 为什么现在有两个配置文件？**
A: 为了更好的配置管理和维护，将模型配置和机器人行为配置分离，使配置更加清晰和模块化。

**Q: 如何从旧版本升级？**
A: 请参考模板文件创建新的配置文件，并确保版本号正确设置。

**Q: 两个配置文件都需要配置吗？**
A: 是的，两个配置文件都是必需的。`bot_config.toml` 控制机器人行为，`model_config.toml` 控制AI模型和API。
