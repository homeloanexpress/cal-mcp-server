# Changelog

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
