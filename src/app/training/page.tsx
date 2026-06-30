'use client';

import { motion } from 'framer-motion';
import styles from './training.module.css';

const ratings = [
  { name: 'Private Pilot License', progress: 85, color: 'var(--accent-emerald)', requirements: [
    { label: 'Total Flight Time', current: 55, required: 40, unit: 'hrs' },
    { label: 'Solo Cross-Country', current: 8, required: 5, unit: 'hrs' },
    { label: 'Night Flight', current: 2.8, required: 3, unit: 'hrs' },
    { label: 'Instrument Training', current: 3, required: 3, unit: 'hrs' },
  ]},
  { name: 'Instrument Rating', progress: 62, color: 'var(--accent-cyan)', requirements: [
    { label: 'Instrument Time', current: 31, required: 50, unit: 'hrs' },
    { label: 'Cross-Country PIC', current: 45, required: 50, unit: 'hrs' },
    { label: 'Instrument Approaches', current: 52, required: 0, unit: '' },
  ]},
  { name: 'Commercial Pilot License', progress: 25, color: 'var(--accent-amber)', requirements: [
    { label: 'Total Time', current: 148, required: 250, unit: 'hrs' },
    { label: 'PIC Time', current: 85, required: 100, unit: 'hrs' },
    { label: 'Cross-Country PIC', current: 32, required: 50, unit: 'hrs' },
  ]},
];

const endorsements = [
  { title: 'Solo Flight Endorsement', date: 'Mar 15, 2025', instructor: 'James Mitchell, CFI' },
  { title: 'Solo Cross-Country', date: 'May 2, 2025', instructor: 'James Mitchell, CFI' },
  { title: 'Knowledge Test Endorsement', date: 'Aug 10, 2025', instructor: 'James Mitchell, CFI' },
  { title: 'Checkride Endorsement', date: 'Sep 22, 2025', instructor: 'Sarah Chen, CFI/CFII' },
];

const achievements = [
  { icon: '🌙', name: 'Night Owl', desc: '100+ night hours', unlocked: false },
  { icon: '🌍', name: 'Globe Trotter', desc: '50+ airports visited', unlocked: true },
  { icon: '⛈️', name: 'Weather Warrior', desc: '50+ instrument hours', unlocked: false },
  { icon: '🎓', name: 'Mentor', desc: 'Endorsed 10+ students', unlocked: false },
  { icon: '✈️', name: 'Century Mark', desc: '100+ flights logged', unlocked: true },
  { icon: '🏆', name: 'Iron Pilot', desc: '500+ total hours', unlocked: true },
];

function ProgressRing({ progress, color, size = 120 }: { progress: number; color: string; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className={styles.ring}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size/2} cy={size/2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={circumference}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="white" fontSize="1.4rem" fontWeight="700" fontFamily="var(--font-mono)">
        {progress}%
      </text>
    </svg>
  );
}

export default function TrainingPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Training & Progress</h1>
          <p className={styles.subtitle}>Track your journey toward certificates, endorsements, and achievements</p>
        </motion.div>

        {/* Ratings Progress */}
        <h2 className={styles.sectionTitle}>Ratings Progress</h2>
        <div className={styles.ratingsGrid}>
          {ratings.map((r, i) => (
            <motion.div key={r.name} className={styles.ratingCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className={styles.ratingTop}>
                <ProgressRing progress={r.progress} color={r.color} />
                <h3 className={styles.ratingName}>{r.name}</h3>
              </div>
              <div className={styles.requirements}>
                {r.requirements.map((req) => (
                  <div key={req.label} className={styles.reqRow}>
                    <div className={styles.reqInfo}>
                      <span className={styles.reqLabel}>{req.label}</span>
                      <span className={styles.reqValues}>
                        {req.current}{req.unit ? ` ${req.unit}` : ''}{req.required > 0 ? ` / ${req.required} ${req.unit}` : ''}
                      </span>
                    </div>
                    {req.required > 0 && (
                      <div className={styles.reqBar}>
                        <div className={styles.reqBarFill} style={{ width: `${Math.min(100, (req.current / req.required) * 100)}%`, background: r.color }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Endorsements */}
        <h2 className={styles.sectionTitle} style={{ marginTop: 'var(--space-16)' }}>Endorsements</h2>
        <div className={styles.endorsementList}>
          {endorsements.map((e, i) => (
            <motion.div key={e.title} className={styles.endorsementItem} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <div className={styles.endorseDot} />
              <div>
                <span className={styles.endorseTitle}>{e.title}</span>
                <span className={styles.endorseMeta}>{e.date} · {e.instructor}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <h2 className={styles.sectionTitle} style={{ marginTop: 'var(--space-16)' }}>Achievements</h2>
        <div className={styles.achieveGrid}>
          {achievements.map((a, i) => (
            <motion.div key={a.name} className={`${styles.achieveCard} ${a.unlocked ? styles.achieveUnlocked : styles.achieveLocked}`} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <span className={styles.achieveIcon}>{a.icon}</span>
              <span className={styles.achieveName}>{a.name}</span>
              <span className={styles.achieveDesc}>{a.desc}</span>
              {!a.unlocked && <span className={styles.achieveLock}>🔒</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
