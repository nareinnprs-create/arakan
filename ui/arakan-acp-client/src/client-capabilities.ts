import type { ArakanMcpHostCapabilities } from "./mcp-apps.js";

export interface ArakanClientCapabilitiesMeta {
  arakan?: {
    mcpHostCapabilities?: ArakanMcpHostCapabilities;
    customNotifications?: boolean;
  };
}
