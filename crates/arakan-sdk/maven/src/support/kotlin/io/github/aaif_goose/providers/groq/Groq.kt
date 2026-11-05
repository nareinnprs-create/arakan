package io.github.aaif_arakan.providers.groq

public fun provider(apiKey: String): io.github.aaif_arakan.Provider = io.github.aaif_arakan.groqProvider(apiKey)

public fun defaultModel(): String = io.github.aaif_arakan.groqDefaultModel()
