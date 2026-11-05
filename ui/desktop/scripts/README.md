# Arakany

Put `arakany` in your $PATH if you want to launch via:

```
arakany .
```

This will open arakan GUI from any path you specify

# Unregister Deeplink Protocols (macos only)

`unregister-deeplink-protocols.js` is a script to unregister the deeplink protocol used by arakan like `arakan://`.
This is handy when you want to test deeplinks with the development version of Arakan.

# Usage

To unregister the deeplink protocols, run the following command in your terminal:
Then launch Arakan again and your deeplinks should work from the latest launched arakan application as it is registered on startup.

```bash
node scripts/unregister-deeplink-protocols.js
```

