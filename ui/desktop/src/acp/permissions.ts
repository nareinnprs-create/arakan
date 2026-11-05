import type { ToolListItem, ToolPermissionEntry, ToolPermissionLevel } from '@aaif/arakan-acp-client';
import { getAcpClient } from './acpConnection';

export type { ToolListItem, ToolPermissionEntry, ToolPermissionLevel };

export async function listTools(sessionId: string, extensionName?: string): Promise<ToolListItem[]> {
  const client = await getAcpClient();
  const response = await client.arakan.toolsList_unstable({
    sessionId,
    extensionName: extensionName ?? null,
  });
  return response.tools ?? [];
}

export async function setToolPermissions(toolPermissions: ToolPermissionEntry[]): Promise<void> {
  const client = await getAcpClient();
  await client.arakan.toolsPermissionsSet_unstable({ toolPermissions });
}
