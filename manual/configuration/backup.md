# 📄 MaiBot备份与恢复

> 别让你的麦麦变成"失忆症患者"——及时备份，让它永远记得你！

MaiBot 文件夹结构：
```
MaiBot/
├── data/
├── config/
│   ├── bot_config.toml
│   └── model_config.toml
├── plugins/
│   └── ...
├── .env
└── ...
```
因此，你想要备份麦麦，需要备份以下内容：

### `data` 文件夹
- 用于存储表情包、知识库、记忆等。
### `config` 文件夹
- 用于存储配置文件。
- 用于存储调用的大模型信息，AI云服务提供商等设置。
### `plugins`文件
- 用于存储调用的大模型信息，AI云服务提供商等设置。
### `.env` 文件
- 存储`maim_message`和 `webui` 的端口和地址。

::: details 如果你使用的是低于0.7.0版本的MaiBot，那么点开这里
### MongoDB 数据库备份与恢复

MongoDB 官方提供了两种主要的备份工具：**mongodump/mongorestore** 和 **文件系统快照**

---

官方备份工具可以在这里下载：[database-tools](https://www.mongodb.com/try/download/database-tools)，下载后解压

把解压后的文件找一个你喜欢的地方放，然后复制到bin文件夹完整路径

然后添加进系统path变量里面

### 1. 使用 `mongodump` 备份数据
`mongodump` 是 MongoDB 官方提供的命令行备份工具，可以将数据导出为 BSON/JSON 格式。
```bash
#无密码
mongodump --uri "mongodb://localhost:27017" --out ./backup
#有密码
mongodump --uri "mongodb://user:passwd@localhost:27017/" --out ./backup
```
这里的`mongodb://localhost:27017`是指你数据库的地址，可以在compass复制

执行完后，会在你调出控制台的地方创建一个backup文件夹，你的数据就在这里

### 2. 使用 `mongorestore` 恢复数据
备份后可用 `mongorestore` 恢复数据：
你需要在上一步的backup文件同目录打开控制台输入此命令即可。
```bash
mongorestore --uri "mongodb://localhost:27017/" --dir ./backup
```

:::