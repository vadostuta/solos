# Live Backend Integration

## Environment Configuration
- `VITE_API_BASE_URL` (default: `https://ceorlish-unfavoring-shakita.ngrok-free.dev`)
- `VITE_USE_MOCK_FALLBACK` (default: `false`; set to `true` only when the API is unavailable and you must rely on local mock data)

### Sample `.env.local`
```
VITE_API_BASE_URL=https://ceorlish-unfavoring-shakita.ngrok-free.dev
VITE_USE_MOCK_FALLBACK=false
```

## Running the Dashboard Against the Live API
1. `npm install`
2. `npm run dev`
3. In the browser, ensure that the ngrok tunnel is live and supports HTTPS requests before loading the dashboard.

## Current Behaviour
- Financial queries (`received-income`, `expected-income`, `expenses`) now call the live API and only fall back to mock data when `VITE_USE_MOCK_FALLBACK` is explicitly enabled.
- Insights fetch from `/api/Insights/financial`; mock insight generation requires payout and expense data when the live endpoint is unavailable.
- Platform filtering uses the channel list from `/api/Channels`. Channel names must match known platform identifiers (`Amazon`, `Shopify`, `Stripe`, `Etsy`) for filtering to apply.

## Known Follow-ups
- Live authentication/authorization headers are still a TODO.
- `/api/Products` endpoints are available in the backend but not yet wired into the UI.
- The Vite build currently fails in this environment because `.env` cannot be read (sandbox permission issue). Running locally outside the sandbox should unblock the build.

