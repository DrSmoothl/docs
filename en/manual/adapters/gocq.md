# MaiBot GoCQ Adapter Documentation

A relatively older framework, some accounts may have a lower risk control probability on this framework.

## GoCQ Configuration

### Installing GoCQ

First, you need to install GoCQ itself. Below are some different GoCQ versions:
[AstralGocq](https://github.com/ProtocolScience/AstralGocq)
[gocq-http(New)](https://github.com/LagrangeDev/go-cqhttp)
Download the corresponding version from the release pages of these projects. This tutorial only provides installation instructions for the Windows version.

### Configuring GoCQ

After downloading, extract the executable file into a folder.

Double-click to open the GoCQ application. A prompt box will appear, asking you to generate a secure startup script. Click "Confirm" to generate the startup script.

Close the GoCQ application, and use the secure startup script to start GoCQ. At this point, you will be asked to choose a connection method. Select `Reverse WebSocket`. After the config.yml configuration file is generated, close the window.

Open `config.yml` and modify the following configuration:

```yaml
# Connection service list
servers:
  # Adding methods, multiple can be added for the same connection method. Please refer to the documentation for specific configuration details.
  #- http: # HTTP communication
  #- ws:   # Forward Websocket
  #- ws-reverse: # Reverse Websocket
  #- pprof: # Performance analysis server
  # Reverse WS settings
  - ws-reverse:
      # Reverse WS Universal address
      # Note: After setting this address, the following two items will be ignored
      universal: ws://127.0.0.1:8095
      # Reverse WS API address
      api: ws://your_websocket_api.server
      # Reverse WS Event address
      event: ws://your_websocket_event.server
      # Reconnect interval in milliseconds
      reconnect-interval: 3000
      middlewares:
        <<: *default # Reference default middleware
```

Use the startup script to start GoCQ and scan the QR code to log in.

If verification is required, please open the provided link in a browser, then press F12 to open the Network tab. Proceed with the verification normally. After completing the verification, wait a few seconds, and a verification success message will pop up. At this point, look at your developer tools, click on the bottom-most request, open the response, copy the value of the `ticket` field, paste it into the GoCQ input box, and press Enter to complete the verification.

## GoCQ Adapter Configuration

### Installing GoCQ Adapter

Clone the [repo](https://github.com/LOGIC-SC/MaiBot-Gocq-Adapter.git) from GitHub, install the dependencies, and then start it using the appropriate environment.

```bash
git clone https://github.com/LOGIC-SC/MaiBot-Gocq-Adapter.git
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple --upgrade
python main.py
```

### Configuring GoCQ Adapter

This Go-CQ Adapter is a secondary modification based on the Napcat Adapter, and its configuration is similar to it, so it will not be elaborated here.
Warning: Unlike the Napcat Adapter, the `Napcat_server` item here has been replaced with the `gocq_server` item after following updates from the Napcat Adapter. When upgrading from an older version to a newer version, be sure to modify the configuration accordingly.