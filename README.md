# Cal MCP Server

> The mortgage MCP server, with a real lender data moat. **166+ wholesale lenders · 1,400+ indexed program documents · 250+ down‑payment‑assistance programs · 50 states.** First Model Context Protocol server in the mortgage industry with broker‑accessible matrix data behind it — not a calculator, not a rate scraper.

`@askcal/mcp-server` exposes Cal — the AI mortgage platform at [askcal.io](https://askcal.io) — to any [Model Context Protocol](https://modelcontextprotocol.io) client: Claude Desktop, Cursor, Continue, Goose, Zed, Cody, your own agent. Loan officers, brokers, real‑estate agents, and consumer borrowers can ask their AI assistant questions like:

- *"What's the 2026 conforming loan limit in Alameda County, CA, for a 1‑unit?"*
- *"Top 5 wholesale jumbo lenders in California for a 712‑FICO, 80% LTV, $1.4M loan with a departing residence still listed."*
- *"What DPA programs in Orange County California work for a first‑time buyer with 700 FICO?"*
- *"Plaza Home Mortgage — what's their current master credit guideline document, and which AE covers Northern California?"*
- *"Show me the structuring playbook for a sub‑580 FHA file."*

…and Cal returns answers grounded in current matrix PDFs, FHFA / HUD / VA source documents, and tribal‑knowledge intel curated by working brokers.

## Why this matters

The mortgage industry has spent a decade in the "everybody buys Encompass" era. AI hasn't touched the workflow because the source data is gated, fragmented, and expires. Cal's library — built from broker‑portal scrapes, indexed weekly, kept current — is the data layer that makes any mortgage AI actually useful. This MCP server is how that data reaches every agent platform built on top of MCP.

If you're an LO, this means asking Claude (or Cursor, or your own agent) the same questions you used to dig through PDFs to answer — and getting an answer in seconds with a source citation.

## Tools

The server exposes eight tools:

| Name | Purpose |
|---|---|
| `cal_fact_lookup` | FHFA conforming loan limits, FHA loan limits, VA funding fee, FHA MIP, agency DTI caps. County‑level. 50 states + DC. |
| `cal_search_lenders` | Scenario‑aware wholesale‑lender finder. Pass FICO / LTV / loan amount / state / occupancy → ranked top 5 (or top 15 with `expand=true`) with score, qualifying reasons, blockers. |
| `cal_lender_details` | Full record for one lender — programs, state licenses, AE contact, broker portal URL, status, recent matrix dates. |
| `cal_lender_documents` | List indexed matrices / handbooks / overlays for a lender. Sorted master → current → superseded. Each doc includes a short extracted summary. |
| `cal_dpa_search` | Down‑payment‑assistance programs by state / county / city / FTHB / type. Up to 25 ranked programs with provider URLs. |
| `cal_lender_intel` | Tribal‑knowledge intel — strengths, watch‑outs, speed notes, scenarios they love, scenarios to avoid, AE contacts. Pass `intent` to narrow. |
| `cal_scenario_pattern` | Structuring playbooks for hard scenarios: departing residence, ITIN / foreign national, sub‑580 FHA, renovation, super‑jumbo, plus the matrix‑freshness citation rule. |
| `cal_valuation` | ValueGuard comparable-sales valuation. Pass the subject (price + sqft) and 4+ comps, get the indicated market value, a floor/ceiling range, an over/under-priced verdict, a confidence level, and the comps used. A list-price rebuttal in seconds. |

The tool surface mirrors Cal's internal tool‑use schema, so any model (Claude Sonnet, Opus, Haiku, GPT‑4o, Gemini, …) that calls them gets the same shape Cal itself uses.

## Install

### Claude Desktop (macOS / Windows)

Add this to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "cal": {
      "command": "npx",
      "args": ["-y", "@askcal/mcp-server"],
      "env": {
        "CAL_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

Restart Claude Desktop. The `cal` tools appear in the slash menu.

### Cursor

Settings → MCP → Add Server, then paste the same JSON.

### Continue / VS Code

`~/.continue/config.json` → `mcpServers` block, same shape.

### Local dev (clone + link)

```bash
git clone https://github.com/askcal/cal-mcp-server.git
cd cal-mcp-server
npm install
npm run build
# Then point your MCP client at dist/index.js with `node` as the command
# and an absolute path in args[0].
```

## Getting a token

`CAL_API_TOKEN` is an opaque bearer token. **Use a long‑lived API key, not a session token** — session tokens from `/auth/login` expire after 8 hours, which means an MCP client config that worked today returns 401 tomorrow.

### Recommended — long‑lived API key (`cal_live_…`)

Sign up at [api.askcal.io](https://api.askcal.io) (request access if you don't have a key yet — broker LOs are auto‑approved). Then:

```bash
# 1. Get a short‑lived session token from /auth/login
SESSION=$(curl -s -X POST https://api.askcal.io/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://askcal.io" \
  -d '{"email":"<your-email>","password":"<your-password>","portal":"team"}' \
  | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

# 2. Mint a long‑lived API key
curl -X POST https://api.askcal.io/auth/api-keys \
  -H "Content-Type: application/json" \
  -H "Origin: https://askcal.io" \
  -H "Authorization: Bearer $SESSION" \
  -d '{"label":"my-claude-desktop"}'
```

The response includes a `key` field starting with `cal_live_`. **Copy it now — it's only shown once.** Use it as `CAL_API_TOKEN`. The key has no expiry; revoke it any time with `DELETE /auth/api-keys/<id>` (list yours with `GET /auth/api-keys`).

### Fallback — session token

If you just want to try a tool call quickly, the session token from `/auth/login` works too (8‑hour TTL). Don't put one in a long‑lived MCP config.

### v0.2 preview

OAuth 2.1 with PKCE is on the roadmap so MCP clients can run the consent flow themselves. Until then, the API key flow above is the recommended path.

## Verify it works

After installing, ask your MCP client:

> *"What's the 2026 conforming loan limit in Alameda County CA?"*

You should get back something like:

```
$1,229,100 (FHFA 2026 Conforming Loan Limits, announced 2025‑11‑26).
High‑balance HCOL county. Anything above this is a jumbo loan.
```

If you don't, check:

1. The token isn't expired — Cal session tokens last 24 hours by default. Refresh via `/auth/login`.
2. Network can reach `https://api.askcal.io`.
3. Your MCP client picked up the config — restart it after editing.

## Configuration

| Env var | Required | Default | Notes |
|---|---|---|---|
| `CAL_API_TOKEN` | yes | — | Bearer token from `/auth/login`. |
| `CAL_API_BASE_URL` | no | `https://api.askcal.io` | Override only if you're testing against a Cal instance other than production. |

## Data scope

Calls are scoped to the *list* tied to your token. If you're a broker LO with a curated approved‑lender list, results are filtered to lenders you can actually use. Cal will not leak across approved lists. The founder's demo list is the broadest, at 166 lenders.

## License

MIT. The wrapper code is open. Cal's curated lender library, DPA program data, and lender intel are proprietary and remain behind the API.

## About Cal

Cal is the AI mortgage platform at [askcal.io](https://askcal.io), built by a 17‑year industry veteran (NMLS 275073) for working brokers. Production state at this release:

- 166 wholesale lenders, 1,424 indexed program documents, 250 DPA programs, 50 states
- 4 LOs in pilot, 342 questions answered in the first 24 hours of soft‑launch
- $500K committed + $1.5M soft‑committed → $2M seed target


## Roadmap

- **v0.1** - 7 tools, API-key auth, stdio transport, npm + GitHub.
- **v0.2** *(current)* - ValueGuard valuation (`cal_valuation`), 8 tools total; repointed to the askcal.io API.
- **v0.3** - OAuth 2.1 with PKCE. `.dxt` Claude Desktop bundle. Optimal Blue MCP companion server.
- **v0.4** - Streamable HTTP transport. Public agency MCPs (Fannie Selling Guide, Freddie Guide, FHA Handbook 4000.1, VA Handbook 26-7, FHFA limits, HUD AMI).
- **v0.5** - Encompass MCP companion (LOS read/write). DocuSign MCP companion. One prompt fires across CRM + email + calendar + pricing + library.

## Contributing

Issues and PRs welcome. The roadmap above is the priority order; if you want to take a piece, open an issue first so we don't dual‑track.

## Contact

Chris Black · NMLS 275073 · chris@askcal.io · 925‑286‑7681
