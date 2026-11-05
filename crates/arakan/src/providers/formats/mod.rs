pub mod anthropic {
    pub use arakan_providers::formats::anthropic::*;
}
#[cfg(feature = "aws-providers")]
pub mod bedrock;
pub mod databricks {
    pub use arakan_providers::formats::databricks::*;
}
pub mod gcpvertexai;
pub mod google {
    use anyhow::Result;
    use arakan_providers::conversation::message::Message;
    pub use arakan_providers::formats::google::*;
    use arakan_providers::model::ModelConfig;
    use rmcp::model::Tool;
    use serde_json::Value;

    use crate::config::Config;

    pub fn create_request(
        model_config: &ModelConfig,
        system: &str,
        messages: &[Message],
        tools: &[Tool],
    ) -> Result<Value> {
        // TODO: Remove this config fallback wrapper once gemini_oauth and Vertex/GCP Gemini
        // move into arakan-providers and receive provider config during construction.
        let thinking_budget = Config::global().get_param("GEMINI25_THINKING_BUDGET").ok();
        create_request_with_thinking_budget(model_config, system, messages, tools, thinking_budget)
    }
}
pub mod openrouter {
    pub use arakan_providers::openrouter_format::*;
}
pub mod snowflake {
    pub use arakan_providers::formats::snowflake::*;
}
