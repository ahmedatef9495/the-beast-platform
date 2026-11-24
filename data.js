// Synthetic sample candles for interface development only — NOT real market prices.
export function makeDemoCandles(count = 140) {
  const out = [];
  let close = 18420;
  const start = new Date('2025-01-02T00:00:00Z').getTime();
  for (let i = 0; i < count; i++) {
    const drift = Math.sin(i / 8) * 18 + (Math.sin(i / 23) * 9);
    const open = close;
    close = Math.max(100, open + drift + Math.sin(i * 1.7) * 24);
    const high = Math.max(open, close) + 8 + Math.abs(Math.sin(i * 2.2) * 28);
    const low = Math.min(open, close) - 8 - Math.abs(Math.cos(i * 1.3) * 25);
    out.push({
      time: Math.floor((start + i * 86400000) / 1000),
      open: +open.toFixed(2), high: +high.toFixed(2),
      low: +low.toFixed(2), close: +close.toFixed(2),
      volume: Math.round(90000 + Math.abs(Math.sin(i * 1.4)) * 240000 + i * 700)
    });
  }
  return out;
}

// Future provider adapters should normalize their response to this OHLCV shape:
// { time: UNIX_SECONDS, open, high, low, close, volume }
export function normalizeOhlcv(rows) {
  return rows.map(r => ({
    time: Number(r.time), open: Number(r.open), high: Number(r.high),
    low: Number(r.low), close: Number(r.close), volume: Number(r.volume ?? 0)
  })).filter(r => Number.isFinite(r.time) && [r.open,r.high,r.low,r.close].every(Number.isFinite));
}
