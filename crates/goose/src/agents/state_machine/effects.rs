use crate::conversation::message::Message;
use crate::conversation::Conversation;
use crate::providers::base::ProviderUsage;
use crate::recipe::Recipe;
use crate::session::ExtensionState;
use anyhow::Result;
use arakan_agent::operation::{ConversationEffect, MachineEffect};

pub enum ArakanEffect {
    Conversation(ConversationEffect),
    CompactConversation {
        conversation: Conversation,
        usage: Option<ProviderUsage>,
    },
    SetRecipe(Box<Option<Recipe>>),
    SetExtensionState {
        extension_name: &'static str,
        version: &'static str,
        value: serde_json::Value,
    },
    RecordUsage(ProviderUsage),
}

impl ArakanEffect {
    pub fn extension_state<S: ExtensionState>(state: &S) -> Result<Self> {
        Ok(ArakanEffect::SetExtensionState {
            extension_name: S::EXTENSION_NAME,
            version: S::VERSION,
            value: state.to_value()?,
        })
    }
}

impl MachineEffect for ArakanEffect {
    fn ensure_message_ids(&mut self) {
        match self {
            ArakanEffect::Conversation(effect) => effect.ensure_message_ids(),
            ArakanEffect::CompactConversation { conversation, .. } => {
                for message in conversation.messages_mut() {
                    if message.id.is_none() {
                        message.id = Some(format!("msg_{}", uuid::Uuid::new_v4()));
                    }
                }
            }
            _ => {}
        }
    }
}

impl From<ConversationEffect> for ArakanEffect {
    fn from(effect: ConversationEffect) -> Self {
        ArakanEffect::Conversation(effect)
    }
}

impl From<Message> for ArakanEffect {
    fn from(message: Message) -> Self {
        ConversationEffect::from(message).into()
    }
}

impl From<Conversation> for ArakanEffect {
    fn from(conversation: Conversation) -> Self {
        ConversationEffect::from(conversation).into()
    }
}
