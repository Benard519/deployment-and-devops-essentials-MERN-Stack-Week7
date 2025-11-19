## Monitoring & Observability

### 1. Sentry (Error Monitoring)

1. Create a Sentry project (JavaScript -> Node.js).
2. Add `SENTRY_DSN` to the backend environment.
3. Wire up the SDK near the top of `server/server.js`:

```js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
// ...routes...
app.use(Sentry.Handlers.errorHandler());
```

4. Optionally add browser SDK inside `client/src/main.jsx` for UI issues.

### 2. UptimeRobot (Availability)

1. Create HTTP monitors for:
   - Backend `https://<api-domain>/health`
   - Frontend `https://<frontend-domain>/`
2. Set interval (5 minutes recommended) and configure alert contacts (email/Slack).

### 3. Render Logs & Alerts

- Enable “Auto deploy” and “Notification on failure” inside Render dashboard.
- Use Render’s log stream to tail production logs or pipe them to a SIEM.

### 4. PM2 (Self-host / VPS)

If deploying on a VPS instead of Render:

```bash
npm install -g pm2
cd server
pm2 start server.js --name socketio-chat-api
pm2 save
pm2 startup
```

Configure log rotation with `pm2 install pm2-logrotate`.

### 5. Frontend Performance

- Enable Vercel Analytics or add [Calibre](https://calibreapp.com/).
- Use Chrome Lighthouse CI or SpeedCurve to monitor LCP/FID/CLS.
- Capture metrics with `web-vitals` package and send to an analytics endpoint if desired.


