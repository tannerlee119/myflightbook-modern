'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { topAirports } from '@/data/siteData';
import styles from './airports.module.css';

export default function AirportsPage() {
  const [search, setSearch] = useState('');
  const maxFlights = topAirports[0].flights;

  const filtered = topAirports.filter(
    (a) =>
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Airports</h1>
          <p className={styles.subtitle}>Explore the airports visited by the MyFlightBook community</p>
        </motion.div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className={styles.searchInput} placeholder="Search by airport code or name…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Map Placeholder */}
        <motion.div className={styles.mapCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className={styles.mapGrid} />
          <div className={styles.mapContent}>
            <span className={styles.mapIcon}>🗺️</span>
            <h3>Interactive Route Map</h3>
            <span className="badge badge-cyan">Coming Soon</span>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className={styles.sectionTitle}>Most Visited Airports This Week</h2>
          <div className={styles.leaderboard}>
            {filtered.map((a, i) => (
              <motion.div
                key={a.code}
                className={styles.airportRow}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <span className={styles.rank}>{i + 1}</span>
                <div className={styles.airportInfo}>
                  <div className={styles.airportTop}>
                    <span className={styles.airportCode}>{a.code}</span>
                    <span className={styles.airportName}>{a.name}</span>
                  </div>
                  <div className={styles.barOuter}>
                    <motion.div
                      className={styles.barInner}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(a.flights / maxFlights) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.03 + 0.2 }}
                    />
                  </div>
                </div>
                <div className={styles.airportStats}>
                  <span className={styles.statBadge}>{a.flights} flights</span>
                  <span className={styles.statBadge}>{a.pilots} pilots</span>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && <div className={styles.empty}>No airports match your search.</div>}
          </div>
        </motion.div>

        {/* Explore Cards */}
        <div className={styles.exploreGrid}>
          {[
            { icon: '🔍', title: 'Find Airports', desc: 'Search by code, name, or location' },
            { icon: '📍', title: 'Visited Airports', desc: 'Track every airport you\'ve been to' },
            { icon: '🧩', title: 'Airport Quiz', desc: 'Test your airport knowledge' },
          ].map((card, i) => (
            <motion.div key={card.title} className={styles.exploreCard} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <span className={styles.exploreIcon}>{card.icon}</span>
              <h4>{card.title}</h4>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
