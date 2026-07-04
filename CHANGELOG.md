# Changelog

## 0.2.0 - 2026-07-03

Relaunch as Cal (askcal.io) + ValueGuard.

- **Repointed to the Cal API.** `DEFAULT_BASE_URL` is now `https://api.askcal.io`;
  the legacy `vault.homeloanexpress.ai` host is retired. Users who set
  `CAL_API_BASE_URL` explicitly need no change.
- **Rebranded** the package to `@askcal/mcp-server`. Docs, URLs, homepage, and
  the contact address now point at askcal.io. The server-side `Origin` header
  is the canonical Cal origin.
- **New tool `cal_valuation`** (8 tools total): ValueGuard comparable-sales
  valuation. Pass a subject property and 4+ comps, get an indicated market
  value, floor/ceiling range, over/under-priced verdict, confidence, and the
  comps used. Backed by the Cal API `valuation_report` executor.
- No breaking changes to the seven existing tool schemas.

## 0.1.1 — 2026-05-08

Long-lived API keys.

- Cal API now ships an `/auth/api-keys` endpoint that issues opaque
  long-lived tokens (`cal_live_…`) usable as `CAL_API_TOKEN`.  These do
  not expire after 8 hours like session tokens — the right choice for
  any MCP client whose config persists across days.
- README updated to recommend the API key path over the session-token
  path that 0.1.0 documented.
- CLAUDE_DESKTOP_SETUP.md updated with the API key flow + a note about
  Claude Desktop's modern DXT extension system (the legacy `mcpServers`
  JSON path no longer survives Claude Desktop relaunches).
- No changes to the MCP server source code itself — bearer tokens are
  opaque to the server.  The version bump is purely to signal "use the
  newer install docs."

## 0.1.0 — 2026-05-08

Initial release.

- Seven MCP tools mirroring Cal's internal tool-use schema:
  - `cal_fact_lookup`, `cal_search_lenders`, `cal_lender_details`,
    `cal_lender_documents`, `cal_dpa_search`, `cal_lender_intel`,
    `cal_scenario_pattern`.
- Stdio transport.
- API-key auth (Bearer token from `/auth/login`).
- Backed by Cal's production library: 166 lenders, 1,424 indexed documents,
  250 DPA programs, 50 states.
- Companion HTTP route layer (`/askcal/tools` + `/askcal/tools/:name`)
  shipped on the Cal API server.
- MIT license.
