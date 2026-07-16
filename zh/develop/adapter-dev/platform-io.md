---
title: PlatformIO 驱动
---

# PlatformIO 驱动

PlatformIO 驱动是 MaiBot 平台 IO 层的核心抽象。本文档详细介绍驱动的接口定义、核心类型，以及如何实现和注册一个自定义驱动。

## PlatformIODriver 基类

`PlatformIODriver`（定义在 `src/platform_io/drivers/base.py`）是所有平台 IO 驱动必须继承的抽象基类：

::: code-group

```python [Python ~vscode-icons:file-type-python~]
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

:::

### 必须实现的方法

- **`send_message(message, route_key, metadata)`** — 通过具体驱动发送消息，返回 `DeliveryReceipt`。这是唯一必须实现的抽象方法

### 可选覆盖的钩子

- **`start()`** — 启动驱动生命周期（默认空实现）
- **`stop()`** — 停止驱动生命周期（默认空实现）

### 入站消息上报

驱动收到外部平台消息后，需构造 `InboundMessageEnvelope` 并调用 `emit_inbound()` 上报：

::: code-group

```python [Python ~vscode-icons:file-type-python~]
envelope = InboundMessageEnvelope(
    route_key=RouteKey(platform="qq", account_id="123456"),
    driver_id=self.driver_id,
    driver_kind=self.descriptor.kind,
    external_message_id="platform_msg_id",
    session_message=parsed_message,
)
accepted = await self.emit_inbound(envelope)
```

:::

`emit_inbound` 返回 `True` 表示消息被 Broker 接受并继续转发，`False` 表示被拒绝（未配置入站回调或消息被去重过滤）。

## 核心类型

### RouteKey — 路由键

`RouteKey` 是路由决策的唯一键，采用三层结构：

::: code-group

```python [Python ~vscode-icons:file-type-python~]
@dataclass(frozen=True, slots=True)
class RouteKey:
    platform: str                           # 平台名称，如 "qq"、"discord"
    account_id: Optional[str] = None        # 机器人账号 ID
    scope: Optional[str] = None             # 额外路由作用域
```

:::

路由解析遵循**从最具体到最宽泛**的回退顺序：`platform + account_id + scope` → `platform + account_id` → `platform + scope` → `platform`。通过 `resolution_order()` 方法可获取完整回退链：

::: code-group

```python [Python ~vscode-icons:file-type-python~]
key = RouteKey(platform="qq", account_id="123", scope="group_456")
key.resolution_order()
# → [RouteKey("qq", "123", "group_456"), RouteKey("qq", "123", None), RouteKey("qq", None, "group_456"), RouteKey("qq", None, None)]
```

:::

`to_dedupe_scope()` 方法生成跨驱动共享的去重作用域字符串，格式为 `platform:account_id:scope`。

### InboundMessageEnvelope — 入站消息封装

::: code-group

```python [Python ~vscode-icons:file-type-python~]
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

:::

去重键的优先级为：`dedupe_key` > `external_message_id` > `session_message.message_id`。Broker 不会根据 `payload` 内容猜测去重键，以避免将内容相同的不同消息误判为重复。

### DeliveryReceipt — 出站回执

::: code-group

```python [Python ~vscode-icons:file-type-python~]
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

:::

`DeliveryStatus` 枚举值：

- **`PENDING`** — 待发送
- **`SENT`** — 已发送
- **`FAILED`** — 发送失败
- **`DROPPED`** — 已丢弃

### DriverDescriptor — 驱动描述

::: code-group

```python [Python ~vscode-icons:file-type-python~]
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

:::

`DriverKind` 枚举区分驱动来源：`LEGACY` 表示内置驱动，`PLUGIN` 表示插件提供的驱动。

## 实现并注册驱动

### 完整示例

::: code-group

```python [Python ~vscode-icons:file-type-python~]
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

:::

### 注册与路由绑定

::: code-group

```python [Python ~vscode-icons:file-type-python~]
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

:::

Broker 运行中使用 `add_driver` / `remove_driver`，未运行时使用 `register_driver` / `unregister_driver`。路由绑定支持通过 `priority` 字段实现同一路由键下多驱动的优先级排序。
