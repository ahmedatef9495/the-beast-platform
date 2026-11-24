# THE BEAST Trading Platform — Starter

This is Phase 1: a responsive React/Vite charting shell using TradingView Lightweight Charts.

## Run locally
1. Install Node.js 20 or newer.
2. In this folder run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the local URL printed by Vite.

## Important data notice
The candles and snapshot figures are synthetic placeholders generated in `src/data.js`. They are NOT EGX, US, Arab-market, FX, crypto, or gold prices. Do not use them for trading.

## Next engineering steps
1. Replace the synthetic generator with provider adapters that normalize OHLCV data.
2. Verify market coverage, history depth, delay, commercial display rights, and redistribution terms for every provider before public launch.
3. Add symbol search and exchange-specific instrument metadata.
4. Add indicator modules (RSI, MACD, OBV, CMF, MFI) and drawing tools.
5. Add Supabase authentication, watchlists, saved layouts, and server-side API-key protection.
6. Deploy the static frontend to Cloudflare Pages.

## Chart library attribution
This project uses TradingView Lightweight Charts under Apache 2.0. Keep the required TradingView attribution and NOTICE file/link visible in the public product as described in the official documentation: https://tradingview.github.io/lightweight-charts/docs

## Architecture
- `src/App.jsx`: responsive UI and chart initialization
- `src/data.js`: demo candles and normalized OHLCV contract
- `src/styles.css`: dark responsive theme

## Not included yet
- Live/delayed market feed
- Real symbol directory
- Trading execution
- Financial advice or buy/sell signals
- User accounts / database
