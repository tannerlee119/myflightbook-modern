'use client';

import { exportFlightsCSV, downloadCSV } from '@/lib/storage';
import styles from './Footer.module.css';

export default function Footer() {
  const handleExport = () => {
    const csv = exportFlightsCSV();
    if (!csv) return alert('No flights to export.');
    downloadCSV(`flightlog-${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.glowLine} />
      <div className={styles.inner}>
        <span className={styles.brand}>✈ FlightLog</span>
        <button onClick={handleExport} className={styles.exportBtn}>
          Export CSV
        </button>
        <span className={styles.madeWith}>Personal Flight Logbook · Built with Next.js</span>
      </div>
    </footer>
  );
}
