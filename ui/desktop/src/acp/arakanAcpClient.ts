import {
  client,
  methods,
  type Client,
  type ClientConnection,
  type Stream,
} from '@agentclientprotocol/sdk';
import {
  ARAKAN_EXT_AGENT_REQUESTS,
  ARAKAN_EXT_NOTIFICATIONS,
  ArakanExtClient,
  type ArakanSessionNotification_unstable,
  type ProviderDeviceCodeNotification_unstable,
  type RecipeParamsResponse_unstable,
  type RequestRecipeParams_unstable,
  zArakanSessionNotification_unstable,
  zProviderDeviceCodeNotification_unstable,
  zRequestRecipeParams_unstable,
} from '@aaif/arakan-acp-client';

const [arakanSessionUpdate, providerDeviceCode] = ARAKAN_EXT_NOTIFICATIONS;
const [arakanRecipeParamsRequest] = ARAKAN_EXT_AGENT_REQUESTS;

export type ArakanAcpCallbacks = Required<
  Pick<Client, 'requestPermission' | 'sessionUpdate' | 'createElicitation'>
> & {
  unstable_sessionRecipeRequestParams: (
    request: RequestRecipeParams_unstable
  ) => Promise<RecipeParamsResponse_unstable>;
  unstable_sessionUpdate: (notification: ArakanSessionNotification_unstable) => Promise<void>;
  unstable_providerDeviceCode: (
    notification: ProviderDeviceCodeNotification_unstable
  ) => Promise<void>;
};

export type ArakanAcpClient = {
  connection: ClientConnection;
  arakan: ArakanExtClient;
};

export function connectArakanAcpClient(
  stream: Stream,
  callbacks: ArakanAcpCallbacks
): ArakanAcpClient {
  const app = client({ name: 'arakan' })
    .onRequest(methods.client.session.requestPermission, (context) =>
      callbacks.requestPermission(context.params)
    )
    .onNotification(methods.client.session.update, (context) =>
      callbacks.sessionUpdate(context.params)
    )
    .onRequest(methods.client.elicitation.create, (context) =>
      callbacks.createElicitation(context.params)
    )
    .onRequest(arakanRecipeParamsRequest.method, zRequestRecipeParams_unstable, (context) =>
      callbacks.unstable_sessionRecipeRequestParams(context.params)
    )
    .onNotification(arakanSessionUpdate.method, zArakanSessionNotification_unstable, (context) =>
      callbacks.unstable_sessionUpdate(context.params)
    )
    .onNotification(
      providerDeviceCode.method,
      zProviderDeviceCodeNotification_unstable,
      (context) => callbacks.unstable_providerDeviceCode(context.params)
    );

  const connection = app.connect(stream);
  const arakan = new ArakanExtClient(connection.agent);

  return { connection, arakan };
}
