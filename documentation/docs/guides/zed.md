---
title: Set up arakan in Zed
sidebar_position: 10
displayed_sidebar: tutorialSidebar
description: See how Zed installs and configures arakan as an ACP agent.
---

# Set up arakan in Zed

Zed can run arakan as an ACP agent. Install arakan from the ACP Registry for the
simplest setup, or configure it manually to use your own arakan binary and
environment overrides.

## Install arakan from the ACP Registry

Zed has built-in ACP Registry support, so it can download and run arakan for you
without manual configuration.

1. Open Zed
2. Open Agent Settings
3. Click `Add Agent`, then choose `Install from Registry`
4. Select `arakan`

A registry-installed arakan runs the same `arakan acp` server and reads your
existing arakan configuration, so your providers, models, and extensions carry
over. Zed keeps the installed version up to date for you.

## Configure arakan manually

Use a custom agent if you want to run your own arakan binary, such as a local
development build, or pass environment overrides.

### Prerequisites

Ensure you have both Zed and the arakan CLI installed:

- **Zed**: Download from [zed.dev](https://zed.dev/)
- **arakan CLI**: Follow the [installation guide](/docs/getting-started/installation)

Verify arakan is installed:

```bash
arakan --version
```

### Add arakan to your Zed settings

1. Open Zed
2. Open Agent Settings, click `Add Agent`, then choose `Add Custom Agent`. Zed
   scaffolds an `agent_servers` entry and opens your settings file
3. Edit the entry so it runs arakan:

```json
{
  "agent_servers": {
    "arakan": {
      "type": "custom",
      "command": "arakan",
      "args": ["acp"]
    }
  }
}
```

You can now interact with arakan directly in Zed. ACP sessions use the extensions
enabled in your arakan configuration, so their tools are also available in Zed.

## Override the provider and model

By default, arakan uses the provider and model defined in your
[configuration file](/docs/guides/config-files). Override them for a specific
agent configuration with the `ARAKAN_PROVIDER` and `ARAKAN_MODEL` environment
variables.

This example configures two arakan agents with different model settings:

```json
{
  "agent_servers": {
    "arakan": {
      "type": "custom",
      "command": "arakan",
      "args": ["acp"]
    },
    "arakan (GPT-4o)": {
      "type": "custom",
      "command": "arakan",
      "args": ["acp"],
      "env": {
        "ARAKAN_PROVIDER": "openai",
        "ARAKAN_MODEL": "gpt-4o"
      }
    }
  }
}
```

## Use Zed MCP servers with arakan

MCP servers in Zed's `context_servers` configuration are automatically
available to arakan. This lets native Zed features and the arakan agent use the
same MCP servers.

```json
{
  "context_servers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/dir"
      ]
    }
  },
  "agent_servers": {
    "arakan": {
      "type": "custom",
      "command": "arakan",
      "args": ["acp"]
    }
  }
}
```

All MCP servers in `context_servers` are available to arakan when they use stdio
(command-based) or HTTP transports. arakan does not support servers using the
deprecated SSE transport.

If a server in `context_servers` has the same name as a arakan extension, arakan
uses its own [configuration](/docs/guides/config-files).
