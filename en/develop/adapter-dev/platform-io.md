---
title: PlatformIO Driver
---
# PlatformIO Drivers

PlatformIO drivers are the core abstraction of the MaiBot platform I/O layer. This document details the driver interface definitions, core types, and how to implement and register a custom driver.

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

- **`send_message(message, route_key, metadata)`** — Sends a message via the specific driver and returns a `DeliveryReceipt`. This is the only abstract method that must be implemented.

### Optional Hooks to Override

- **`start()`** — Starts the driver lifecycle (default empty implementation)
- **`stop()`** — Stops the driver lifecycle (default empty implementation)

### Inbound Message Reporting

After receiving an external platform message, the driver must construct an `InboundMessageEnvelope` and call `emit_inbound()` to report it:

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

`emit_inbound` returns `True` if the message is accepted by the Broker and continues to be forwarded, and `False` if it is rejected (e.g., no inbound callback is configured or the message is filtered out by deduplication).

## Core Types

### RouteKey — Route Key

`RouteKey` is the unique key for routing decisions, adopting a three-layer structure:

```python
@dataclass(frozen=True, slots=True)
class RouteKey:
    platform: str                           # Platform name, e.g., "qq", "discord"
    account_id: Optional[str] = None        # Bot account ID
    scope: Optional[str] = None             # Additional routing scope
```

Route resolution follows a **most-specific-to-most-general** fallback order: `platform + account_id + scope` → `platform + account_id` → `platform + scope` → `platform`. The complete fallback chain can be obtained via the `resolution_order()` method:

```python
key = RouteKey(platform="qq", account_id="123", scope="group_456")
key.resolution_order()
# → [RouteKey("qq", "123", "group_456"), RouteKey("qq", "123", None), RouteKey("qq", None, "group_456"), RouteKey("qq", None, None)]
```

The `to_dedupe_scope()` method generates a deduplication scope string shared across drivers, formatted as `platform:account_id:scope`.

### InboundMessageEnvelope — Inbound Message Envelope

```python
@dataclass(slots=True)
class InboundMessageEnvelope:
    route_key: RouteKey                                # Inbound route key
    driver_id: str                                     # ID of the producing driver
    driver_kind: DriverKind                            # Driver type
    external_message_id: Optional[str] = None          # Platform-side message ID (for deduplication)
    dedupe_key: Optional[str] = None                   # Explicit deduplication key
    session_message: Optional["SessionMessage"] = None # Normalized message
    payload: Optional[Dict[str, Any]] = None           # Raw dictionary payload
    metadata: Dict[str, Any] = field(default_factory=dict)
```

The priority for the deduplication key is: `dedupe_key` > `external_message_id` > `session_message.message_id`. The Broker will not guess the deduplication key based on `payload` content to avoid misclassifying distinct messages with identical content as duplicates.

### DeliveryReceipt — Outbound Receipt

```python
@dataclass(slots=True)
class DeliveryReceipt:
    internal_message_id: str                    # Internal message ID
    route_key: RouteKey                         # Delivery route key
    status: DeliveryStatus                      # Delivery status
    driver_id: Optional[str] = None             # ID of the processing driver
    driver_kind: Optional[DriverKind] = None    # Type of the processing driver
    external_message_id: Optional[str] = None   # Platform-side message ID
    error: Optional[str] = None                 # Error message
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
    driver_id: str                                # Globally unique driver ID
    kind: DriverKind                              # Driver type (LEGACY / PLUGIN)
    platform: str                                 # Platform name
    account_id: Optional[str] = None              # Account ID
    scope: Optional[str] = None                   # Routing scope
    plugin_id: Optional[str] = None               # Associated plugin ID
    metadata: Dict[str, Any] = field(default_factory=dict)
```

The `DriverKind` enum distinguishes driver sources: `LEGACY` indicates a built-in driver, while `PLUGIN` indicates a driver provided by a plugin.

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
from maibot.src.platform_io.manager import get_platform_io_manager

manager = get_platform_io_manager()

# Descriptor
descriptor = DriverDescriptor(
    driver_id="my_driver.discord",
    kind=DriverKind.PLUGIN,
    platform="discord",
)

# Registration
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

Use `add_driver` / `remove_driver` when the Broker is running, and `register_driver` / `unregister_driver` when it is not running. Route binding supports priority ordering of multiple drivers under the same route key via the `priority` field.