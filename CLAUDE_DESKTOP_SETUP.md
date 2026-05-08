# Setting up cal-mcp-server in Claude Desktop

This is the 90-second install path. Pre-publish (before npm), use the local-build instructions; after npm publish, switch to the npx version in the README.

## 1. Get a Cal API token

```bash
curl -X POST https://vault.homeloanexpress.ai/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://homeloanexpress.ai" \
  -d '{"email":"<your-email>","password":"<your-password>","portal":"team"}'
```

The response includes `"token":"<uuid>"`. Copy it. Tokens last 24 hours by default — refresh when expired.

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
        "CAL_API_TOKEN": "your-token-from-step-1"
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
        "CAL_API_TOKEN": "your-token-from-step-1"
      }
    }
  }
}
```

## 3. Restart Claude Desktop

Quit (cmd-Q), reopen. The `cal` tools should appear when you click the slash-menu / hammer icon in the chat composer.

## 4. Try it

Ask: *"What's the 2026 conforming loan limit in Alameda County CA?"*

Claude will call `cal_fact_lookup` and respond with the FHFA $1,229,100 number plus the citation. If it doesn't see the tool, check Claude Desktop's MCP log:
```bash
tail -f "$HOME/Library/Logs/Claude/mcp*.log"
```

The most common failure is the token having expired. Re-run step 1, paste the new token, restart.

## 5. Harder demo

Try: *"Top 5 wholesale jumbo lenders in CA for a 712 FICO, 80% LTV, $1.4M loan with departing residence still listed."*

Claude should chain `cal_scenario_pattern("departing-residence")` → `cal_search_lenders` → `cal_lender_intel` for one or two of the top hits, and return a ranked answer with structuring guidance and AE contacts.
