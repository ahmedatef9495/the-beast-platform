import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  createChart, CandlestickSeries, HistogramSeries, LineSeries,
  ColorType, CrosshairMode
} from 'lightweight-charts';
import { Activity, Bell, ChevronDown, Maximize2, Plus, Search, Settings2, Star } from 'lucide-react';
import { makeDemoCandles } from './data.js';

const markets = ['EGX', 'US Stocks', 'Arab Markets', 'Forex', 'Crypto', 'Gold & Commodities'];
const watch = [
  { symbol: 'COMI', name: 'Commercial International Bank', price: '—', change: 'EGX' },
  { symbol: 'ETEL', name: 'Telecom Egypt', price: '—', change: 'EGX' },
  { symbol: 'FWRY', name: 'Fawry', price: '—', change: 'EGX' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: '—', change: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: '—', change: 'NASDAQ' },
  { symbol: 'GC', name: 'Gold Futures', price: '—', change: 'COMEX' },
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', price: '—', change: 'CRYPTO' },
];

export default function App() {
  const chartHost = useRef(null);
  const chartApi = useRef(null);
  const [market, setMarket] = useState('EGX');
  const [symbol, setSymbol] = useState('EGX30');
  const [timeframe, setTimeframe] = useState('1D');
  const [showVolume, setShowVolume] = useState(true);
  const [showSma, setShowSma] = useState(false);
  const [search, setSearch] = useState('');
  const candles = useMemo(() => makeDemoCandles(), []);

  useEffect(() => {
    if (!chartHost.current) return;
    const chart = createChart(chartHost.current, {
      autoSize: true,
      layout: { background: { type: ColorType.Solid, color: '#0b1220' }, textColor: '#a8b4c7', fontFamily: 'Inter, system-ui, sans-serif' },
      grid: { vertLines: { color: '#172235' }, horzLines: { color: '#172235' } },
      crosshair: { mode: CrosshairMode.Normal, vertLine: { color: '#53647d', labelBackgroundColor: '#24334a' }, horzLine: { color: '#53647d', labelBackgroundColor: '#24334a' } },
      rightPriceScale: { borderColor: '#263449' },
      timeScale: { borderColor: '#263449', timeVisible: true, secondsVisible: false },
      localization: { locale: 'en-US' },
    });
    chartApi.current = chart;
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#16c784', downColor: '#ea3943',
      borderUpColor: '#16c784', borderDownColor: '#ea3943',
      wickUpColor: '#16c784', wickDownColor: '#ea3943',
    });
    candleSeries.setData(candles);
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' }, priceScaleId: '',
      lastValueVisible: false, priceLineVisible: false,
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
    volumeSeries.setData(candles.map(c => ({
      time: c.time, value: c.volume,
      color: c.close >= c.open ? 'rgba(22,199,132,.48)' : 'rgba(234,57,67,.48)'
    })));
    const sma = chart.addSeries(LineSeries, {
      color: '#f5b942', lineWidth: 2, title: 'SMA 20',
      lastValueVisible: false, priceLineVisible: false,
    });
    const smaData = candles.map((c, i) => {
      if (i < 19) return null;
      const avg = candles.slice(i - 19, i + 1).reduce((s, x) => s + x.close, 0) / 20;
      return { time: c.time, value: avg };
    }).filter(Boolean);
    sma.setData(smaData);
    volumeSeries.applyOptions({ visible: showVolume });
    sma.applyOptions({ visible: showSma });
    chart.timeScale().fitContent();

    const observer = new ResizeObserver(() => chart.applyOptions({}));
    observer.observe(chartHost.current);
    return () => { observer.disconnect(); chart.remove(); chartApi.current = null; };
  }, [candles, showVolume, showSma]);

  const filtered = watch.filter(x => (x.symbol + ' ' + x.name).toLowerCase().includes(search.toLowerCase()));
  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">B</div><div><b>THE BEAST</b><small>TRADING PLATFORM</small></div></div>
      <div className="global-search"><Search size={16}/><input placeholder="Search markets, symbols..." value={search} onChange={e => setSearch(e.target.value)} /><kbd>⌘ K</kbd></div>
      <div className="top-actions"><span className="status"><i/> DEMO MODE</span><button className="icon-btn" aria-label="Alerts"><Bell size={18}/></button><button className="icon-btn" aria-label="Settings"><Settings2 size={18}/></button><div className="avatar">AA</div></div>
    </header>
    <div className="market-strip">{markets.map(m => <button key={m} className={market === m ? 'market-tab active' : 'market-tab'} onClick={() => setMarket(m)}>{m}</button>)}</div>
    <main className="workspace">
      <aside className="watchlist panel">
        <div className="panel-heading"><div><span className="eyebrow">YOUR MARKETS</span><h3>Watchlist</h3></div><button className="icon-btn"><Plus size={17}/></button></div>
        <div className="watch-search"><Search size={14}/><input placeholder="Filter symbols" value={search} onChange={e => setSearch(e.target.value)}/></div>
        <div className="watch-columns"><span>SYMBOL</span><span>MARKET</span></div>
        {filtered.map(item => <button className={'watch-row ' + (symbol === item.symbol ? 'selected' : '')} key={item.symbol} onClick={() => setSymbol(item.symbol)}>
          <span className="ticker"><b>{item.symbol}</b><small>{item.name}</small></span><span className="exchange">{item.change}</span>
        </button>)}
        <div className="watch-footer"><Star size={14}/> Personal watchlist</div>
      </aside>
      <section className="chart-area">
        <div className="instrument-bar">
          <div className="instrument-title"><div className="symbol-icon"><Activity size={18}/></div><div><h2>{symbol}</h2><small>{market} · Sample instrument</small></div><ChevronDown size={16}/></div>
          <div className="price-summary"><b>18,420.50</b><span className="positive">+1.24% <small>DEMO</small></span></div>
          <button className="outline-btn"><Plus size={15}/> Add to watchlist</button>
        </div>
        <div className="chart-toolbar">
          <div className="timeframes">{['1m','5m','15m','1H','4H','1D','1W','1M'].map(t => <button key={t} onClick={() => setTimeframe(t)} className={timeframe === t ? 'tf active' : 'tf'}>{t}</button>)}</div>
          <div className="chart-tools"><button className={showSma ? 'tool active' : 'tool'} onClick={() => setShowSma(!showSma)}>SMA 20</button><button className={showVolume ? 'tool active' : 'tool'} onClick={() => setShowVolume(!showVolume)}>Volume</button><button className="tool"><Maximize2 size={15}/></button></div>
        </div>
        <div className="chart-legend"><span className="legend-dot green"/> <b>O</b> 18,420.00 <b>H</b> 18,465.00 <b>L</b> 18,390.00 <b>C</b> 18,442.50 <span className="legend-demo">Synthetic sample data · {timeframe}</span></div>
        <div className="chart-wrap"><div ref={chartHost} className="chart-host"/><div className="watermark">THE BEAST</div></div>
        <div className="bottom-tabs"><button className="selected">Chart</button><button>Overview</button><button>Financials</button><button>News</button><button>Technicals</button></div>
      </section>
      <aside className="details panel">
        <div className="panel-heading"><div><span className="eyebrow">MARKET SNAPSHOT</span><h3>Overview</h3></div><button className="icon-btn"><ChevronDown size={16}/></button></div>
        <div className="snapshot-card"><span className="muted">Selected symbol</span><h2>{symbol}</h2><div className="snapshot-price">18,420.50</div><span className="positive">+226.40 (+1.24%)</span><div className="demo-note">Illustrative values only</div></div>
        <div className="stats-list"><div><span>Open</span><b>18,420.00</b></div><div><span>High</span><b>18,465.00</b></div><div><span>Low</span><b>18,390.00</b></div><div><span>Volume</span><b>—</b></div><div><span>Prev. close</span><b>18,194.10</b></div></div>
        <div className="coming-card"><div className="coming-icon"><Activity size={17}/></div><b>Technical Analysis</b><p>RSI, MACD, OBV, CMF and THE BEAST custom tools are planned for the next build.</p><span>COMING IN PHASE 2</span></div>
      </aside>
    </main>
    <footer><span>© THE BEAST · Independent market analysis workspace</span><span>Charting engine: TradingView Lightweight Charts · Demo build</span></footer>
    <div className="disclaimer">DEMO ONLY — All displayed prices and candles are synthetic placeholders, not exchange data or investment recommendations.</div>
  </div>;
}
