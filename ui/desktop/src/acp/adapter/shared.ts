import type { ToolCall, ToolCallUpdate } from '@agentclientprotocol/sdk';
import type { TokenState } from '../../types/chat';
import type { InferenceMetadata, Message, NotificationEvent } from '../../types/message';

export type AcpChatStateChange =
  | { type: 'messages'; messages: Message[] }
  | { type: 'tokenState'; tokenState: Partial<TokenState> }
  | { type: 'progressMessage'; message: string | undefined }
  | {
      type: 'sessionInfo';
      name?: string;
      activeRunId?: string | null;
      arakanMode?: string;
    }
  | { type: 'localSteerConfirmed'; messageId: string }
  | { type: 'notification'; notification: NotificationEvent };

export interface AdapterState {
  messages: Message[];
  localSteerTextByMessageId: Map<string, string>;
  toolCallStatesById: Map<string, ToolCallState>;
}

export type ToolCallState = Omit<ToolCallUpdate, '_meta'>;

export interface ArakanMessageMeta {
  messageId?: string;
  created?: number;
  outputTokenLimitReached?: boolean;
  fallbackContent?: boolean;
  operationLogs?: string[];
  steer?: boolean;
  inference?: InferenceMetadata;
}

export interface ToolIdentity {
  toolName?: string;
  extensionName?: string;
}

export const DEFAULT_VISIBLE_MESSAGE_METADATA: Message['metadata'] = {
  userVisible: true,
  agentVisible: true,
};

export function messagesChange(state: AdapterState): AcpChatStateChange[] {
  // Pass the live array by reference: the store is the only consumer and it
  // clones on write (applyChatStateChanges). Cloning here as well made every
  // streamed chunk O(messages) twice, which turns session-load replay into
  // O(n^2) on large sessions.
  return [{ type: 'messages', messages: state.messages }];
}

export function cloneMessage(message: Message): Message {
  return {
    ...message,
    content: message.content.map((content) => ({ ...content })),
    metadata: { ...message.metadata },
  };
}

export function getArakanMessageMeta(update: { _meta?: unknown }): ArakanMessageMeta {
  if (!isRecord(update._meta)) {
    return {};
  }

  const arakan = update._meta.arakan;
  if (!isRecord(arakan)) {
    return {};
  }

  const outputTokenLimitReached = arakan.outputTokenLimitReached === true;
  const operationLogs = Array.isArray(arakan.operationLogs)
    ? arakan.operationLogs.filter((line): line is string => typeof line === 'string')
    : undefined;

  return {
    created: typeof arakan.created === 'number' ? arakan.created : undefined,
    messageId: typeof arakan.messageId === 'string' ? arakan.messageId : undefined,
    outputTokenLimitReached: outputTokenLimitReached ? true : undefined,
    fallbackContent: arakan.fallbackContent === true ? true : undefined,
    operationLogs,
    steer: arakan.steer === true ? true : undefined,
    inference: getInferenceMeta(arakan.inference),
  };
}

function getInferenceMeta(inference: unknown): InferenceMetadata | undefined {
  if (
    !isRecord(inference) ||
    typeof inference.provider !== 'string' ||
    typeof inference.requestedModel !== 'string'
  ) {
    return undefined;
  }

  return {
    provider: inference.provider,
    requestedModel: inference.requestedModel,
    ...(typeof inference.resolvedModel === 'string'
      ? { resolvedModel: inference.resolvedModel }
      : {}),
  };
}

export function applyInferenceMeta(message: Message, arakanMeta: ArakanMessageMeta): void {
  if (message.role === 'assistant' && arakanMeta.inference) {
    message.metadata.inference = arakanMeta.inference;
  }
}

export function getArakanActiveRunId(update: { _meta?: unknown }): string | null | undefined {
  if (!isRecord(update._meta)) {
    return undefined;
  }

  const arakan = update._meta.arakan;
  if (!isRecord(arakan) || !('activeRunId' in arakan)) {
    return undefined;
  }

  return typeof arakan.activeRunId === 'string' || arakan.activeRunId === null
    ? arakan.activeRunId
    : undefined;
}

export function getArakanQueuedSteer(update: { _meta?: unknown }): string | undefined {
  if (!isRecord(update._meta)) return undefined;
  const arakan = update._meta.arakan;
  if (!isRecord(arakan) || !isRecord(arakan.queuedSteer)) return undefined;
  return typeof arakan.queuedSteer.messageId === 'string' ? arakan.queuedSteer.messageId : undefined;
}

export function rawInputToArguments(rawInput: unknown): Record<string, unknown> {
  return isRecord(rawInput) ? rawInput : {};
}

export function toolIdentity(update: ToolCall | ToolCallUpdate): ToolIdentity {
  if (!isRecord(update._meta)) {
    return {};
  }

  const arakan = update._meta.arakan;
  if (!isRecord(arakan) || !isRecord(arakan.toolCall)) {
    return {};
  }

  return {
    toolName: typeof arakan.toolCall.toolName === 'string' ? arakan.toolCall.toolName : undefined,
    extensionName:
      typeof arakan.toolCall.extensionName === 'string' ? arakan.toolCall.extensionName : undefined,
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
