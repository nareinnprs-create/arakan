package io.github.aaif_arakan.providers.databricks

public fun provider(host: String, token: String): io.github.aaif_arakan.Provider =
    io.github.aaif_arakan.databricksProvider(host, token)

public fun defaultModel(): String = io.github.aaif_arakan.databricksDefaultModel()
