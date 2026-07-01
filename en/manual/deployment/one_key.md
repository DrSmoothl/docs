# One-key Package Deployment Tutorial

## Disclaimer:
- **This tutorial is for assistance only. The author assumes no responsibility if your account is banned due to violation of the platform's official rules or if any other losses occur.**

<br><br>
### Suggestion: If you encounter problems you don't understand, make good use of search engines (such as Bing/Baidu) to find answers, or seek help from <u>[DeepSeek](https://chat.deepseek.com/)</u>, or ask in the group.
You can also browse: [FAQ](https://www.kdocs.cn/l/ctOGhVv6L8Yq)

![Asking DeepSeek](/images/onekey/onekey_00.png)
(Include the link to this document, remember to enable `深度思考` and `联网搜索` as shown in the image, and ask DeepSeek about log issues)
> https://docs.mai-mai.org/manual/deployment/
>
>Referring to the help document above, please help me analyze the following logs

## Preparation
- Ensure your system version is at least Windows 10 (If your system is Win7 or lower, you can give up now)
- Prepare a downloaded One-key package (can be obtained from group files or GitHub; we use version 0.3.2 full for this demonstration. Due to version updates, the interface may change; please refer to the interface you see)

>The lite version does not include Python dependencies and requires manual installation within the software later. The installation path is Settings -> Module Update

- Assuming you have successfully obtained the installation package, as shown in the image, right-click the file and select "Open file location"
![](/images/onekey/onekey_01.webp)
![](/images/onekey/onekey_02.webp)
![](/images/onekey/onekey_03.webp)
![](/images/onekey/onekey_04.webp)

- Double-click to install, then click Next, Next, Next... (After installation, the home page should look something like this)
![](/images/onekey/onekey_05.webp)

- Next, click `更新` to update MaiBot to the latest beta version (1.0.0)
![](/images/onekey/onekey_06.webp)
![](/images/onekey/onekey_07.webp)

- Click `开始更新` to update the local version to the latest (it is already updated here)

## Connecting to QQ
- Next, let's connect to QQ. Click `新增平台`
![](/images/onekey/onekey_08.webp)

- I am using NapCat for this demonstration. It is recommended to register a secondary QQ account for the bot
![](/images/onekey/onekey_08.webp)

## (<font color=red>! WARNING !</font>: Setting up a bot may carry the risk of your QQ <font color=red> being flagged by risk control or even being banned</font>!! Do NOT use your main account!! Do NOT use your daily QQ account!!)

- Enter the QQ number you prepared for the bot, then click "Configure and Start"
![](/images/onekey/onekey_09.webp)

- This interface will then pop up. Don't rush to configure the whitelist; we will do that in the Web UI later. First, click `保存并关闭` in the bottom right corner
![](/images/onekey/onekey_10.webp)

- Then we click "Terminal"
![](/images/onekey/onekey_11.webp)

- Click NapCat, open mobile QQ, switch to the bot's QQ account, and scan the QR code to log in
- Switch back to the MaiBot page and follow the first-time configuration wizard to complete the setup (you can also click the button on the right to open the Web UI in your browser)

![](/images/onekey/onekey_16.webp)

## Great! We have completed the one-key package configuration. Next is making our bot capable of receiving messages normally
**(This assumes you have successfully configured the model in "Model Management". For how to configure model providers, please search for tutorials online; for how to configure model functions, please refer to the [FAQ](https://www.kdocs.cn/l/ctOGhVv6L8Yq))**

- We need to configure the NapCat whitelist. First, click "Plugin Management"
![](/images/onekey/onekey_12.webp)
- Click the "Napcat_Adapter" adapter
![](/images/onekey/onekey_13.webp)
- Click "Add Item" and enter the group number or user QQ number. In "whitelist" mode, the bot can only receive messages from group chats or private chats in the list. In "blacklist" mode, it blocks group chats or private chats in the list
- It is recommended to first use another account to add the bot's QQ as a friend for testing. Add more to the whitelist once functions are working normally
![](/images/onekey/onekey_14.webp)
- Finally, don't forget to save the plugin settings
![](/images/onekey/onekey_15.webp)

- Next, you can check the logs in WebUI -> Log Viewer (the left menu is scrollable, scroll down if you don't see it) or Software -> Terminal -> MaiBot Core. If the log shows `统一 WebSocket 客户端已连接` and messages are successfully received, it means NapCat is connected successfully

- ### Finally, welcome to start your MaiBot journey!