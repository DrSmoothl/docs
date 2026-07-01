---
title: Adapter Development Guide
---# Adapter Development Guide

MaiBot's Adapters are bridging components that connect external messaging platforms (such as QQ, Discord, Telegram, etc.) with the MaiBot core. This document introduces the Platform IO architecture and how to develop new platform adapters.

## Architecture Overview

MaiBot's Platform IO layer (`src/platform_io/`) adopts a three-layer architecture consisting of **Driver Abstraction + Route Table + Broker Manager**:

```
外部平台消息 ──→ [驱动 Driver] ──→ [Broker Manager] ──→ 核心处理链
                    │                    │
                    │  InboundMessage    │  路由查找 + 去重
                    │  Envelope          │
                    │                    │
核心处理链 ──→ [Broker Manager] ──→ [驱动 Driver] ──→ 外部平台
                    │
                    │  RouteKey 解析
                    │  多驱动广播
```

Core Components:

- **PlatformIODriver**: The driver abstraction base class that defines the contract for sending and receiving messages.
- **PlatformIOManager**: The Broker manager that uniformly coordinates routing, deduplication, and state tracking.
- **RouteTable**: The route binding table that maintains the mapping from RouteKey to drivers.
- **DriverRegistry**: The driver registry that manages registered driver instances.

## Choosing an Adapter Development Mode

MaiBot provides two ways to develop adapters:

**@MessageGateway (Plugin-based)**
  : Registered via the `@MessageGateway` component decorator and runs as a plugin within the Plugin Runtime.
  : Use cases: Independently deployed adapter plugins, requirements for cross-platform reuse, or when source code modification of MaiBot is not desired.
  : import: `from maibot.src.plugin_runtime.components import MessageGateway`
  : See [MessageGateway Development Guide](../plugin-dev/message-gateway) for details.

**PlatformIODriver (Driver-based)**
  : Directly implements the `PlatformIODriver` interface and is registered into MaiBot's Platform IO system.
  : Use cases: Built-in adapters, requirements for deep integration, or adapters released alongside MaiBot.
  : import: `from maibot.src.platform_io.types import PlatformIODriver`
  : See [Platform IO Development Guide](platform-io) for details.

## maim-message Integration

MaiBot uses [maim-message](https://github.com/Mai-with-u/maim_message) as the unified message format standard. `MessageServer` is the message middleware provided by maim-message, responsible for passing messages between the platform adapter and MaiBot.

### Message Segments (Seg)

The core message type in maim-message is `Seg` (Message Segment). Every message consists of one or more `Seg`:

```python
from maim_message import Seg

# 文本消息段
text_seg = Seg(type="text", data="你好")

# 图片消息段
image_seg = Seg(type="image", data={"file": "xxx.jpg"})
```

### Legacy Driver

MaiBot includes a built-in `LegacyPlatformDriver`, which encapsulates the communication logic with the maim-message MessageServer and serves as the default platform driver. When you configure connection information for platforms like QQ via `bot_config.toml`, the Host will automatically create and register the Legacy driver.

## How to Create a New Adapter

### 1. Inherit PlatformIODriver

A new adapter needs to inherit from the `PlatformIODriver` abstract base class in `src/platform_io/drivers/base.py`:

```python
from src.platform_io.drivers.base import PlatformIODriver
from src.platform_io.types import DeliveryReceipt, DeliveryStatus, DriverDescriptor, DriverKind, RouteKey

class MyPlatformDriver(PlatformIODriver):
    async def send_message(self, message, route_key, metadata=None):
        # 实现消息发送逻辑
        ...
        return DeliveryReceipt(
            internal_message_id=message.message_id,
            route_key=route_key,
            status=DeliveryStatus.SENT,
            driver_id=self.driver_id,
            driver_kind=self.descriptor.kind,
        )
```

### 2. Implement start/stop Lifecycle

```python
async def start(self) -> None:
    # 初始化连接、启动监听等
    await self._connect()

async def stop(self) -> None:
    # 断开连接、清理资源
    await self._disconnect()
```

### 3. Report Inbound Messages

When the adapter receives an inbound message from an external platform, report it to the Broker via the `emit_inbound` method:

```python
from src.platform_io.types import InboundMessageEnvelope, DriverKind

envelope = InboundMessageEnvelope(
    route_key=RouteKey(platform="my_platform", account_id="bot_001"),
    driver_id=self.driver_id,
    driver_kind=DriverKind.PLUGIN,
    external_message_id="msg_12345",
    session_message=session_msg,  # 已规范化的 SessionMessage
)

accepted = await self.emit_inbound(envelope)
```

### 4. Register the Driver

Register the driver and bind routes via `PlatformIOManager`:

```python
from src.platform_io.manager import get_platform_io_manager
from src.platform_io.types import DriverDescriptor, DriverKind, RouteBinding

manager = get_platform_io_manager()

# 创建驱动描述
descriptor = DriverDescriptor(
    driver_id="plugin.my_adapter.qq",
    kind=DriverKind.PLUGIN,
    platform="qq",
    account_id="123456",
    plugin_id="my_adapter",
)

# 创建驱动实例并注册
driver = MyPlatformDriver(descriptor)
await manager.add_driver(driver)

# 绑定路由
manager.bind_send_route(RouteBinding(
    route_key=descriptor.route_key,
    driver_id=driver.driver_id,
    driver_kind=DriverKind.PLUGIN,
))
manager.bind_receive_route(RouteBinding(
    route_key=descriptor.route_key,
    driver_id=driver.driver_id,
    driver_kind=DriverKind.PLUGIN,
))
```

## Plugin Message Gateway Driver

For plugin developers, MaiBot provides `PluginPlatformDriver` (defined in `src/platform_io/drivers/plugin_driver.py`), which implements sending and receiving capabilities via IPC calls to the message gateway component in the plugin Runner, eliminating the need to operate the underlying driver API directly.

See the [PlatformIO Driver](./platform-io.md) page for more details.