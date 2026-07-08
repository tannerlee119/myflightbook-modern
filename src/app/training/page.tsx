'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFlights, computeTotals, type FlightTotals } from '@/lib/storage';
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

export default function TrainingPage() {
  const [totals, setTotals] = useState<FlightTotals | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTotals(computeTotals(getFlights()));
    setMounted(true);
  }, []);

  if (!mounted || !totals) return <div className={styles.page} />;

  const t = totals;

  const ratings = [
    { name: 'Private Pilot', color: 'var(--accent-emerald)', reqs: [
      { label: 'Total Time', cur: t.totalTime, req: 40 },
      { label: 'Solo/PIC', cur: t.pic, req: 10 },
      { label: 'Cross-Country', cur: t.crossCountry, req: 3 },
      { label: 'Night', cur: t.night, req: 3 },
      { label: 'Instrument (hood)', cur: t.instrument + t.simInstrument, req: 3 },
    ]},
    { name: 'Instrument Rating', color: 'var(--accent-cyan)', reqs: [
      { label: 'Instrument Time', cur: t.instrument + t.simInstrument, req: 40 },
      { label: 'XC PIC', cur: t.crossCountry, req: 50 },
    ]},
    { name: 'Commercial Pilot', color: 'var(--accent-amber)', reqs: [
      { label: 'Total Time', cur: t.totalTime, req: 250 },
      { label: 'PIC', cur: t.pic, req: 100 },
      { label: 'XC PIC', cur: t.crossCountry, req: 50 },
      { label: 'Night', cur: t.night, req: 5 },
      { label: 'Instrument', cur: t.instrument + t.simInstrument, req: 10 },
    ]},
  ];

  const achievements = [
    { icon: '🌙', name: 'Night Owl', desc: '50+ night hours', unlocked: t.night >= 50 },
    { icon: '🌍', name: 'Explorer', desc: '100+ XC hours', unlocked: t.crossCountry >= 100 },
    { icon: '⛈️', name: 'Weather Warrior', desc: '30+ instrument hrs', unlocked: t.instrument >= 30 },
    { icon: '✈️', name: 'Century Mark', desc: '100+ flights', unlocked: t.flightCount >= 100 },
    { icon: '🏆', name: 'Iron Pilot', desc: '500+ total hours', unlocked: t.totalTime >= 500 },
    { icon: '🎯', name: 'Precision', desc: '50+ approaches', unlocked: t.approaches >= 50 },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Training & Progress</h1>
          <p className={styles.subtitle}>Track your progress toward certificates — computed from your logged flights</p>
        </motion.div>

        <h2 className={styles.sectionTitle}>Ratings Progress</h2>
        <div className={styles.ratingsGrid}>
          {ratings.map((r, ri) => {
            const totalProgress = r.reqs.reduce((s, req) => s + Math.min(1, req.cur / req.req), 0) / r.reqs.length * 100;
            return (
              <motion.div key={r.name} className={styles.ratingCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ri * 0.1 }}>
                <div className={styles.ratingTop}>
                  <ProgressRing progress={totalProgress} color={r.color} />
                  <h3 className={styles.ratingName}>{r.name}</h3>
                </div>
                <div className={styles.reqs}>
                  {r.reqs.map((req) => (
                    <div key={req.label} className={styles.reqRow}>
                      <div className={styles.reqInfo}>
                        <span className={styles.reqLabel}>{req.label}</span>
                        <span className={styles.reqVals}>{req.cur.toFixed(1)} / {req.req} hrs</span>
                      </div>
                      <div className={styles.reqBar}>
                        <div className={styles.reqFill} style={{ width: `${Math.min(100, (req.cur / req.req) * 100)}%`, background: r.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <h2 className={styles.sectionTitle} style={{ marginTop: 'var(--space-12)' }}>Achievements</h2>
        <div className={styles.achieveGrid}>
          {achievements.map((a, i) => (
            <motion.div key={a.name} className={`${styles.achieveCard} ${a.unlocked ? styles.unlocked : styles.locked}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <span className={styles.achieveIcon}>{a.icon}</span>
              <span className={styles.achieveName}>{a.name}</span>
              <span className={styles.achieveDesc}>{a.desc}</span>
              {!a.unlocked && <span className={styles.lockIcon}>🔒</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
