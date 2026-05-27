# 一键包部署教程

## 免责声明:
- **本教程仅供帮助，如果您的账号因违反平台官方规则被封禁或造成其他损失，本教程不承担任何责任**

<br><br>
### 建议：如果你遇到不懂的问题，善用搜索引擎（比如必应/百度）寻找答案，或者向 <u>[DeepSeek](https://chat.deepseek.com/)</u> 寻求帮助，或进群询问
还可以翻阅:[常见问题](https://www.kdocs.cn/l/ctOGhVv6L8Yq)

![询问 DeepSeek](/public/images/onekey/onekey_00.png)
（带上本文档的链接，记得开`深度思考`和`联网搜索`，如图,向DeepSeek询问日志问题）
> https://docs.mai-mai.org/manual/deployment/
>
>参考上面的帮助文档，帮我看看下面的日志

## 准备工作  
- 确保你的系统版本至少为 Windows 10 (如果你的系统版本是 Win7 ，甚至更低，那么现在可以放弃了)
- 准备好一份已经下载好的一键（Onekey）包（可以从群文件或 Github 获取，这里我们用 0.3.2 full 版本进行演示（由于版本更新可能导致界面变化，以你看到的界面为准）

>lite 版本不带Python依赖，需要稍后在软件内自行安装，安装位置为 设置-模块更新

- 假设你此时已经成功获取了安装包，如图，右键文件，选择打开所在文件夹
![](/public/images/onekey/onekey_01.webp)
![](/public/images/onekey/onekey_02.webp)
![](/public/images/onekey/onekey_03.webp)
![](/public/images/onekey/onekey_04.webp)

- 双击安装，然后点击下一步下一步下一步……（安装好后，首页大概长这样）
![](/public/images/onekey/onekey_05.webp)

- 接下来，点击 `更新` ，让 MaiBot 更新到最新测试版（1.0.0）
![](/public/images/onekey/onekey_06.webp)
![](/public/images/onekey/onekey_07.webp)

- 点击 `开始更新` ，把本地版本更新到最新版（我这里是已经更新好了）

## 接入QQ
- 接下来让我们连接到QQ，点击 `新增平台` 
![](/public/images/onekey/onekey_08.webp)

- 我这里用 NapCat 进行演示，建议为机器人注册一个QQ小号
![](/public/images/onekey/onekey_08.webp)

## （<font color=red>！警告！</font>：搭建机器人可能导致QQ<font color=red>被风控、甚至被封禁</font>的风险！！不要使用大号！！不要使用日常使用的QQ账号！！）

- 填入你准备好的，机器人使用的QQ号，填完后点击配置并启动
![](/public/images/onekey/onekey_09.webp)

- 然后就会弹出这个界面，先不急着配置白名单，待会在 Web UI 中配置，我们先点击右下角的 `保存并关闭`
![](/public/images/onekey/onekey_10.webp)

- 然后我们点击终端
![](/public/images/onekey/onekey_11.webp)

- 再点击 NapCat,打开手机QQ，切换到机器人使用的QQ号，扫码登录
- 切换到 MaiBot 页面，跟随首次配置向导完成配置（也可以点击右侧按钮，在浏览器里打开 Web UI ）

![](/public/images/onekey/onekey_16.webp)

## 很好！我们已经完成了一键包的配置，接下来是让我们的机器人能够正常接收消息
**（这里假设你已经成功在 模型管理 里配置好模型，关于如何配置模型厂商，请自行上网搜索教程；关于如何配置模型功能，请参考[常见问题](https://www.kdocs.cn/l/ctOGhVv6L8Yq)）**

- 我们需要配置 Napcat 白名单，先点击插件管理
![](/public/images/onekey/onekey_12.webp)
- 点击 Napcat_Adapter 适配器
![](/public/images/onekey/onekey_13.webp)
- 点添加项目，填入群号或用户QQ号，白名单（whitelist）模式下，机器人只能接收到 列表内 的群聊或私聊，黑名单（blacklist）模式则是屏蔽 列表内 群聊或私聊
- 建议先拿另一个号加机器人的QQ为好友进行测试，功能正常后再添加更多白名单
![](/public/images/onekey/onekey_14.webp)
- 最后不要忘记保存插件设置
![](/public/images/onekey/onekey_15.webp)

- 接下来可以在 WebUI-日志查看器（左边的菜单是可以滚动的，没看到记得往下滑） 或 软件-终端-MaiBot Core 里查看日志，如果日志里显示 `统一 WebSocket 客户端已连接` ,并成功接收到消息，说明 NapCat 连接成功

- ### 最后，欢迎开始你的 MaiBot 之旅！