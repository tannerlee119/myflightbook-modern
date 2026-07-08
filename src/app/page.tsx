'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  getFlights, getAircraft, computeTotals, computeCurrency,
  computeCostSummary, type Flight, type CurrencyItem, type FlightTotals,
} from '@/lib/storage';
import styles from './home.module.css';

export default function Dashboard() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [totals, setTotals] = useState<FlightTotals | null>(null);
  const [currency, setCurrency] = useState<CurrencyItem[]>([]);
  const [aircraftCount, setAircraftCount] = useState(0);
  const [costSummary, setCostSummary] = useState<ReturnType<typeof computeCostSummary> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const f = getFlights();
    setFlights(f);
    setTotals(computeTotals(f));
    setCurrency(computeCurrency(f));
    setAircraftCount(getAircraft().length);
    setCostSummary(computeCostSummary());
    setMounted(true);
  }, []);

  if (!mounted) return <div className={styles.page} />;

  const now = new Date();
  const monthStr = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const monthFlights = flights.filter((f) => f.date >= monthStart);
  const recentFlights = flights.slice(0, 5);

  const fmt = (n: number) => n.toFixed(1);
  const fmtCurrency = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Welcome */}
        <motion.div className={styles.welcome} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={styles.greeting}>Dashboard</h1>
          <p className={styles.date}>{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </motion.div>

        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          {[
            { label: 'Total Hours', value: fmt(totals?.totalTime ?? 0), accent: 'cyan' },
            { label: 'Flights This Month', value: String(monthFlights.length), accent: 'emerald' },
            { label: 'Aircraft', value: String(aircraftCount), accent: 'amber' },
            { label: `Spent in ${now.toLocaleDateString('en-US', { month: 'short' })}`, value: fmtCurrency(costSummary?.monthTotal ?? 0), accent: 'purple' },
          ].map((s, i) => (
            <motion.div key={s.label} className={`${styles.statCard} ${styles[`accent_${s.accent}`]}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statValue}>{s.value}</span>
            </motion.div>
          ))}
        </div>

        <div className={styles.columns}>
          {/* Recent Flights */}
          <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className={styles.cardHeader}>
              <h3>Recent Flights</h3>
              <Link href="/logbook" className={styles.viewAll}>View all →</Link>
            </div>
            {recentFlights.length === 0 ? (
              <p className={styles.emptyMsg}>No flights logged yet. <Link href="/logbook">Add one →</Link></p>
            ) : (
              <div className={styles.flightList}>
                {recentFlights.map((f) => (
                  <div key={f.id} className={styles.flightRow}>
                    <div className={styles.flightDate}>
                      {new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className={styles.flightInfo}>
                      <span className={styles.flightRoute}>{f.route || '—'}</span>
                      <span className={styles.flightMeta}>{f.aircraft} · {f.model}</span>
                    </div>
                    <span className={styles.flightTime}>{fmt(f.totalTime)}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right column */}
          <div className={styles.rightCol}>
            {/* Currency */}
            <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className={styles.cardHeader}>
                <h3>Currency Status</h3>
              </div>
              <div className={styles.currencyList}>
                {currency.map((c) => (
                  <div key={c.name} className={styles.currencyRow}>
                    <span className={`${styles.dot} ${styles[`dot_${c.status}`]}`} />
                    <div>
                      <span className={styles.currencyName}>{c.name}</span>
                      <span className={styles.currencyDetail}>{c.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Costs */}
            <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className={styles.cardHeader}>
                <h3>Cost Summary</h3>
                <Link href="/costs" className={styles.viewAll}>Details →</Link>
              </div>
              <div className={styles.costRows}>
                <div className={styles.costRow}>
                  <span className={styles.costLabel}>{monthStr}</span>
                  <span className={styles.costValue}>{fmtCurrency(costSummary?.monthTotal ?? 0)}</span>
                </div>
                <div className={styles.costRow}>
                  <span className={styles.costLabel}>{now.getFullYear()} YTD</span>
                  <span className={styles.costValue}>{fmtCurrency(costSummary?.yearTotal ?? 0)}</span>
                </div>
                <div className={styles.costRow}>
                  <span className={styles.costLabel}>All Time</span>
                  <span className={styles.costValue}>{fmtCurrency(costSummary?.allTimeTotal ?? 0)}</span>
                </div>
                {totals && totals.totalTime > 0 && (
                  <div className={`${styles.costRow} ${styles.costHighlight}`}>
                    <span className={styles.costLabel}>Cost / Hour</span>
                    <span className={styles.costValue}>{fmtCurrency((costSummary?.allTimeTotal ?? 0) / totals.totalTime)}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Add */}
        <motion.div className={styles.quickAdd} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Link href="/logbook" className="btn btn-primary btn-lg">
            + Log a Flight
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
