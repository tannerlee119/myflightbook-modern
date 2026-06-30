'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './pricing.module.css';

const features = [
  { name: 'Flight Logging', mfb: true, a: true, b: true },
  { name: 'Currency Tracking', mfb: true, a: true, b: false },
  { name: 'Print Layouts (Jeppesen, EASA)', mfb: true, a: false, b: true },
  { name: 'Cloud Backup', mfb: true, a: true, b: true },
  { name: 'Mobile Apps (iOS + Android)', mfb: true, a: true, b: true },
  { name: 'Import / Export (CSV, Excel)', mfb: true, a: true, b: false },
  { name: 'Instructor Features & Signatures', mfb: true, a: false, b: false },
  { name: 'Custom Flight Properties (600+)', mfb: true, a: false, b: false },
  { name: 'Flying Club Management', mfb: true, a: false, b: false },
  { name: '8710 / IACRA Reports', mfb: true, a: false, b: false },
  { name: 'Airline Schedule Import', mfb: true, a: false, b: true },
  { name: 'Open Source', mfb: true, a: false, b: false },
];

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1><span className="gradient-text">Why MyFlightBook?</span></h1>
          <p className={styles.subtitle}>Free forever. No catches. Compare us to the competition.</p>
        </motion.div>

        <motion.div className={styles.tableWrap} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.featureCol}>Feature</th>
                <th className={styles.mfbCol}>
                  <span className={styles.colBadge}>✈ MyFlightBook</span>
                </th>
                <th>Competitor A</th>
                <th>Competitor B</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <motion.tr key={f.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                  <td className={styles.featureName}>{f.name}</td>
                  <td className={styles.mfbCol}>{f.mfb ? <span className={styles.check}>✓</span> : <span className={styles.cross}>✕</span>}</td>
                  <td>{f.a ? <span className={styles.checkDim}>✓</span> : <span className={styles.cross}>✕</span>}</td>
                  <td>{f.b ? <span className={styles.checkDim}>✓</span> : <span className={styles.cross}>✕</span>}</td>
                </motion.tr>
              ))}
              <tr className={styles.priceRow}>
                <td className={styles.featureName}>Price</td>
                <td className={styles.mfbCol}><span className={`${styles.freeLabel} gradient-text`}>Free Forever</span></td>
                <td><span className={styles.priceLabel}>$9.99/mo</span></td>
                <td><span className={styles.priceLabel}>$14.99/mo</span></td>
              </tr>
            </tbody>
          </table>
        </motion.div>

        <motion.div className={styles.cta} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2>Ready to Switch?</h2>
          <p>Join 100,000+ pilots who already trust MyFlightBook.</p>
          <Link href="/logbook" className="btn btn-primary btn-lg">Start Logging Free</Link>
        </motion.div>
      </div>
    </div>
  );
}
