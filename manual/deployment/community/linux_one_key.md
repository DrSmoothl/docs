# MaiBot Linux 一键脚本部署

作者：Astriora



## 使用脚本部署 MaiBot

## 安装wget

::: code-group

```bash [apt]
sudo apt install wget
```

```bash [yum]
sudo yum install wget
```

```bash [dnf]
sudo dnf install wget
```

```bash [pacman]
sudo pacman -S wget
```

```bash [zypper]
sudo zypper install wget
```

:::

## 下载脚本 & 部署

```bash


wget -O maibot-install.sh https://raw.githubusercontent.com/Astriora/Antlia/refs/heads/main/Script/MaiBot/MaiBot-install.sh &&
bash maibot-install.sh


```


## 启动
```bash
source ~/.bashrc #第一次需要更新shell
```
```bash
maibot
```

## 报错解决方案

>如果出现了 `[WARN] uv sync 失败，重试 2/3
  × Failed to build astrbot @ file:///root/
  ├─▶ Failed to install requirements from build-system.requires
  ├─▶ Failed to install build dependencies
  ├─▶ Failed to install: trove_classifiers-2025.9.11.17-py3-none-any.whl
  │   (trove-classifiers==2025.9.11.17)
  ╰─▶ failed to hardlink file from
      /root/.cache/uv/archive-v0/10gPuxc61Audvy1Eg6SFz/trove_classifiers/.l2s.__init__.py0001
      to
      /root/.cache/uv/builds-v0/.tmp2lFVJx/lib/python3.10/site-packages/trove_classifiers/.l2s.__init__.py0001:
      Operation not permitted (os error 1)

可以先运行以下命令，然后再重新启动

>```bash
>echo 'export UV_LINK_MODE=copy' >> ~/.bashrc 
>```
>```bash
>source ~/.bashrc
>```
