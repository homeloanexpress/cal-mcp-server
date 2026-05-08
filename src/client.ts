/**
 * Tiny HTTP client wrapping the Cal API endpoints the MCP server cares
 * about.  Single base URL + bearer token; all requests go through one
 * `invokeTool` helper for consistency.  No axios — built-in fetch keeps
 * the dep tree to just @modelcontextprotocol/sdk.
 */

export interface CalClientOptions {
  baseUrl: string;
  token: string;
  /** Defaults to 30 s — most tool calls return in < 500 ms. */
  timeoutMs?: number;
}

export class CalApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, msg: string) {
    super(msg);
    this.status = status;
    this.body = body;
  }
}

export class CalClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly timeoutMs: number;

  constructor(opts: CalClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/+$/, '');
    this.token = opts.token;
    this.timeoutMs = opts.timeoutMs ?? 30_000;
  }

  /**
   * Invoke a Cal tool by name.  Maps onto POST /askcal/tools/:name on
   * the API.  Returns the raw `result` object the executor produced.
   */
  async invokeTool<TInput extends object, TResult = unknown>(
    name: string,
    input: TInput
  ): Promise<TResult> {
    const url = `${this.baseUrl}/askcal/tools/${encodeURIComponent(name)}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
          // Cal's CORS layer requires an explicit Origin from approved hosts.
          // The MCP server is server-side, so use the canonical app origin.
          Origin: 'https://homeloanexpress.ai',
          'User-Agent': 'cal-mcp-server/0.1.0',
        },
        body: JSON.stringify(input),
        signal: controller.signal,
      });
      const text = await res.text();
      let parsed: unknown;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch {
        parsed = text;
      }
      if (!res.ok) {
        const detail =
          (parsed && typeof parsed === 'object' && 'error' in parsed
            ? String((parsed as { error: unknown }).error)
            : `HTTP ${res.status}`) || `HTTP ${res.status}`;
        throw new CalApiError(res.status, parsed, detail);
      }
      // The route returns { tool, listId, result }; unwrap to result.
      if (parsed && typeof parsed === 'object' && 'result' in parsed) {
        return (parsed as { result: TResult }).result;
      }
      return parsed as TResult;
    } finally {
      clearTimeout(timer);
    }
  }
}
