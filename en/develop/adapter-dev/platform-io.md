---
title: PlatformIO Drivers
---# PlatformIO Driver

The PlatformIO driver is the core abstraction of the MaiBot platform's IO layer. This document details the driver's interface definitions, core types, and how to implement and register a custom driver.

## PlatformIODriver Base Class

`PlatformIODriver` (defined in `src/platform_io/drivers/base.py`) is the abstract base class that all platform IO drivers must inherit from:

```python
class PlatformIODriver(ABC):
    def __init__(self, descriptor: DriverDescriptor) -> None: ...

    @property
    def descriptor(self) -> DriverDescriptor: ...

    @property
    def driver_id(self) -> str: ...

    def set_inbound_handler(self, handler: InboundHandler) -> None: ...
    def clear_inbound_handler(self) -> None: ...

    async def emit_inbound(self, envelope: InboundMessageEnvelope) -> bool: ...
    async def start(self) -> None: ...
    async def stop(self) -> None: ...

    @abstractmethod
    async def send_message(
        self, message: "SessionMessage", route_key: RouteKey, metadata: Optional[Dict[str, Any]] = None
    ) -> DeliveryReceipt: ...
```

### Methods That Must Be Implemented

- **`send_message(message, route_key, metadata)`** — Sends a message via the specific driver and returns `DeliveryReceipt`. This is the only abstract method that must be implemented.

### Optional Override Hooks

- **`start()`** — Starts the driver lifecycle (default empty implementation).
- **`stop()`** — Stops the driver lifecycle (default empty implementation).

### Inbound Message Reporting

After a driver receives an external platform message, it needs to construct an `InboundMessageEnvelope` and call `emit_inbound()` to report it:

```python
envelope = InboundMessageEnvelope(
    route_key=RouteKey(platform="qq", account_id="123456"),
    driver_id=self.driver_id,
    driver_kind=self.descriptor.kind,
    external_message_id="platform_msg_id",
    session_message=parsed_message,
)
accepted = await self.emit_inbound(envelope)
```

`emit_inbound` returns `True` indicating the message was accepted by the Broker and will be forwarded, and `False` indicating it was rejected (no inbound callback configured or message filtered by deduplication).

## Core Types

### RouteKey — Routing Key

`RouteKey` is the unique key for routing decisions, employing a three-layer structure:

```python
@dataclass(frozen=True, slots=True)
class RouteKey:
    platform: str                           # 平台名称，如 "qq"、"discord"
    account_id: Optional[str] = None        # 机器人账号 ID
    scope: Optional[str] = None             # 额外路由作用域
```

Route resolution follows a fallback order from **most specific to broadest**: `platform + account_id + scope` → `platform + account_id` → `platform + scope` → `platform`. The full fallback chain can be obtained via the `resolution_order()` method:

```python
key = RouteKey(platform="qq", account_id="123", scope="group_456")
key.resolution_order()
# → [RouteKey("qq", "123", "group_456"), RouteKey("qq", "123", None), RouteKey("qq", None, "group_456"), RouteKey("qq", None, None)]
```

The `to_dedupe_scope()` method generates a deduplication scope string shared across drivers, formatted as `platform:account_id:scope`.

### InboundMessageEnvelope — Inbound Message Wrapper

```python
@dataclass(slots=True)
class InboundMessageEnvelope:
    route_key: RouteKey                                # 入站路由键
    driver_id: str                                     # 产出驱动的 ID
    driver_kind: DriverKind                            # 驱动类型
    external_message_id: Optional[str] = None          # 平台侧消息 ID（用于去重）
    dedupe_key: Optional[str] = None                   # 显式去重键
    session_message: Optional["SessionMessage"] = None # 已规范化的消息
    payload: Optional[Dict[str, Any]] = None           # 原始字典载荷
    metadata: Dict[str, Any] = field(default_factory=dict)
```

The priority of the deduplication key is: `dedupe_key` > `external_message_id` > `session_message.message_id`. The Broker will not guess the guess the deduplication key based on `payload` content to avoid misidentifying different messages with identical content as duplicates.

### DeliveryReceipt — Outbound Receipt

```python
@dataclass(slots=True)
class DeliveryReceipt:
    internal_message_id: str                    # 内部消息 ID
    route_key: RouteKey                         # 投递路由键
    status: DeliveryStatus                      # 投递状态
    driver_id: Optional[str] = None             # 处理驱动的 ID
    driver_kind: Optional[DriverKind] = None    # 处理驱动的类型
    external_message_id: Optional[str] = None   # 平台侧消息 ID
    error: Optional[str] = None                 # 错误信息
    metadata: Dict[str, Any] = field(default_factory=dict)
```

`DeliveryStatus` enum values:

- **`PENDING`** — Pending
- **`SENT`** — Sent
- **`FAILED`** — Failed
- **`DROPPED`** — Dropped

### DriverDescriptor — Driver Descriptor

```python
@dataclass(frozen=True, slots=True)
class DriverDescriptor:
    driver_id: str                                # 全局唯一驱动 ID
    kind: DriverKind                              # 驱动类型（LEGACY / PLUGIN）
    platform: str                                 # 平台名称
    account_id: Optional[str] = None              # 账号 ID
    scope: Optional[str] = None                   # 路由作用域
    plugin_id: Optional[str] = None               # 关联的插件 ID
    metadata: Dict[str, Any] = field(default_factory=dict)
```

The `DriverKind` enum distinguishes the driver source: `LEGACY` indicates a built-in driver, and `PLUGIN` indicates a driver provided by a plugin.

## Implementing and Registering a Driver

### Complete Example

```python
from maibot.src.platform_io.drivers.base import PlatformIODriver
from maibot.src.platform_io.types import (
    DeliveryReceipt, DeliveryStatus, DriverDescriptor, DriverKind,
    InboundMessageEnvelope, RouteKey, RouteBinding,
)

class MyDriver(PlatformIODriver):
    async def start(self) -> None:
        # 初始化连接
        self._connection = await connect_to_platform()

    async def stop(self) -> None:
        # 清理连接
        await self._connection.close()

    async def send_message(self, message, route_key, metadata=None):
        try:
            platform_msg_id = await self._connection.send(
                target=route_key.account_id,
                content=message.plain_text,
            )
            return DeliveryReceipt(
                internal_message_id=message.message_id,
                route_key=route_key,
                status=DeliveryStatus.SENT,
                driver_id=self.driver_id,
                driver_kind=self.descriptor.kind,
                external_message_id=platform_msg_id,
            )
        except Exception as exc:
            return DeliveryReceipt(
                internal_message_id=message.message_id,
                route_key=route_key,
                status=DeliveryStatus.FAILED,
                driver_id=self.driver_id,
                driver_kind=self.descriptor.kind,
                error=str(exc),
            )
```

### Registration and Route Binding

```python
from maibot.src.platform_io.manager import get_platform_io_manager

manager = get_platform_io_manager()

# 描述符
descriptor = DriverDescriptor(
    driver_id="my_driver.discord",
    kind=DriverKind.PLUGIN,
    platform="discord",
)

# 注册
driver = MyDriver(descriptor)
await manager.add_driver(driver)

# 绑定发送路由
manager.bind_send_route(RouteBinding(
    route_key=descriptor.route_key,
    driver_id=driver.driver_id,
    driver_kind=DriverKind.PLUGIN,
))

# 绑定接收路由
manager.bind_receive_route(RouteBinding(
    route_key=descriptor.route_key,
    driver_id=driver.driver_id,
    driver_kind=DriverKind.PLUGIN,
))
```

Use `add_driver` / `remove_driver` when the Broker is running, and `register_driver` / `unregister_driver` when it is not. Route binding supports priority sorting of multiple drivers under the same route key via the `priority` field.