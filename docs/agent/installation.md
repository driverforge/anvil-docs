---
sidebar_position: 2
description: Install and authenticate the Anvil Agent on your development controller.
---

import { DownloadAgent } from '@site/src/components/DownloadSDK';

# Installation

Install and authenticate the Anvil Agent on your development controller.

## Download

<DownloadAgent />

## Install the Driver

1. Open **Composer Pro**
2. Connect to your development controller
3. Select **Driver** > **Add or Update Driver or Agent** from the menu bar
4. Browse to `anvil-agent.c4z` and add it

## Add the Agent

1. Select the **Agents** view
2. Click **Add...**
3. Search for "Anvil" and double-click the agent from the list, or right click and select **Add to Project**

## Authenticate

1. Select **Anvil Agent** from the list of installed Agents
2. Navigate to the **Actions** tab
3. Click **Get authentication link**
4. Return to the **Properties** tab
5. Click the **Authentication URL** property
6. A web browser opens
7. Log in with your Driverforge account if required
8. Approve the request to connect Anvil to your Driverforge account
9. Close the browser and return to Composer

The Anvil Agent is now ready. Any driver that includes the Anvil SDK will discover the agent and stream events to the Anvil Platform.

## Verify

After authentication, open the agent's Properties tab. The **Authentication status** property should show:

`Logged in as you@youremail.com`

## Updating

To update to a new version:

1. Download the new `anvil-agent.c4z`
2. Right-click the agent in Composer
3. Select **Update Driver**

The agent reconnects automatically after updating.

## Removing

To remove the agent:

1. Right-click the Anvil Agent
2. Select **Remove**

Your drivers continue working normally - they just won't stream events until you reinstall the agent.
