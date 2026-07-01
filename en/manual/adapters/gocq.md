# MaiBot GoCQ Adapter Documentation

A relatively older framework; some accounts may have a lower probability of risk control on this framework.

## GoCQ Configuration

### Installing GoCQ


First, you need to install GoCQ itself. Some different GoCQ versions are listed below:
[AstralGocq](https://github.com/ProtocolScience/AstralGocq)
[gocq-http(New)](https://github.com/LagrangeDev/go-cqhttp)
Download the corresponding version from the release page of these projects. Installation tutorials are provided here for the Windows version only.

### Configuring GoCQ

After downloading, extract the executable file into a folder.

Double-click to open the GoCQ main program. A prompt will appear asking you to generate a secure startup script; click "Confirm" to generate the script.

Close the GoCQ main program and use the secure startup script to launch GoCQ. You will be asked to select a connection method; select `反向WebSocket`. Once the `config.yml` configuration is generated, close the window.

Open `config.yml` and modify the following configurations:

```yaml
# 连接服务列表
servers:
  # 添加方式，同一连接方式可添加多个，具体配置说明请查看文档
  #- http: # http 通信
  #- ws:   # 正向 Websocket
  #- ws-reverse: # 反向 Websocket
  #- pprof: #性能分析服务器
  # 反向WS设置
  - ws-reverse:
      # 反向WS Universal 地址
      # 注意 设置了此项地址后下面两项将会被忽略
      universal: ws://127.0.0.1:8095
      # 反向WS API 地址
      api: ws://your_websocket_api.server
      # 反向WS Event 地址
      event: ws://your_websocket_event.server
      # 重连间隔 单位毫秒
      reconnect-interval: 3000
      middlewares:
        <<: *default # 引用默认中间件
```

Use the startup script to launch GoCQ and log in by scanning the QR code.

If verification is required, please open the provided link in a browser, press F12, and open the Network tab. Proceed with the verification normally. After completing the verification, wait a few seconds until a success message appears. In your developer tools, click the last request, open the response, copy the value of the `ticket` field, paste it into the GoCQ input box, and press Enter to complete the verification.

## GoCQ Adapter Configuration

### Installing GoCQ Adapter

Clone the [repo](https://github.com/LOGIC-SC/MaiBot-Gocq-Adapter.git) from GitHub, install the dependencies, and then start it using the corresponding environment.

```bash
git clone https://github.com/LOGIC-SC/MaiBot-Gocq-Adapter.git
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple --upgrade
python main.py
```

### Configuring GoCQ Adapter

This Go-CQ Adapter is based on a secondary modification of the Napcat Adapter, and its configuration is similar, so it will not be detailed here.
⚠️ Warning: Unlike the Napcat Adapter, the `Napcat_server` item here has been replaced by the `gocq_server` item following updates to the Napcat Adapter. When upgrading from an old version to a new version, be sure to modify the configuration.