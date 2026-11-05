use anyhow::Result;
use arakan_provider_types::conversation::message::{ToolRequest, ToolResponse};
use arakan_provider_types::conversation::Conversation;
use arakan_provider_types::maybe_send::{MaybeSend, MaybeSync};
use async_trait::async_trait;

#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
pub trait PostToolCallHook<S>: MaybeSend + MaybeSync {
    async fn after_call(
        &self,
        session: &S,
        conversation: &Conversation,
        request: &ToolRequest,
        response: &ToolResponse,
    ) -> Result<()>;
}
