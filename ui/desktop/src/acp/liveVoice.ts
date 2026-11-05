import type {
  LiveVoiceAvailabilityResponse_unstable,
  LiveVoiceStartResponse_unstable,
} from '@aaif/arakan-acp-client';
import { getAcpClient } from './acpConnection';

export async function acpGetLiveVoiceAvailability(
  sessionId?: string
): Promise<LiveVoiceAvailabilityResponse_unstable> {
  const { arakan } = await getAcpClient();
  return arakan.sessionLiveVoiceAvailability_unstable(sessionId ? { sessionId } : {});
}

export async function acpStartLiveVoice(
  sessionId: string,
  offerSdp: string
): Promise<LiveVoiceStartResponse_unstable> {
  const { arakan } = await getAcpClient();
  return arakan.sessionLiveVoiceStart_unstable({
    sessionId,
    offerSdp,
  });
}

export async function acpStopLiveVoice(sessionId: string, interactionId: string): Promise<void> {
  const { arakan } = await getAcpClient();
  await arakan.sessionLiveVoiceStop_unstable({ sessionId, interactionId });
}
