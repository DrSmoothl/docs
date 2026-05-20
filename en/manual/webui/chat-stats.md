---
title: Chat and Statistics
---

# Chat and Statistics

WebUI's chat and statistics module includes built-in chat rooms, chat history, statistics dashboard, and data management functions for character information, expression methods, jargon, and emojis. These functions are distributed across multiple route modules.

## Built-in Chat Room

WebUI provides an independent chat room where you can directly chat with MaiMai on the web page. The chat room uses independent platform identifiers (`WEBUI_CHAT_PLATFORM`) and group ID (`WEBUI_CHAT_GROUP_ID`), isolated from external platform messages.

| Endpoint | Description |
|----------|-------------|
| `GET /api/chat/history` | Get chat history records |
| `GET /api/chat/platforms` | Get available platform list |
| `GET /api/chat/persons` | Get user list for specified platform |
| `DELETE /api/chat/history` | Clear chat history records |
| `GET /api/chat/info` | Get chat room information |

### Chat History

`GET /api/chat/history` supports the following parameters:
- `limit`: Number of messages to return (1-200, default 50)
- `group_id`: Specify group ID (defaults to WebUI chat room group)

### Chat Room Information

`GET /api/chat/info` returns basic information about the current chat room:
- `bot_name`: Robot nickname
- `platform`: WebUI platform identifier
- `group_id`: Chat room group ID
- `active_sessions`: Number of currently active WebSocket connections

## Statistics Dashboard

The statistics module provides visual statistics for model usage, costs, Token consumption, and other data.

| Endpoint | Description |
|----------|-------------|
| `GET /statistics/dashboard` | Get complete dashboard data |
| `GET /statistics/summary` | Get statistics summary |
| `GET /statistics/models` | Get model dimension statistics |

### Dashboard Data

`GET /statistics/dashboard` accepts `hours` parameter (default 24) and returns the following data:

**Summary Statistics (StatisticsSummary)**:

| Metric | Description |
|--------|-------------|
| `total_requests` | Total number of requests |
| `total_cost` | Total cost |
| `total_tokens` | Total number of tokens |
| `online_time` | Online time (seconds) |
| `total_messages` | Total number of messages |
| `total_replies` | Total number of replies |
| `avg_response_time` | Average response time |
| `cost_per_hour` | Cost per hour |
| `tokens_per_hour` | Tokens per hour |

**Model Statistics**: Aggregate requests, costs, tokens, and average response time by model, returning up to the top 10 models.

**Time Series**:
- `hourly_data`: Hourly data (within specified time range)
- `daily_data`: Daily data (last 7 days)

Each time point contains three metrics: `requests`, `cost`, `tokens`, and missing time periods will be filled with zeros.

**Recent Activity**: The last 10 model call records, including time, model, request type, token count, cost, and response time.

## Character Information Management

The character information module manages all user data that MaiBot knows.

| Endpoint | Description |
|----------|-------------|
| `GET /person/list` | Get character list (pagination, search, filtering) |
| `GET /person/{person_id}` | Get character details |
| `PATCH /person/{person_id}` | Incrementally update character information |
| `DELETE /person/{person_id}` | Delete character |
| `GET /person/stats/summary` | Get character statistics summary |
| `POST /person/batch/delete` | Batch delete characters |

### List Query Parameters

`GET /person/list` supports the following filter conditions:
- `page` / `page_size`: Pagination (1-100 items per page)
- `search`: Search keywords (match name, nickname, user ID)
- `is_known`: Filter by whether known
- `platform`: Filter by platform

### Character Information Fields

| Field | Description |
|-------|-------------|
| `person_id` | Character unique ID |
| `person_name` | Name |
| `nickname` | Nickname |
| `platform` | Belonging platform |
| `user_id` | Platform user ID |
| `is_known` | Whether known |
| `memory_points` | Memory points |
| `know_times` | Number of times known |
| `know_since` | First known time |
| `last_know` | Last interaction time |
| `group_nick_name` | List of group nicknames |

### Statistics Summary

`GET /person/stats/summary` returns the following data:
- `total`: Total number of people
- `known`: Number of known people
- `unknown`: Number of unknown people
- `platforms`: Distribution of people by platform

Incremental updates (`PATCH`) only update submitted fields and automatically update `last_known_time`.

## Expression Method Management

Expression methods record MaiBot's speaking style in different scenarios.

| Endpoint | Description |
|----------|-------------|
| `GET /expression/chats` | Get chat list (for dropdown selection) |
| `GET /expression/list` | Get expression method list |
| `GET /expression/{expression_id}` | Get expression method details |
| `POST /expression/` | Create expression method |
| `PATCH /expression/{expression_id}` | Incrementally update expression method |
| `DELETE /expression/{expression_id}` | Delete expression method |
| `POST /expression/batch/delete` | Batch delete |
| `GET /expression/stats/summary` | Get statistics |

### Expression Method Fields

| Field | Description |
|-------|-------------|
| `situation` | Scenario description (when to use this expression) |
| `style` | Expression style (specific speaking style) |
| `chat_id` | Belonging chat session |
| `last_active_time` | Last active time |
| `create_date` | Creation time |

### Review Function

| Endpoint | Description |
|----------|-------------|
| `GET /expression/review/stats` | Get review statistics |
| `GET /expression/review/list` | Get review list |
| `POST /expression/review/batch` | Batch review |

The review list supports filtering by `unchecked` (unchecked), `passed` (passed), `rejected` (rejected), `all` (all).

## Jargon Management

The jargon module manages network terms and niche circle terminology that MaiBot has learned.

| Endpoint | Description |
|----------|-------------|
| `GET /jargon/chats` | Get chat list with jargon records |
| `GET /jargon/list` | Get jargon list |
| `GET /jargon/{jargon_id}` | Get jargon details |
| `GET /jargon/stats/summary` | Get statistics |
| `POST /jargon/` | Create jargon |
| `PATCH /jargon/{jargon_id}` | Incrementally update jargon |
| `DELETE /jargon/{jargon_id}` | Delete jargon |
| `POST /jargon/batch/delete` | Batch delete |
| `POST /jargon/batch/set-jargon` | Batch set jargon confirmation status |

### Jargon Fields

| Field | Description |
|-------|-------------|
| `content` | Jargon content |
| `raw_content` | Raw content |
| `meaning` | Meaning explanation |
| `chat_id` | Belonging chat |
| `is_jargon` | Whether confirmed as jargon (`true` / `false` / `null` pending confirmation) |
| `is_complete` | Whether information is complete |
| `inference_with_context` | Inference result with context |
| `inference_content_only` | Inference result with content only |
| `count` | Usage count |

### List Query

`GET /jargon/list` supports:
- `search`: Search keywords (match content, meaning, raw content)
- `chat_id`: Filter by chat
- `is_jargon`: Filter by confirmation status (`true` / `false` / not passed for all)

### Statistics Summary

`GET /jargon/stats/summary` returns:
- `total`: Total count
- `confirmed_jargon`: Confirmed as jargon
- `confirmed_not_jargon`: Confirmed not jargon
- `pending`: Pending confirmation
- `complete_count`: Complete information count
- `chat_count`: Number of chats involved
- `top_chats`: Top 5 chats with most jargon

## Emoji Management

The emoji module manages emojis collected and used by MaiBot.

| Endpoint | Description |
|----------|-------------|
| `GET /emoji/list` | Get emoji list |
| `GET /emoji/{emoji_id}` | Get emoji details |
| `PATCH /emoji/{emoji_id}` | Incrementally update emoji |
| `DELETE /emoji/{emoji_id}` | Delete emoji |
| `GET /emoji/stats/summary` | Get statistics |
| `POST /emoji/{emoji_id}/register` | Register emoji |
| `POST /emoji/{emoji_id}/ban` | Ban emoji |
| `GET /emoji/{emoji_id}/thumbnail` | Get thumbnail |
| `POST /emoji/upload` | Upload emoji |
| `POST /emoji/batch/upload` | Batch upload |
| `POST /emoji/batch/delete` | Batch delete |

### List Query

`GET /emoji/list` supports:
- `search`: Search keywords (match description, hash value)
- `status`: Filter by unified emoji status (`known` / `unknown` / `adopted` / `discarded`)
- `format`: Filter by file format (`JPEG` / `PNG` / `GIF` / `WebP`)
- `sort_by`: Sort field (`query_count` / `register_time` / `record_time` / `last_used_time`)
- `sort_order`: Sort direction (`asc` / `desc`)

### Emoji Status

Emojis have four WebUI statuses:
- **Known** (`known`): Has a description, but is not registered or banned
- **Unknown** (`unknown`): Has no description yet, and is not registered or banned
- **Adopted** (`adopted`): Registered and usable by MaiBot
- **Discarded** (`discarded`): Banned and unavailable

Manual uploads from WebUI are registered immediately as **Adopted**. If the uploaded image already exists in the database, WebUI reuses the existing record, updates its description from the submitted tags, clears the ban flag, and marks it as registered. Deleting an unregistered emoji removes both the local file and database record; deleting a registered emoji unloads it first, then removes the file and record.

### Thumbnail Cache

| Endpoint | Description |
|----------|-------------|
| `GET /emoji/thumbnail-cache/stats` | Thumbnail cache statistics |
| `POST /emoji/thumbnail-cache/cleanup` | Clean up orphaned cache |
| `POST /emoji/thumbnail-cache/preheat` | Preheat cache (generate by usage frequency priority) |
| `DELETE /emoji/thumbnail-cache/clear` | Clear all cache |

Thumbnails are cached in WebP format. If cache doesn't exist when getting, it will be generated asynchronously in the background, and clients need to retry according to 202 status code + `Retry-After` header. Supported image formats: JPEG, PNG, GIF, WebP.

### Upload Restrictions

- Supported formats: JPEG, PNG, GIF, WebP
- Upload will verify image validity through PIL
- Duplicate files (MD5 hash) are not allowed to be uploaded repeatedly
