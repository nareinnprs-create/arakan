import { RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/app-bridge";
import type {
  McpUiAppResourceConfig,
  McpUiAppToolConfig,
} from "@modelcontextprotocol/ext-apps/server";
import type {
  BlobResourceContents,
  ReadResourceResult,
  TextResourceContents,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

export const ARAKAN_MCP_UI_EXTENSION_ID = "io.modelcontextprotocol/ui" as const;

export interface ArakanMcpUiExtensionSettings {
  mimeTypes: string[];
}

export interface ArakanMcpHostCapabilities {
  extensions: Record<string, ArakanMcpUiExtensionSettings>;
}

export type ArakanToolUiMetadata = Extract<
  McpUiAppToolConfig["_meta"],
  { ui: unknown }
>["ui"];

export type ArakanToolMetadata = NonNullable<Tool["_meta"]> & {
  ui?: ArakanToolUiMetadata;
  arakan_extension?: string;
};

export type ArakanSessionTool = Tool & {
  meta?: ArakanToolMetadata;
  _meta?: ArakanToolMetadata;
};

export type ArakanTextResourceContents = TextResourceContents;

export type ArakanBlobResourceContents = BlobResourceContents;

export type ArakanResourceContents = TextResourceContents | BlobResourceContents;

export type ArakanReadResourceResult = ReadResourceResult;

export type ArakanResourceMetadata = NonNullable<
  Extract<NonNullable<McpUiAppResourceConfig["_meta"]>, { ui?: unknown }>["ui"]
>;

export interface ArakanMcpAppToolPayload {
  toolName: string;
  extensionName: string;
  resourceUri: string;
  toolMeta?: ArakanToolMetadata;
  resourceResult?: ArakanReadResourceResult | null;
  readError?: string;
}

export interface ArakanToolCallUpdateMeta {
  arakan?: {
    mcpApp?: ArakanMcpAppToolPayload;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export const DEFAULT_ARAKAN_MCP_HOST_CAPABILITIES: ArakanMcpHostCapabilities = {
  extensions: {
    [ARAKAN_MCP_UI_EXTENSION_ID]: {
      mimeTypes: [RESOURCE_MIME_TYPE],
    },
  },
};
