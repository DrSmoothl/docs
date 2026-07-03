---
title: Adapter Development Guide
---
# Adapter Development Guide

MaiBot's Adapter refers to the bridging component that connects external messaging platforms (such as QQ, Discord, Telegram, etc.) with the MaiBot core. This document introduces the Platform IO architecture and how to develop new platform adapters.

## Architecture Overview

The platform IO layer of MaiBot (`src/platform_io/`) adopts a three-tier architecture consisting of **Driver Abstraction + Routing Table + Broker Manager**:

```
External Platform Messages ──→ [Driver] ──→ [Broker Manager] ──→ Core Processing Chain
                                    │                    │
                                    │  InboundMessage    │  Routing Lookup + Deduplication
                                    │  Envelope          │
                                    │                    │
Core Processing Chain ──→ [Broker Manager] ──→ [Driver] ──→ External Platform
                                    │
                                    │  RouteKey Parsing
                                    │  Multi-Driver Broadcasting
```

Core Components:

- **PlatformIODriver**: Driver abstract base class, defining the contract for sending and receiving messages
- **PlatformIOManager**: Broker manager, unifying coordination of routing, deduplication, and state tracking
- **RouteTable**: Routing binding table, maintaining the mapping from RouteKey to drivers
- **DriverRegistry**: Driver registry, managing registered driver instances

## Choosing an Adapter Development Mode

MaiBot provides two adapter development approaches:

**@MessageGateway (Plugin-based)**
  : Registered via the `@MessageGateway` component decorator, running as a plugin within the Plugin Runtime.
  : Applicable scenarios: Independently deployed adapter plugins, cross-platform reuse, no need to modify MaiBot source code.
  : import: `from maibot.src.plugin_runtime.components import MessageGateway`
  : See [MessageGateway Development Guide](../../plugin/message-gateway) for details.

**PlatformIODriver (Driver-based)**
  : Directly implements the `PlatformIODriver` interface and registers with MaiBot's Platform IO system.
  : Applicable scenarios: Built-in adapters, deep integration, released together with MaiBot.
  : import: `from maibot.src.platform_io.types import PlatformIODriver`
  : See [Platform IO Development Guide](platform-io) for details.

## maim-message Integration

MaiBot uses [maim-message](https://github.com/Mai-with-u/maim_message) as the unified message format standard. `MessageServer` is the message middleware provided by maim-message, responsible for relaying messages between platform adapters and MaiBot.

### Message Segments (Seg)

The core message type in maim-message is `Seg` (Message Segment). Each message consists of one or more `Seg`:

```python
from maim_message import Seg

# Text message segment
text_seg = Seg(type="text", data="Hello")

# Image message segment
image_seg = Seg(type="image", data={"file": "xxx.jpg"})
```

### Legacy Driver

MaiBot includes `LegacyPlatformDriver`, which encapsulates the communication logic with the maim-message MessageServer, serving as the default platform driver. After you configure connection information for platforms like QQ in `bot_config.toml`, the Host will automatically create and register the Legacy driver.

## How to Create a New Adapter

### 1. Inherit PlatformIODriver

The new adapter must inherit the `PlatformIODriver` abstract base class from `src/platform_io/drivers/base.py`:

```python
from src.platform_io.drivers.base import PlatformIODriver
from src.platform_io.types import DeliveryReceipt, DeliveryStatus, DriverDescriptor, DriverKind, RouteKey

class MyPlatformDriver(PlatformIODriver):
    async def send_message(self, message, route_key, metadata=None):
        # Implement message sending logic
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
    # Initialize connection, start listening, etc.
    await self._connect()

async def stop(self) -> None:
    # Disconnect, clean up resources
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
    session_message=session_msg,  # Normalized SessionMessage
)

accepted = await self.emit_inbound(envelope)
```

### 4. Register the Driver

Register the driver and bind routes via `PlatformIOManager`:

```python
from src.platform_io.manager import get_platform_io_manager
from src.platform_io.types import DriverDescriptor, DriverKind, RouteBinding

manager = get_platform_io_manager()

# Create driver descriptor
descriptor = DriverDescriptor(
    driver_id="plugin.my_adapter.qq",
    kind=DriverKind.PLUGIN,
    platform="qq",
    account_id="123456",
    plugin_id="my_adapter",
)

# Create driver instance and register
driver = MyPlatformDriver(descriptor)
await manager.add_driver(driver)

# Bind routes
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

For plugin developers, MaiBot provides `PluginPlatformDriver` (defined in `src/platform_io/drivers/plugin_driver.py`), which implements send and receive capabilities by invoking the message gateway component within the Plugin Runner via IPC, without requiring direct interaction with the underlying driver APIs.

See the [PlatformIO Drivers](./platform-io.md) page for details.