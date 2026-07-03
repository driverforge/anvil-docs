---
sidebar_position: 1
description: Real-time view of events, logs, and errors from your Control4 drivers.
---

import Screenshot from '@site/src/components/Screenshot';

# Overview

The Anvil platform gives you a real-time view of what's happening inside your Control4 drivers. Events, logs, and errors stream in as they happen — no more guessing what your driver is doing, or digging through Composer's Lua output.

<Screenshot name="dashboard" alt="Anvil project dashboard" />

## What You Get

### Events

Every handler call your driver receives is captured automatically — `OnPropertyChanged`, `ExecuteCommand`, `ReceivedFromProxy`, and [100+ others](/sdk/automatic-capture). For each event you can see the exact arguments Control4 passed, how long your handler took to execute, and whether it succeeded or threw.

[Learn more about Events →](/platform/events)

### Logs

Forward your driver's log output to Anvil and see it in real time, persisted across driver reloads and Composer refreshes. Filter by level, search by message, and jump from a log entry to the event that produced it.

[Learn more about Logs →](/platform/logs)

### Errors

When your driver throws, Anvil captures the error with a full stack trace and groups identical errors together. See at a glance which errors are new, which are recurring, and how often each one occurs.

[Learn more about Errors →](/platform/errors)

## Organization Dashboard

If you're working across multiple projects, the organization dashboard gives you a bird's-eye view of activity across all your drivers — aggregate stats, a combined timeline chart, recent activity, and top errors.

<Screenshot name="org-dashboard" alt="Organization dashboard" />

## Real-Time Streaming

All three views — events, logs, and errors — stream in via WebSocket. You can pause the stream to inspect something, and a badge shows how many items are buffering while paused. Click play to flush the buffer and resume.

## Managing your workspace

Beyond the data pages, the platform is where you manage everything around your drivers:

- [Organizations](/platform/organizations) — your top-level workspace, with [members & roles](/platform/members)
- [Projects](/platform/projects) — one per driver, each with its own [API keys](/security/api-keys)
- [Devices](/platform/devices) — the controllers you deploy to
- [Subscription](/platform/subscription) & [billing](/platform/billing) — your [plan](/platform/plans), usage, and payment
