'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFlights, computeTotals, type FlightTotals } from '@/lib/api';
import styles from './training.module.css';

function ProgressRing({ progress, color, size = 110 }: { progress: number; color: string; size?: number }) {
  const sw = 7;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(progress, 100) / 100) * circ;
  return (
    <svg width={size} height={size} className={styles.ring}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={sw} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="white" fontSize="1.2rem" fontWeight="700" fontFamily="var(--font-mono)">{Math.round(progress)}%</text>
    </svg>
  );
}

interface Requirement { label: string; cur: number; req: number; unit: string }
interface Certificate {
  name: string; subtitle: string; color: string; far: string; reqs: Requirement[];
}

function buildCertificates(t: FlightTotals): Certificate[] {
  return [
    {
      name: 'Private Pilot (PPL)',
      subtitle: 'FAR 61.109',
      color: 'var(--accent-emerald)',
      far: '61.109',
      reqs: [
        { label: 'Total Flight Time', cur: t.totalTime, req: 40, unit: 'hrs' },
        { label: 'Dual Instruction', cur: t.dual, req: 20, unit: 'hrs' },
        { label: 'Solo / PIC Time', cur: t.pic, req: 10, unit: 'hrs' },
        { label: 'Night Flight', cur: t.night, req: 3, unit: 'hrs' },
        { label: 'Night Landings (full-stop)', cur: t.nightLandings, req: 10, unit: '' },
        { label: 'Instrument Training', cur: t.instrument + t.simInstrument, req: 3, unit: 'hrs' },
        { label: 'Cross-Country (dual)', cur: t.crossCountry, req: 3, unit: 'hrs' },
      ],
    },
    {
      name: 'Instrument Rating (IR)',
      subtitle: 'FAR 61.65',
      color: 'var(--accent-cyan)',
      far: '61.65',
      reqs: [
        { label: 'Instrument Flight Time', cur: t.instrument + t.simInstrument, req: 40, unit: 'hrs' },
        { label: 'Cross-Country PIC', cur: t.crossCountry, req: 50, unit: 'hrs' },
        { label: 'Instrument Approaches', cur: t.approaches, req: 0, unit: '' },
      ],
    },
    {
      name: 'Commercial Pilot (CPL)',
      subtitle: 'FAR 61.129',
      color: 'var(--accent-amber)',
      far: '61.129',
      reqs: [
        { label: 'Total Flight Time', cur: t.totalTime, req: 250, unit: 'hrs' },
        { label: 'PIC Time', cur: t.pic, req: 100, unit: 'hrs' },
        { label: 'PIC Cross-Country', cur: t.crossCountry, req: 50, unit: 'hrs' },
        { label: 'Instrument Time', cur: t.instrument + t.simInstrument, req: 10, unit: 'hrs' },
        { label: 'Night PIC', cur: t.night, req: 5, unit: 'hrs' },
      ],
    },
    {
      name: 'Airline Transport Pilot (ATP)',
      subtitle: 'FAR 61.159',
      color: 'var(--accent-purple)',
      far: '61.159',
      reqs: [
        { label: 'Total Flight Time', cur: t.totalTime, req: 1500, unit: 'hrs' },
        { label: 'PIC Time', cur: t.pic, req: 250, unit: 'hrs' },
        { label: 'Cross-Country Time', cur: t.crossCountry, req: 500, unit: 'hrs' },
        { label: 'Night Time', cur: t.night, req: 100, unit: 'hrs' },
        { label: 'Instrument Time', cur: t.instrument + t.simInstrument, req: 75, unit: 'hrs' },
      ],
    },
  ];
}

export default function TrainingPage() {
  const [totals, setTotals] = useState<FlightTotals | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getFlights().then((f) => {
      setTotals(computeTotals(f));
      setMounted(true);
    });
  }, []);

  if (!mounted || !totals) return <div className={styles.page} />;

  const certificates = buildCertificates(totals);

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Training & Progress</h1>
          <p className={styles.subtitle}>Minimum requirements for FAA certificates — computed from your logged flights</p>
        </motion.div>

        {/* Certificate Progress Cards */}
        <div className={styles.certsGrid}>
          {certificates.map((cert, ci) => {
            const validReqs = cert.reqs.filter((r) => r.req > 0);
            const overallProgress = validReqs.length > 0
              ? (validReqs.reduce((s, r) => s + Math.min(1, r.cur / r.req), 0) / validReqs.length) * 100
              : 0;

            return (
              <motion.div key={cert.name} className={styles.certCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}>
                <div className={styles.certHeader}>
                  <ProgressRing progress={overallProgress} color={cert.color} />
                  <div className={styles.certInfo}>
                    <h3 className={styles.certName}>{cert.name}</h3>
                    <span className={styles.certFar}>{cert.subtitle}</span>
                    <span className={styles.certStatus}>
                      {overallProgress >= 100 ? (
                        <span className={styles.metBadge}>✓ Minimums Met</span>
                      ) : (
                        <span className={styles.progressText}>{Math.round(overallProgress)}% complete</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className={styles.reqsList}>
                  {cert.reqs.map((req) => {
                    if (req.req === 0) return null;
                    const pct = Math.min(100, (req.cur / req.req) * 100);
                    const met = pct >= 100;
                    return (
                      <div key={req.label} className={`${styles.reqRow} ${met ? styles.reqMet : ''}`}>
                        <div className={styles.reqTop}>
                          <span className={styles.reqLabel}>
                            {met && <span className={styles.reqCheck}>✓</span>}
                            {req.label}
                          </span>
                          <span className={styles.reqVals}>
                            {req.unit === 'hrs' ? req.cur.toFixed(1) : req.cur}
                            <span className={styles.reqSlash}> / </span>
                            {req.req}{req.unit ? ` ${req.unit}` : ''}
                          </span>
                        </div>
                        <div className={styles.reqBar}>
                          <motion.div
                            className={styles.reqFill}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: ci * 0.1 + 0.2 }}
                            style={{ background: met ? cert.color : cert.color }}
                          />
                        </div>
                        {!met && (
                          <span className={styles.reqRemaining}>
                            {req.unit === 'hrs'
                              ? `${(req.req - req.cur).toFixed(1)} hrs remaining`
                              : `${req.req - req.cur} remaining`}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <motion.div className={styles.quickStats} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className={styles.sectionTitle}>Your Flying Summary</h2>
          <div className={styles.statsGrid}>
            {[
              { label: 'Total Time', value: `${totals.totalTime.toFixed(1)} hrs` },
              { label: 'PIC', value: `${totals.pic.toFixed(1)} hrs` },
              { label: 'Night', value: `${totals.night.toFixed(1)} hrs` },
              { label: 'Instrument', value: `${(totals.instrument + totals.simInstrument).toFixed(1)} hrs` },
              { label: 'Cross-Country', value: `${totals.crossCountry.toFixed(1)} hrs` },
              { label: 'Dual', value: `${totals.dual.toFixed(1)} hrs` },
              { label: 'Total Landings', value: totals.landings.toLocaleString() },
              { label: 'Night Landings', value: totals.nightLandings.toLocaleString() },
              { label: 'Approaches', value: totals.approaches.toLocaleString() },
              { label: 'Total Flights', value: totals.flightCount.toLocaleString() },
            ].map((s) => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={styles.statValue}>{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
