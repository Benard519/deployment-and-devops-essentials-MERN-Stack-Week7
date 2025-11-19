# Health Checks

## Backend

- **Endpoint:** `GET /health`
- **Purpose:** Returns JSON payload with `status`, `uptime`, `timestamp`, and the current `NODE_ENV`.
- **Usage:** Configure your probe (Render, UptimeRobot, AWS ALB, etc.) to call `https://<api-domain>/health` every minute. The handler responds with HTTP `200` if the service and MongoDB connection are healthy.
- **Automation:** Example cURL for local verification:

  ```bash
  curl -s http://localhost:5000/health | jq
  ```

## Frontend

- **Availability check:** Use an HTTP monitor that requests the deployed frontend root URL (e.g., `https://socketio-chat.vercel.app/`).
- **Expected response:** HTTP `200` with HTML containing the root `div#root`.
- **Cache busting:** Append a query string (e.g., `/?probe=uptimerobot`) to avoid CDN caching issues.

## Combined Smoke Test

1. Call frontend root to ensure the SPA is reachable.
2. Call backend `/health`.
3. Optionally issue `GET /api/health` with a valid token to confirm middleware/auth stack.


