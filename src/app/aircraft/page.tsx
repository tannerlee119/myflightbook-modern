'use client';

import { motion } from 'framer-motion';
import { mockAircraft, topModels } from '@/data/siteData';
import styles from './aircraft.module.css';

export default function AircraftPage() {
  const maxFlights = topModels[0].flights;

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div
          className={styles.pageHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>My Aircraft</h1>
            <p className={styles.subtitle}>{mockAircraft.length} aircraft in your fleet</p>
          </div>
          <button className="btn btn-primary">+ Add Aircraft</button>
        </motion.div>

        {/* Aircraft Cards */}
        <div className={styles.grid}>
          {mockAircraft.map((ac, i) => (
            <motion.div
              key={ac.tailNumber}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ '--ac-color': ac.imageColor } as React.CSSProperties}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>✈</span>
                <span className={styles.cardCategory}>{ac.category}</span>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.tailNumber}>{ac.tailNumber}</span>
                <span className={styles.modelName}>{ac.model}</span>
                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Year</span>
                    <span className={styles.metaValue}>{ac.year}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Total Hours</span>
                    <span className={styles.metaValue}>{ac.totalHours.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Most Flown Models */}
        <motion.div
          className={styles.modelsSection}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.sectionTitle}>Most Flown Models Worldwide</h2>
          <p className={styles.sectionSubtitle}>Based on flights logged across all MyFlightBook users this week</p>

          <div className={styles.modelsList}>
            {topModels.map((m, i) => (
              <motion.div
                key={m.model}
                className={styles.modelRow}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <span className={styles.modelRank}>{i + 1}</span>
                <div className={styles.modelInfo}>
                  <span className={styles.modelName2}>{m.model}</span>
                  <div className={styles.modelBarOuter}>
                    <motion.div
                      className={styles.modelBarInner}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(m.flights / maxFlights) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.04 + 0.2 }}
                    />
                  </div>
                </div>
                <span className={styles.modelCount}>{m.flights.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
