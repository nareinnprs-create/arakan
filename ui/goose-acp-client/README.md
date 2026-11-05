# @aaif/arakan-acp-client

TypeScript client library for communicating with Arakan over an existing Agent
Client Protocol (ACP) transport.

This package provides:

- TypeScript types and Zod validators for Arakan ACP extension methods
- `ArakanExtClient` for calling Arakan extension methods
- Client capability definitions and MCP Apps helpers

It does not install, resolve, or start the Arakan executable. Applications own
the transport and process lifecycle.

## Installation

```bash
npm install @aaif/arakan-acp-client @agentclientprotocol/sdk
```

## Usage

Compose the Arakan extension client with the standard ACP SDK:

```typescript
import {
  client as createAcpClient,
  methods,
  PROTOCOL_VERSION,
  type Stream,
} from "@agentclientprotocol/sdk";
import { ArakanExtClient } from "@aaif/arakan-acp-client";

async function connectToArakan(stream: Stream) {
  const app = createAcpClient({ name: "my-product" });
  const connection = app.connect(stream);
  const arakan = new ArakanExtClient(connection.agent);

  await connection.agent.request(methods.agent.initialize, {
    protocolVersion: PROTOCOL_VERSION,
    clientInfo: {
      name: "my-product",
      version: "1.0.0",
    },
    clientCapabilities: {},
  });

  return { connection, arakan };
}
```

The application creates and owns the `stream`, including its connection and
process lifecycle. Call `connection.close()` when the application no longer
needs the connection.

## Development

From `ui/arakan-acp-client`:

```bash
pnpm run build
```

The generated TypeScript types come from the Rust schemas in `crates/arakan`.
