# Setting up cal-mcp-server in Claude Desktop

> **Important note (May 2026):** Claude Desktop has moved to a DXT extension system. The legacy `mcpServers` JSON path described below still works for **Cursor, Continue, Goose, Zed, Cody, Claude Code CLI, and other MCP clients**, but **modern Claude Desktop tends to overwrite manual edits to `claude_desktop_config.json` on relaunch**.
>
> A `.dxt` Claude Desktop bundle is on the v0.1.2 roadmap. Until it ships, the most reliable Claude Desktop install paths are:
> 1. Use the in-app **Settings → Extensions → Install from file** flow (when we publish the .dxt)
> 2. Use a different MCP client that respects manual config (Cursor, Continue, Claude Code CLI)
> 3. Manually edit the legacy config path below and accept that you may need to redo it after a Claude Desktop update

The instructions below cover the manual / legacy path.

---

## 1. Get a long-lived API key (recommended)

```bash
SESSION=$(curl -s -X POST https://vault.homeloanexpress.ai/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://homeloanexpress.ai" \
  -d '{"email":"<your-email>","password":"<your-password>","portal":"team"}' \
  | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

curl -X POST https://vault.homeloanexpress.ai/auth/api-keys \
  -H "Content-Type: application/json" \
  -H "Origin: https://homeloanexpress.ai" \
  -H "Authorization: Bearer $SESSION" \
  -d '{"label":"my-claude-desktop"}'
```

The response includes a `key` field starting with `cal_live_`. **Copy it now — it is shown only once.** It has no expiry; revoke any time with `DELETE /auth/api-keys/<id>`.

## 2. Edit Claude Desktop's config

macOS:
```bash
open "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```

Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add a `mcpServers` block (or merge into the existing one):

```json
{
  "mcpServers": {
    "cal": {
      "command": "node",
      "args": [
        "/absolute/path/to/cal-mcp-server/dist/index.js"
      ],
      "env": {
        "CAL_API_TOKEN": "cal_live_...your-key-here..."
      }
    }
  }
}
```

After npm publish, switch to:

```json
{
  "mcpServers": {
    "cal": {
      "command": "npx",
      "args": ["-y", "@homeloanexpress/cal-mcp-server"],
      "env": {
        "CAL_API_TOKEN": "cal_live_...your-key-here..."
      }
    }
  }
}
```

## 3. Restart Claude Desktop

Quit (cmd-Q), reopen. The `cal` tools should appear when you click the slash-menu / hammer icon in the chat composer.

If they don't appear after restart and your config edit was reverted, you've hit the DXT-overwrite problem. Use Cursor or another MCP client until the v0.1.2 .dxt ships.

## 4. Try it

Ask: *"What's the 2026 conforming loan limit in Alameda County CA?"*

Claude will call `cal_fact_lookup` and respond with the FHFA $1,229,100 number plus the citation. If it doesn't see the tool, check Claude Desktop's MCP log:
```bash
tail -f "$HOME/Library/Logs/Claude/mcp*.log"
```

The most common failure modes:

| Error | Fix |
|---|---|
| `401 unauthorized` from cal API | Token expired (used session token instead of API key), or key revoked. Mint a new API key. |
| `cal` server doesn't appear in Claude Desktop | Config edit got overwritten. See note at top of this file. |
| `MCP SDK error` on launch | Node version too old. cal-mcp-server requires Node ≥ 18. |
| `Cannot find module @modelcontextprotocol/sdk` | Run `npm install` in the cal-mcp-server directory. |

## 5. Harder demo

Try: *"Top 5 wholesale jumbo lenders in CA for a 712 FICO, 80% LTV, $1.4M loan with departing residence still listed."*

Claude should chain `cal_scenario_pattern("departing-residence")` → `cal_search_lenders` → `cal_lender_intel` for one or two of the top hits, and return a ranked answer with structuring guidance and AE contacts.
