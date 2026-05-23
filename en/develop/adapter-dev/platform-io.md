---
title: PlatformIO Driver
---

# PlatformIO Driver

PlatformIO driver is the core abstraction of MaiBot's platform IO layer. This document details the driver interface definition, core types, and how to implement and register a custom driver.

## PlatformIODriver Base Class

`PlatformIODriver` (defined in `src/platform_io/drivers/base.py`) is the abstract base class that all platform IO drivers must inherit:

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

### Required Methods

- **`send_message(message, route_key, metadata)`** — Send messages through specific driver, return `DeliveryReceipt`. This is the only abstract method that must be implemented

### Optional Override Hooks

- **`start()`** — Start driver lifecycle (default empty implementation)
- **`stop()`** — Stop driver lifecycle (default empty implementation)

### Inbound Message Reporting

When the driver receives external platform messages, it needs to construct `InboundMessageEnvelope` and call `emit_inbound()` to report:

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

`emit_inbound` returns `True` indicating the message is accepted by Broker and continues forwarding, `False` indicating rejection (inbound callback not configured or message filtered by deduplication).

## Core Types

### RouteKey — Routing Key

`RouteKey` is the unique key for routing decisions, using a three-layer structure:

```python
@dataclass(frozen=True, slots=True)
class RouteKey:
    platform: str                           # Platform name, like "qq", "discord"
    account_id: Optional[str] = None        # Robot account ID
    scope: Optional[str] = None             # Additional routing scope
```

Routing resolution follows **"from most specific to most general"** fallback order: `platform + account_id + scope` → `platform + account_id` → `platform`. You can get the complete fallback chain through the `resolution_order()` method:

```python
key = RouteKey(platform="qq", account_id="123", scope="group_456")
key.resolution_order()
# → [RouteKey("qq", "123", "group_456"), RouteKey("qq", "123", None), RouteKey("qq", None, None)]
```

The `to_dedupe_scope()` method generates a cross-driver shared deduplication scope string, formatted as `platform:account_id:scope`.

### InboundMessageEnvelope — Inbound Message Encapsulation

```python
@dataclass(slots=True)
class InboundMessageEnvelope:
    route_key: RouteKey                                # Inbound routing key
    driver_id: str                                     # Producing driver ID
    driver_kind: DriverKind                            # Driver type
    external_message_id: Optional[str] = None          # Platform-side message ID (for deduplication)
    dedupe_key: Optional[str] = None                   # Explicit deduplication key
    session_message: Optional["SessionMessage"] = None # Normalized message
    payload: Optional[Dict[str, Any]] = None           # Original dictionary payload
    metadata: Dict[str, Any] = field(default_factory=dict)
```

The priority of deduplication keys is: `dedupe_key` > `external_message_id` > `session_message.message_id`. Broker will not guess deduplication keys based on `payload` content to avoid misjudging different messages with the same content as duplicates.

### DeliveryReceipt — Outbound Receipt

```python
@dataclass(slots=True)
class DeliveryReceipt:
    internal_message_id: str                    # Internal message ID
    route_key: RouteKey                         # Delivery routing key
    status: DeliveryStatus                      # Delivery status
    driver_id: Optional[str] = None             # Processing driver ID
    driver_kind: Optional[DriverKind] = None    # Processing driver type
    external_message_id: Optional[str] = None   # Platform-side message ID
    error: Optional[str] = None                 # Error information
    metadata: Dict[str, Any] = field(default_factory=dict)
```

`DeliveryStatus` enumeration values:

- **`PENDING`** — Pending sending
- **`SENT`** — Sent
- **`FAILED`** — Sending failed
- **`DROPPED`** — Dropped

### DriverDescriptor — Driver Description

```python
@dataclass(frozen=True, slots=True)
class DriverDescriptor:
    driver_id: str                                # Globally unique driver ID
    kind: DriverKind                              # Driver type (LEGACY / PLUGIN)
    platform: str                                 # Platform name
    account_id: Optional[str] = None              # Account ID
    scope: Optional[str] = None                   # Routing scope
    plugin_id: Optional[str] = None               # Associated plugin ID
    metadata: Dict[str, Any] = field(default_factory=dict)
```

`DriverKind` enumeration distinguishes driver sources: `LEGACY` indicates built-in drivers, `PLUGIN` indicates drivers provided by plugins.

## Implement and Register Driver

### Complete Example

```python
from src.platform_io.drivers.base import PlatformIODriver
from src.platform_io.types import (
    DeliveryReceipt, DeliveryStatus, DriverDescriptor, DriverKind,
    InboundMessageEnvelope, RouteKey, RouteBinding,
)

class MyDriver(PlatformIODriver):
    async def start(self) -> None:
        # Initialize connection
        self._connection = await connect_to_platform()

    async def stop(self) -> None:
        # Clean up connection
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
from src.platform_io.manager import get_platform_io_manager

manager = get_platform_io_manager()

# Descriptor
descriptor = DriverDescriptor(
    driver_id="my_driver.discord",
    kind=DriverKind.PLUGIN,
    platform="discord",
)

# Register
driver = MyDriver(descriptor)
await manager.add_driver(driver)

# Bind send route
manager.bind_send_route(RouteBinding(
    route_key=descriptor.route_key,
    driver_id=driver.driver_id,
    driver_kind=DriverKind.PLUGIN,
))

# Bind receive route
manager.bind_receive_route(RouteBinding(
    route_key=descriptor.route_key,
    driver_id=driver.driver_id,
    driver_kind=DriverKind.PLUGIN,
))
```

Use `add_driver` / `remove_driver` when Broker is running, use `register_driver` / `unregister_driver` when not running. Route binding supports priority sorting of multiple drivers under the same route key through the `priority` field.
