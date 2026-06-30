'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './about.module.css';

const beliefs = [
  'Every pilot should be using an electronic logbook',
  "Aviation is expensive enough; your logbook shouldn't add to the burden",
  'Your data is YOUR data',
  'You should have access to your data from anywhere, at any time',
  'MyFlightbook should be the best purpose-built pilot logbook out there, period.',
];

const pillars = [
  { icon: '< />', title: 'Open Source', desc: 'All code is public on GitHub. Contribute, audit, or fork — your trust is earned, not demanded.' },
  { icon: '♥', title: 'Free Forever', desc: "Not trying to be commercial means we can't go out of business for lack of profit. No nickel-and-diming." },
  { icon: '👥', title: 'Community Driven', desc: "Built by pilots, for pilots. We rely on your feedback and support to keep improving." },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div className={styles.hero} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1>About MyFlightBook</h1>
          <p className={`${styles.heroSub} gradient-text`}>Built by Pilots, for Pilots Since 2006</p>
          <p className={styles.heroDesc}>An open-source product of a passion for aviation meeting a need for a free online logbook — a way of giving back to the pilot community.</p>
        </motion.div>

        {/* Beliefs */}
        <motion.div className={styles.beliefsCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2>What We Believe</h2>
          <ul className={styles.beliefsList}>
            {beliefs.map((b, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <span className={styles.checkMark}>✓</span>{b}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Pillars */}
        <div className={styles.pillarsGrid}>
          {pillars.map((p, i) => (
            <motion.div key={p.title} className={styles.pillarCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <span className={styles.pillarIcon}>{p.icon}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {[
            { value: '26.1M', label: 'Flights Logged' }, { value: '100K+', label: 'Pilots Worldwide' },
            { value: '377.9K', label: 'Aircraft Tracked' }, { value: '20', label: 'Years of Service' },
          ].map((s, i) => (
            <motion.div key={s.label} className={styles.statCard} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div className={styles.cta} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2>Join the Community</h2>
          <p>Start logging your flights today — it&apos;s free, forever.</p>
          <Link href="/logbook" className="btn btn-primary btn-lg">Get Started</Link>
        </motion.div>
      </div>
    </div>
  );
}
