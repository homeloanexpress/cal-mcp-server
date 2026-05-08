# Distribution kit — cal-mcp-server v0.1 launch

Don't ship the MCP server quietly. The wedge is the build *plus* the announcement. Day‑0 actions and ready‑to‑post copy are below.

## Day‑0 (launch day, ~60 minutes of human work)

- [ ] Create the GitHub org `homeloanexpress` (or `homeloanexpress-ai` if taken). Add Chris as owner.
- [ ] Push this repo to `homeloanexpress/cal-mcp-server`. Mark public, MIT license, descriptive about‑text, topics: `mcp` `model-context-protocol` `mortgage` `claude` `homeloanexpress`.
- [ ] Create release `v0.1.0` with the changelog body. Attach the npm tarball.
- [ ] Publish to npm: `npm publish --access public`. (Requires npm org `@homeloanexpress` — claim it now.)
- [ ] Open a PR to `modelcontextprotocol/servers` adding `cal-mcp-server` to the community servers list.
- [ ] Open a PR to `punkpeye/awesome-mcp-servers` under the `Finance` or new `Mortgage` section.
- [ ] Post the Show HN draft (below).
- [ ] Post the LinkedIn announcement (below) from Chris's account.
- [ ] DM Brian Vieaux, Brian Stevens, Logan Mohtashami on X with the demo loom + GitHub link.

## Show HN draft

> **Show HN: I built the first mortgage MCP server with a real lender data moat (166 wholesale lenders, 1,400+ indexed program docs, 250 DPA programs)**
>
> I'm a 17‑year mortgage broker (NMLS 275073). For the last six months I've been building an AI tool I wished existed when I was sweating a hard scenario at 9pm — Cal, an MCP‑native mortgage platform.
>
> Today I'm open‑sourcing the MCP wrapper that lets any MCP‑compatible AI client (Claude Desktop, Cursor, Continue, Goose) talk to Cal's library: 166 wholesale lenders, 1,424 indexed matrix / handbook / overlay documents, 250 down‑payment‑assistance programs, all 50 states, refreshed weekly.
>
> What that means in practice: an LO can ask Claude Desktop "top 5 jumbo lenders in CA for a self‑employed 712‑FICO 80% LTV $1.4M loan with departing residence still listed" and get back a ranked list with AE phone numbers and qualifying reasons in under a second. Today that's 90 minutes of PDF‑digging across six broker portals.
>
> The wrapper itself is mechanical (~7 tools, all thin HTTP wrappers). The data is the moat — built by a working broker, scraped from broker‑gated portals only, kept current weekly.
>
> Why MCP specifically: the mortgage industry has zero MCP presence today. Encompass / ICE, Calyx, Empower / Fiserv haven't shipped anything. The standard is six months old and the vertical is empty. Wrapping the data we already had as MCP gets it into every current and future agent platform without modification.
>
> v0.1 is out today: API‑key auth, stdio transport, MIT license, 7 tools.
>
> v0.2 (next 4 weeks): OAuth 2.1 with PKCE, .dxt Claude Desktop bundle, Optimal Blue companion server.
>
> v0.3 (next 8 weeks): open‑source MCP wrappers for Fannie Selling Guide, Freddie Guide, FHA Handbook 4000.1, VA Handbook 26‑7. Cal becomes the maintainer of the public mortgage MCP layer.
>
> Repo: https://github.com/homeloanexpress/cal-mcp-server
> Demo: https://vault.homeloanexpress.ai
> Investor preview: available on request.
>
> Happy to answer anything about the build, the data pipeline, why mortgage is uniquely well‑suited to MCP, or what's next.

## LinkedIn post (Chris's account)

> 17 years in mortgage. Six months building the AI tool I wished existed.
>
> Today I open‑sourced the MCP wrapper that lets Claude Desktop (and Cursor, Continue, every other MCP client) talk to Cal — my AI mortgage platform with the largest broker‑accessible lender library out there. **166 wholesale lenders. 1,424 indexed program docs. 250 DPA programs. All 50 states. Refreshed weekly.**
>
> What an LO gets: ask Claude any question you'd normally have to dig through six broker portals to answer, and get a ranked, cited answer in under a second. That's 90 minutes of structuring work that becomes 30 seconds.
>
> Why this matters: the mortgage industry has *zero* MCP presence today. Encompass, Calyx, Empower — no one has shipped one. We're literally first to ship a mortgage MCP server with real data behind it.
>
> v0.1 ships today. Free. MIT licensed. Data layer is proprietary.
>
> If you're an LO using Claude Desktop and want it pointed at Cal: github.com/homeloanexpress/cal-mcp-server — install instructions take 60 seconds.
>
> If you're an investor — what we're building, why now, and the funding ask: vault.homeloanexpress.ai/pitch.html
>
> #mortgage #mcp #ai #fintech

## Trade press pitch (National Mortgage News, HousingWire, MND)

> Subject: First mortgage industry MCP server — broker‑built AI integration that LOs control directly
>
> Hi {name},
>
> Quick story tip if it fits your AI/tech beat. I'm Chris Black — 17 years originating mortgages (NMLS 275073). Today I open‑sourced what I believe is the first MCP (Model Context Protocol) server in the mortgage industry: cal‑mcp‑server.
>
> Plain English: it lets any AI assistant (Claude, Cursor, ChatGPT‑style tools) call my mortgage data — 166 wholesale lenders, 1,400+ matrix documents, 250 down‑payment‑assistance programs — directly. Loan officers can ask their AI tool a question that used to take 90 minutes of broker‑portal digging, and get a ranked answer with AE contacts and source citations in under a second.
>
> The angle: while ICE, Fiserv, Calyx, and the AI mortgage chatbot startups are still figuring out how AI fits the workflow, a working broker just shipped the integration standard the rest of the industry will eventually adopt. The data moat is what makes it work — six months of curation from broker‑gated portals.
>
> Funding context: $500K already committed, $1.5M soft‑committed toward a $2M seed.
>
> I can do a 15‑min demo (loom or live) showing the LO experience and the open‑source wrapper. The investor deck and live product are at vault.homeloanexpress.ai if you want context first.
>
> Worth a story?
>
> Chris Black
> chris@homeloanexpress.ai · 925‑286‑7681
> NMLS 275073

## Anthropic developer blog request

Email developer-experience@anthropic.com:

> Subject: Vertical MCP success story — first mortgage MCP server, open‑sourced today
>
> Hi team,
>
> Quick note in case you're collecting MCP success stories for the developer blog.
>
> I'm Chris Black — 17‑year mortgage broker (NMLS 275073). Today I open‑sourced cal‑mcp‑server, what I believe is the first mortgage industry MCP server: 7 tools wrapping a curated library of 166 wholesale lenders, 1,400+ indexed program documents, 250 down‑payment‑assistance programs across all 50 states. Built on @modelcontextprotocol/sdk (TypeScript) and stdio transport.
>
> Why I think it's worth a callout: this is a vertical where the data is gated behind broker portals, not public APIs. Every lender's matrix is a PDF; every state housing‑finance‑agency's DPA program is a different web form. Wrapping that pile as MCP took ~3 weeks of focused engineering and immediately made every MCP‑compatible client useful for working mortgage brokers — no vendor integrations required from any of the dozens of LOS / POS / pricing‑engine vendors.
>
> Repo: https://github.com/homeloanexpress/cal-mcp-server
> Demo: https://vault.homeloanexpress.ai
>
> Happy to write a guest post, do a podcast, or send screenshots / a 90‑second demo video if any of this is interesting for the dev‑rel narrative around vertical MCP servers.
>
> Chris

## Demo loom (60–90 seconds)

Script the recording so the wow happens in the first 15 seconds:

1. **0–10s** — open Claude Desktop with the `cal` server installed. Type: "What's the 2026 conforming loan limit in Alameda County CA?" Show the answer with the FHFA citation.
2. **10–25s** — type the harder one: "Top 5 wholesale jumbo lenders in CA for a 712 FICO, 80% LTV, $1.4M loan with departing residence still listed." Show the ranked list, the AE phone number on the top result, the structuring playbook reference.
3. **25–45s** — voice‑over: "This is what an LO would normally spend 90 minutes digging through six broker portals to answer. The library has 166 lenders, 1,400+ matrices, 250 DPA programs, refreshed weekly. The MCP wrapper is open source and MIT licensed."
4. **45–75s** — show the GitHub repo, the install snippet, and the npm package.
5. **75–90s** — "I'm Chris Black, 17 years in mortgage. Cal is funded with $500K committed, $1.5M soft. The deck's at vault.homeloanexpress.ai/pitch.html. Hit me up if you build on it or want to invest."

Record on QuickTime, no edits needed. Upload to Loom + YouTube + a permanent link in the README.

## Mortgage podcast outreach list

- Lykken on Lending — David Lykken
- Mortgage Marketing Animals — Carl White
- Loan Officer Freedom — Carl White / Tammy Schneider
- The Real Estate Agent Mortgage Show — Brad Wallace
- The Mortgage Brokers Workshop — Phil Treadwell
- The Loan Officer Diaries — Sara Hawley

Pitch: "I just shipped the first mortgage industry MCP server. AI for LOs that actually has the lender data behind it. Want to walk listeners through what changed?"

## Success metrics for the announce

- 500+ npm downloads in 30 days
- 100+ GitHub stars in 14 days
- 1+ piece of mortgage trade press coverage
- 10+ inbound LOs from the announcement asking for a Cal account
- Anthropic dev blog mention or call‑out
- Show HN top‑20 (modest goal — vertical posts are tough but the angle is novel)
