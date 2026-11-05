package io.github.aaif_arakan.providers.openai

public fun provider(
    apiKey: String,
    baseUrl: String? = null,
): io.github.aaif_arakan.Provider = io.github.aaif_arakan.openaiProvider(apiKey, baseUrl)

public fun defaultModel(): String = io.github.aaif_arakan.openaiDefaultModel()
