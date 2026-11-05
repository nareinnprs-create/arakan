---
sidebar_position: 90
title: Running a Remote arakan Server
sidebar_label: Remote Server
---

# Running a Remote arakan Server

arakan Desktop normally runs its own `arakan serve` ACP server process in the background on the same machine. You can also run `arakan serve` separately — for example, on a remote VM or a different machine on your network — and point arakan Desktop at it.

This is useful when you want arakan to run somewhere with more compute, a stable IP, or shared access, while still driving it from a local Desktop UI.

This guide covers:

1. [Starting a `arakan serve` server on a remote machine](#1-start-the-arakan-serve-server)
2. [Verifying it is reachable](#2-verify-the-server-is-up)
3. [Locating the certificate fingerprint](#3-find-the-certificate-fingerprint)
4. [Configuring arakan Desktop to connect to it](#4-configure-arakan-desktop)
5. [Running `arakan serve` as a background service on macOS](#running-arakan-serve-as-a-background-service-macos)
6. [Troubleshooting](#troubleshooting)

:::warning Use TLS for remote servers
arakan Desktop accepts both HTTP and HTTPS external backend URLs, but TLS is strongly recommended when connecting over a network. Certificate fingerprint pinning requires HTTPS.
:::

## Initial Setup

### 1. Start the `arakan serve` server

On the remote machine, launch `arakan serve` with the host, port, TLS, and a shared secret key:

```bash
ARAKAN_SERVER__SECRET_KEY='YOUR_SECRET' \
arakan serve --platform desktop --enable-scheduler --host 0.0.0.0 --port 3000 --tls
```

If you are using the binary bundled with the macOS app, the command path is `/Applications/Arakan.app/Contents/Resources/bin/arakan`.

| Setting | Purpose |
|---------|---------|
| `--host` | Interface to bind to. Use `0.0.0.0` to accept connections from other machines. Binding to `localhost` or `127.0.0.1` will only accept local connections. |
| `--port` | TCP port to listen on. |
| `--tls` / `ARAKAN_TLS=true` | Enables TLS. Strongly recommended for remote servers and required for certificate fingerprint pinning. |
| `ARAKAN_SERVER__SECRET_KEY` | Shared secret. The client must send this to the ACP endpoint. Treat it like a password. |

:::tip
Pick a long, random value for `ARAKAN_SERVER__SECRET_KEY` and store it in a password manager — the same value goes into arakan Desktop later.
:::

### 2. Verify the server is up

First, confirm `arakan serve` is actually listening on the port you expect:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

Then test the server from the server itself. The `-k` flag tells `curl` to accept the self-signed TLS certificate that `arakan serve` generates:

```bash
# Connectivity only
curl -i https://127.0.0.1:3000/status -k

# ACP endpoint auth check. A 401 means the secret was rejected.
curl -i https://127.0.0.1:3000/acp -k \
  -H 'X-Secret-Key: YOUR_SECRET'
```

A successful `/status` response confirms that TLS is up. The `/acp` check should not return `401` when the secret is correct.

If you intend to reach the server from another machine, also test from there using the server's hostname or VPN address — not `127.0.0.1`.

### 3. Optionally find the certificate fingerprint

When `arakan serve` runs with TLS, it generates or loads a TLS certificate. arakan Desktop can pin that certificate by SHA-256 fingerprint. If you leave the fingerprint field empty, arakan Desktop uses trust-on-first-use and pins the first certificate it sees for that backend.

When TLS is enabled, `arakan serve` logs the fingerprint on startup. It looks like:

```text
ARAKAND_CERT_FINGERPRINT=AA:BB:CC:DD:EE:FF:...
```

To capture it, either:

- Run `arakan serve` interactively and read it from the terminal output, or
- Tail the log file you redirect to when running as a service (see [Running `arakan serve` as a background service](#running-arakan-serve-as-a-background-service-macos)):

```bash
grep ARAKAND_CERT_FINGERPRINT ~/Library/Logs/ArakanExternal/arakan-serve.out.log
```

Make a note of the fingerprint if you want to pin a specific certificate in arakan Desktop.

:::note
The fingerprint changes whenever `arakan serve` regenerates its certificate (for example, if you delete the cert file). If arakan Desktop suddenly refuses to connect after a server restart, re-check the fingerprint.
:::

### 4. Configure arakan Desktop

On the client machine, open arakan Desktop and navigate to **Settings → arakan Server**:

| Setting | Value |
|---------|-------|
| **Use external server** | Enabled |
| **URL** | `https://your-server-host:3000` (use the hostname or IP that the client can reach — for example a VPN/tailnet address) |
| **Secret Key** | The same value you used for `ARAKAN_SERVER__SECRET_KEY` |
| **Certificate Fingerprint** | Optional. Use the `ARAKAND_CERT_FINGERPRINT` value from the server logs to pin a specific TLS certificate. |

After saving, arakan Desktop will route all backend requests to the remote `arakan serve` process. If the connection fails, see [Troubleshooting](#troubleshooting).

## Running `arakan serve` as a Background Service (macOS)

Running `arakan serve` in a terminal session is fine for testing, but for everyday use you probably want it managed as a background service so it starts at login and restarts on failure. On macOS, this is done with `launchd`.

The example below uses the CLI binary bundled with arakan Desktop. If you installed the CLI separately, replace `/Applications/Arakan.app/Contents/Resources/bin/arakan` with the absolute path returned by `which arakan`.

Because the secret is stored in XML, use a hexadecimal value such as the output of `openssl rand -hex 32`, or escape XML special characters in the value.

Create a LaunchAgent plist at `~/Library/LaunchAgents/com.arakan.serve.external.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.arakan.serve.external</string>

    <key>ProgramArguments</key>
    <array>
      <string>/Applications/Arakan.app/Contents/Resources/bin/arakan</string>
      <string>serve</string>
      <string>--platform</string>
      <string>desktop</string>
      <string>--enable-scheduler</string>
      <string>--host</string>
      <string>0.0.0.0</string>
      <string>--port</string>
      <string>3000</string>
      <string>--tls</string>
    </array>

    <key>EnvironmentVariables</key>
    <dict>
      <key>ARAKAN_SERVER__SECRET_KEY</key><string>YOUR_SECRET</string>
    </dict>

    <key>RunAtLoad</key><true/>
    <key>KeepAlive</key><true/>

    <key>StandardOutPath</key>
    <string>/Users/YOUR_USERNAME/Library/Logs/ArakanExternal/arakan-serve.out.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/YOUR_USERNAME/Library/Logs/ArakanExternal/arakan-serve.err.log</string>
  </dict>
</plist>
```

Replace `YOUR_SECRET` and `YOUR_USERNAME` with appropriate values. Then create the log directory and restrict access to the plist, which contains the secret key:

```bash
mkdir -p ~/Library/Logs/ArakanExternal
chmod 600 ~/Library/LaunchAgents/com.arakan.serve.external.plist
```

Load and start the service:

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.arakan.serve.external.plist
```

To restart the service later:

```bash
launchctl kickstart -k gui/$(id -u)/com.arakan.serve.external
```

To stop and unload the service:

```bash
launchctl bootout gui/$(id -u)/com.arakan.serve.external
```

To remove the service configuration, delete the plist after unloading it.

## Troubleshooting

### Server only accepts local connections

If `curl` works from the server but the client machine times out or gets "connection refused", check what interface `arakan serve` is bound to. If `--host` is `localhost` or `127.0.0.1`, only loopback connections are accepted.

Set `--host 0.0.0.0` to accept connections on all interfaces, then restart `arakan serve`. You can verify with:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

The output should show the address as `*:3000` or the specific external IP, not `127.0.0.1:3000`.

### TLS is not enabled

In the server's startup logs:

- If you see `listening on http://...`, TLS is **not** enabled. arakan Desktop can still connect over HTTP, but this is not recommended for remote servers. Start with `--tls` or `ARAKAN_TLS=true` and restart `arakan serve`.
- If you see `listening on https://...`, TLS is enabled and you are good to go.

The startup logs also contain the `ARAKAND_CERT_FINGERPRINT=...` line you can use for certificate pinning in arakan Desktop. Search the server's stdout (or log file, if running under `launchd`) for `ARAKAND_CERT_FINGERPRINT` to find it.

### Client cannot authenticate (401 / Unauthorized)

A `401` from the server, or a arakan Desktop error indicating that the secret was rejected, almost always means that `ARAKAN_SERVER__SECRET_KEY` on the server does not match the **Secret Key** in arakan Desktop's settings.

To check the secret end-to-end without involving arakan Desktop, run the authenticated `curl` from [step 2](#2-verify-the-server-is-up) using exactly the value you have configured on the client. For this `GET /acp` probe, a `406` response means authentication passed but the request did not include the SSE headers needed by the ACP stream. A `401` or `403` means the secret on the server is different from what you are sending.

If you rotate the secret on the server, you must also update it in arakan Desktop's settings — they are not synchronized automatically.

### Certificate fingerprint mismatch

If arakan Desktop refuses to connect with a certificate or fingerprint error, the most common causes are:

- The server regenerated its certificate (for example, after deleting the cert file). Look at the latest startup logs for the current `ARAKAND_CERT_FINGERPRINT` and update arakan Desktop.
- You copied the fingerprint with extra whitespace or pasted the wrong value.

## Related

- [Environment Variables](/docs/guides/environment-variables) — full reference for all `ARAKAN_*` variables
- [Configuration Files](/docs/guides/config-files) — persistent client-side configuration
