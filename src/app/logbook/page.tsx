'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockFlights, mockTotals, mockCurrency } from '@/data/siteData';
import styles from './logbook.module.css';

type Tab = 'flights' | 'totals' | 'currency';

export default function LogbookPage() {
  const [activeTab, setActiveTab] = useState<Tab>('flights');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredFlights = mockFlights.filter((f) =>
    [f.aircraft, f.model, f.route, f.comments, f.date]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'flights', label: 'Recent Flights', count: mockFlights.length },
    { key: 'totals', label: 'Totals' },
    { key: 'currency', label: 'Currency' },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className="container">
        <motion.div
          className={styles.pageHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className={styles.pageTitle}>Flight Logbook</h1>
            <p className={styles.pageSubtitle}>
              <span className={styles.statHighlight}>{mockTotals.totalTime.toFixed(1)}</span> total hours ·{' '}
              <span className={styles.statHighlight}>{mockTotals.landings.toLocaleString()}</span> landings ·{' '}
              <span className={styles.statHighlight}>{mockFlights.length}</span> flights
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={styles.tabCount}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'flights' && (
            <div className={styles.flightsTab}>
              {/* Search */}
              <div className={styles.searchBar}>
                <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search flights by aircraft, route, or comments…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>
                )}
              </div>

              {/* Table */}
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Aircraft</th>
                      <th>Model</th>
                      <th>Route</th>
                      <th className={styles.numCol}>Total</th>
                      <th className={styles.numCol}>Ldg</th>
                      <th className={styles.numCol}>Night</th>
                      <th className={styles.numCol}>Inst</th>
                      <th className={styles.numCol}>App</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFlights.map((f, i) => (
                      <motion.tr
                        key={f.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={styles.row}
                      >
                        <td className={styles.dateCell}>{new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                        <td><span className={styles.tailNumber}>{f.aircraft}</span></td>
                        <td className={styles.modelCell}>{f.model}</td>
                        <td className={styles.routeCell}>{f.route}</td>
                        <td className={`${styles.numCol} ${styles.monoVal}`}>{f.totalTime.toFixed(1)}</td>
                        <td className={`${styles.numCol} ${styles.monoVal}`}>{f.landings}</td>
                        <td className={`${styles.numCol} ${styles.monoVal}`}>{f.night > 0 ? f.night.toFixed(1) : '—'}</td>
                        <td className={`${styles.numCol} ${styles.monoVal}`}>{f.instrument > 0 ? f.instrument.toFixed(1) : '—'}</td>
                        <td className={`${styles.numCol} ${styles.monoVal}`}>{f.approaches > 0 ? f.approaches : '—'}</td>
                        <td className={styles.commentCell}>{f.comments}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredFlights.length === 0 && (
                <div className={styles.empty}>No flights match your search.</div>
              )}
            </div>
          )}

          {activeTab === 'totals' && (
            <div className={styles.totalsGrid}>
              {[
                { label: 'Total Time', value: mockTotals.totalTime, unit: 'hrs' },
                { label: 'PIC', value: mockTotals.pic, unit: 'hrs' },
                { label: 'Dual Received', value: mockTotals.dual, unit: 'hrs' },
                { label: 'Night', value: mockTotals.night, unit: 'hrs' },
                { label: 'Instrument', value: mockTotals.instrument, unit: 'hrs' },
                { label: 'Sim Instrument', value: mockTotals.simInstrument, unit: 'hrs' },
                { label: 'Cross Country', value: mockTotals.crossCountry, unit: 'hrs' },
                { label: 'Solo', value: mockTotals.solo, unit: 'hrs' },
                { label: 'Total Landings', value: mockTotals.landings, unit: '' },
                { label: 'Night Landings', value: mockTotals.nightLandings, unit: '' },
                { label: 'Approaches', value: mockTotals.approaches, unit: '' },
                { label: 'SIC', value: mockTotals.sic, unit: 'hrs' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className={styles.totalCard}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className={styles.totalLabel}>{item.label}</span>
                  <span className={styles.totalValue}>
                    {typeof item.value === 'number' && item.unit === 'hrs'
                      ? item.value.toFixed(1)
                      : item.value.toLocaleString()}
                  </span>
                  {item.unit && <span className={styles.totalUnit}>{item.unit}</span>}
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'currency' && (
            <div className={styles.currencyList}>
              {mockCurrency.map((c, i) => (
                <motion.div
                  key={c.name}
                  className={styles.currencyItem}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className={styles.currencyLeft}>
                    <span className={`${styles.statusDot} ${styles[`status_${c.status.replace('-', '_')}`]}`} />
                    <div>
                      <span className={styles.currencyName}>{c.name}</span>
                      {c.detail && <span className={styles.currencyDetail}>{c.detail}</span>}
                    </div>
                  </div>
                  <div className={styles.currencyRight}>
                    {c.status === 'current' && (
                      <span className={styles.badgeCurrent}>Current</span>
                    )}
                    {c.status === 'warning' && (
                      <span className={styles.badgeWarning}>Attention</span>
                    )}
                    {c.status === 'not-required' && (
                      <span className={styles.badgeNeutral}>N/A</span>
                    )}
                    {c.expires && (
                      <span className={styles.currencyExpiry}>
                        Exp: {new Date(c.expires).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                    {c.daysRemaining !== null && c.daysRemaining !== undefined && (
                      <span className={styles.currencyDays}>{c.daysRemaining}d remaining</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Floating Add Button */}
      <motion.button
        className={styles.fab}
        onClick={() => setShowAddModal(!showAddModal)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Add Flight"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </motion.button>

      {/* Add Flight Modal */}
      {showAddModal && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Log New Flight</h3>
              <button className={styles.modalClose} onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date</label>
                  <input type="date" className={styles.formInput} defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Aircraft</label>
                  <input type="text" className={styles.formInput} placeholder="N172SP" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Route</label>
                <input type="text" className={styles.formInput} placeholder="KPAO → KSQL → KPAO" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Total Time</label>
                  <input type="number" step="0.1" className={styles.formInput} placeholder="1.5" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Landings</label>
                  <input type="number" className={styles.formInput} placeholder="3" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Night</label>
                  <input type="number" step="0.1" className={styles.formInput} placeholder="0.0" />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Instrument</label>
                  <input type="number" step="0.1" className={styles.formInput} placeholder="0.0" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Approaches</label>
                  <input type="number" className={styles.formInput} placeholder="0" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Comments</label>
                <textarea className={styles.formTextarea} rows={3} placeholder="Flight notes…" />
              </div>
              <button className={`btn btn-primary btn-lg ${styles.formSubmit}`}>
                Save Flight
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
