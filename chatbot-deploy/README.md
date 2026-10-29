# Chat Assistant

Static frontend (`public/index.html`) + a serverless function that calls the Anthropic API.
Your API key stays on the server, never in the browser.

Get a key at https://console.anthropic.com, then set it as the environment variable `ANTHROPIC_API_KEY`.

## Vercel
1. Push this folder to a GitHub repo and import it at vercel.com/new (Framework Preset: Other).
2. Project Settings > Environment Variables: add `ANTHROPIC_API_KEY`.
3. Deploy. (Or from this folder: `npx vercel --prod`.)

## Netlify
1. Push to GitHub and import at app.netlify.com (netlify.toml is picked up automatically).
2. Site settings > Environment variables: add `ANTHROPIC_API_KEY`.
3. Deploy. (Or: `npx netlify deploy --prod`.)

## Local testing
`npx vercel dev` or `npx netlify dev` (put the key in a local `.env`).

Optional: set `ANTHROPIC_MODEL` to change the model (default `claude-sonnet-5-5`).
Before going public, consider adding rate limiting, since anyone with the URL can spend your API credits.
