---
title: LLM Provider Integration
---

# LLM Provider Integration

MaiBot separates API providers, model definitions, and task routing. A provider describes how to reach an API; a model selects a provider and model identifier; each task chooses one or more models and its generation limits.

## Built-in clients

The built-in clients cover OpenAI-compatible APIs and Gemini-style APIs. `client_type` selects the implementation. Provider names and model names are references, so spelling and case must remain consistent.

## Extra parameters

`extra_params` passes supported provider-specific options to the client. OpenAI-compatible clients can carry custom headers and request-body values; Gemini uses its native generation configuration. Keep secrets in provider credentials, not in reusable task blocks.

`reasoning_parse_mode` controls how reasoning content is extracted, while `tool_argument_parse_mode` controls tool-call argument decoding. Use non-default modes only when the upstream endpoint requires them.

## Plugin providers and failures

Plugins may register an LLM Provider component for another backend. Its `client_type` must match the provider entry used by models.

Failed requests can be retained as bounded diagnostic snapshots. Review retry limits before enabling aggressive fallback across multiple providers, because each attempt can add latency and cost.

See [Model Configuration](../manual/configuration/model-config.md) and [Model Extra Parameters](../manual/configuration/model-extra-params.md).
