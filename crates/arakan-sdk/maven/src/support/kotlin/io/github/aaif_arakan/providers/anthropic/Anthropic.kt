package io.github.aaif_arakan.providers.anthropic

public fun provider(
    apiKey: String,
    baseUrl: String? = null,
    betaHeaders: List<String> = emptyList(),
): io.github.aaif_arakan.Provider = io.github.aaif_arakan.anthropicProvider(apiKey, baseUrl, betaHeaders)

public fun defaultModel(): String = io.github.aaif_arakan.anthropicDefaultModel()
