# Perpanic React App

This project powers the Perpanic marketing site, including a contact form that can post to serverless handlers deployed on Netlify (staging) and Vercel (production).

## Requirements

- Node.js 18+
- npm 9+ (or another compatible package manager)

Install dependencies:

```bash
cd react-app
npm install
```

## Environment configuration

Copy `env.example` to `.env` (for Netlify) or `.env.local` (for Vercel) and fill in the values:

```
RESEND_API_KEY=your-resend-api-key
CONTACT_FROM_EMAIL=noreply@example.com
CONTACT_RECIPIENT_EMAIL=client@example.com
CONTACT_DEV_MODE=true
```

- `CONTACT_DEV_MODE=true` keeps emails from being sent during development and logs the payload to the console. Remove or set it to `false` when you want to exercise the real email integration locally.
- When `CONTACT_DEV_MODE` is `false`, the `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_RECIPIENT_EMAIL` variables must all be provided or the handler will return a 500 error.

## Local development options

### 1. Netlify (mirrors staging)

```bash
cd react-app
npx netlify-cli@latest dev
```

- Netlify Dev will start Vite and the Functions runtime (usually on `http://localhost:8888`).
- The SPA continues to call `/api/contact`; Netlify automatically proxies the request to `/.netlify/functions/contact`.
- Logs for the serverless function appear in the Netlify terminal session. When `CONTACT_DEV_MODE=true`, the handler prints the mocked email payload there.

### 2. Vercel (mirrors production)

```bash
cd react-app
npx vercel@latest dev --listen 5173
```

- Vercel Dev serves the app at `http://localhost:5173` by default. Adjust `--listen` if that port is taken.
- The `/api/contact` route is handled by `api/contact.ts` exactly as it will be in production.
- Provide the same environment variables in `.env.local` so that Vercel Dev can expose them.

## Manual testing

With either dev server running, submit the contact form in the browser. You can also exercise the endpoint with `curl`:

```bash
curl -X POST http://localhost:8888/api/contact \
  -H "Content-Type: application/json" \
  -d '{
        "fullName": "Test User",
        "email": "test@example.com",
        "phoneNumber": "555-1234",
        "reason": "booking",
        "eventName": "Launch Party",
        "eventLocation": "Perth",
        "audienceSize": "200"
      }'
```

Adjust the host/port for Vercel (`http://localhost:5173/api/contact`). When `CONTACT_DEV_MODE=true`, the handler returns `{ "ok": true, "mocked": true }` and logs the payload instead of sending mail.

## Production build

```bash
npm run build
```

This produces static assets in `dist/`, suitable for deployment via Netlify or Vercel.
