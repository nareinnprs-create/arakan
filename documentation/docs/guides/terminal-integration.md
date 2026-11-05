# Terminal Integration

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Talk to arakan directly from your shell prompt. Instead of switching to a separate REPL session, stay in your terminal and call arakan when you need it.

## Setup

<Tabs groupId="shells">
<TabItem value="zsh" label="zsh" default>

Add to `~/.zshrc`:
```bash
eval "$(arakan term init zsh)"
```

</TabItem>
<TabItem value="bash" label="bash">

Add to `~/.bashrc`:
```bash
eval "$(arakan term init bash)"
```

</TabItem>
<TabItem value="fish" label="fish">

Add to `~/.config/fish/config.fish`:
```fish
arakan term init fish | source
```

</TabItem>
<TabItem value="nu" label="Nushell">

Add to `~/.config/nushell/config.nu`:
```nu
let arakan_term_init = ($nu.cache-dir | path join "arakan-term-init.nu")
^arakan term init nu | save --force $arakan_term_init
source $arakan_term_init
```

</TabItem>
<TabItem value="powershell" label="PowerShell">

Add to `$PROFILE`:
```powershell
Invoke-Expression (arakan term init powershell)
```

</TabItem>
</Tabs>

Restart your terminal or source the config, and that's it!

## Usage

Just type `@arakan` (or `@g` for short) followed by your question:

```bash
npm install express
    npm ERR! code EACCES
    npm ERR! permission denied

@arakan "how do I fix this error?"
```

Use quotes around your prompt if it contains special characters like `?`, `*`, or `'`:

```bash
@arakan "what's in this directory?"
@g "analyze the error: 'permission denied'"
```

## Named Sessions
By default, each terminal gets its own arakan session that lasts until you close it. Named sessions let you continue conversations across terminal restarts and share context between windows.

<Tabs groupId="shells">
<TabItem value="zsh" label="zsh" default>

```bash
eval "$(arakan term init zsh --name my-project)"
```

</TabItem>
<TabItem value="bash" label="bash">

```bash
eval "$(arakan term init bash --name my-project)"
```

</TabItem>
<TabItem value="fish" label="fish">

```fish
arakan term init fish --name my-project | source
```

</TabItem>
<TabItem value="nu" label="Nushell">

```nu
let arakan_term_init = ($nu.cache-dir | path join "arakan-term-init.nu")
^arakan term init nu --name my-project | save --force $arakan_term_init
source $arakan_term_init
```

</TabItem>
<TabItem value="powershell" label="PowerShell">

```powershell
Invoke-Expression (arakan term init powershell --name my-project)
```

</TabItem>
</Tabs>

Named sessions persist in arakan's database, so they're available anytime, even after restarting your computer. Reopen later and run the same command to continue:

```bash
# Start debugging
eval "$(arakan term init zsh --name auth-bug)"
@arakan help me debug this login timeout

# Close terminal, come back later
eval "$(arakan term init zsh --name auth-bug)"
@arakan "what was the solution we discussed?"
# Continues the same conversation with context
```

## Default Handler

Use `--default` if you want arakan to answer commands your shell cannot resolve.

<Tabs groupId="default-shells">
<TabItem value="zsh" label="zsh" default>

```bash
eval "$(arakan term init zsh --default)"
```

</TabItem>
<TabItem value="bash" label="bash">

```bash
eval "$(arakan term init bash --default)"
```

</TabItem>
<TabItem value="nu" label="Nushell">

```nu
let arakan_term_init = ($nu.cache-dir | path join "arakan-term-init.nu")
^arakan term init nu --default | save --force $arakan_term_init
source $arakan_term_init
```

</TabItem>
</Tabs>

## Shell History

By default, arakan does **not** record the commands you type. To let arakan see your recent shell commands as context when you ask a question, pass `--dangerous-include-history` when initialising:

:::warning
When shell history is enabled, every command you run — including lines that contain passwords, API keys, or other credentials — is sent to the configured model provider. Only enable this if you understand and accept that risk.
:::

<Tabs groupId="shells">
<TabItem value="zsh" label="zsh" default>

```bash
eval "$(arakan term init zsh --dangerous-include-history)"
```

</TabItem>
<TabItem value="bash" label="bash">

```bash
eval "$(arakan term init bash --dangerous-include-history)"
```

</TabItem>
<TabItem value="fish" label="fish">

```fish
arakan term init fish --dangerous-include-history | source
```

</TabItem>
<TabItem value="nu" label="Nushell">

```nu
let arakan_term_init = ($nu.cache-dir | path join "arakan-term-init.nu")
^arakan term init nu --dangerous-include-history | save --force $arakan_term_init
source $arakan_term_init
```

</TabItem>
<TabItem value="powershell" label="PowerShell">

```powershell
Invoke-Expression (arakan term init powershell --dangerous-include-history)
```

</TabItem>
</Tabs>

With history enabled, arakan sees the commands you've run since your last question, so you don't need to explain what you've been doing.

## Show Context Status in Your Prompt

Add `arakan term info` to your prompt to see how much context you've used and which model is active during a terminal arakan session. 

<Tabs groupId="shells">
<TabItem value="zsh" label="zsh" default>

```bash
PROMPT='$(arakan term info) %~ $ '
```

</TabItem>
<TabItem value="bash" label="bash">

```bash
PS1='$(arakan term info) \w $ '
```

</TabItem>
<TabItem value="fish" label="fish">

```fish
function fish_prompt
    arakan term info
    echo -n ' '(prompt_pwd)' $ '
end
```

</TabItem>
<TabItem value="nu" label="Nushell">

```nu
$env.PROMPT_COMMAND = {|| $"(arakan term info) (pwd)> " }
```

</TabItem>
<TabItem value="powershell" label="PowerShell">

```powershell
function prompt {
    $arakanInfo = & arakan term info
    "$arakanInfo $(Get-Location) PS> "
}
```

</TabItem>
</Tabs>

Your terminal prompt now shows the context usage and model name (shortened for readability) for the active arakan session. For example:

```bash
●●○○○ sonnet ~/projects $
```
## Shell Completion for arakan Commands

`@arakan` provides context-aware assistance. To enable tab completion of arakan CLI commands (like `arakan session`, `arakan run`, etc.), see the [shell completion documentation](/docs/guides/arakan-cli-commands#completion).

## Troubleshooting

**arakan doesn't see recent commands:**
Shell history capture is opt-in. arakan only sees your recent commands if you initialised with [`--dangerous-include-history`](#shell-history). Without that flag, arakan has no record of commands you've run.

If you've already enabled `--dangerous-include-history` but arakan still reports no activity, check that terminal integration is properly [set up in your shell config](#setup).
You can also check the id of the arakan session in your current terminal:
```bash
# Check if session ID exists
echo $AGENT_SESSION_ID
# Should show something like: 20251209_151730
```
```nu
# Nushell
$env.AGENT_SESSION_ID
# Should show something like: 20251209_151730
```
To share context across terminal windows, use a [named session](#named-sessions) instead.

**Session getting too full** (prompt shows `●●●●●`):
If arakan's responses are getting slow or hitting context limits, start a fresh arakan session in the terminal. The new arakan session sees your command history, but not the conversation history from the previous session. 
```bash
# Start a new arakan session in the same shell
eval "$(arakan term init zsh)"
```
```nu
# Nushell
let arakan_term_init = ($nu.cache-dir | path join "arakan-term-init.nu")
^arakan term init nu | save --force $arakan_term_init
source $arakan_term_init
```
