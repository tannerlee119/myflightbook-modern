'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getFlights, addFlight, updateFlight, deleteFlight,
  getAircraft, computeTotals, computeCurrency,
  type Flight, type Aircraft as AircraftType, type FlightTotals, type CurrencyItem,
} from '@/lib/storage';
import styles from './logbook.module.css';

type Tab = 'flights' | 'totals' | 'currency';

const EMPTY_FORM = {
  date: new Date().toISOString().split('T')[0],
  aircraft: '', model: '', route: '',
  totalTime: 0, pic: 0, sic: 0, dual: 0,
  night: 0, instrument: 0, simInstrument: 0, crossCountry: 0,
  landings: 0, nightLandings: 0, approaches: 0, comments: '',
};

export default function LogbookPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [aircraft, setAircraft] = useState<AircraftType[]>([]);
  const [totals, setTotals] = useState<FlightTotals | null>(null);
  const [currency, setCurrency] = useState<CurrencyItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('flights');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const reload = useCallback(() => {
    const f = getFlights();
    setFlights(f);
    setTotals(computeTotals(f));
    setCurrency(computeCurrency(f));
    setAircraft(getAircraft());
  }, []);

  useEffect(() => { reload(); setMounted(true); }, [reload]);

  const filtered = flights.filter((f) =>
    [f.aircraft, f.model, f.route, f.comments, f.date].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (f: Flight) => {
    setEditingId(f.id);
    setForm({
      date: f.date, aircraft: f.aircraft, model: f.model, route: f.route,
      totalTime: f.totalTime, pic: f.pic, sic: f.sic, dual: f.dual,
      night: f.night, instrument: f.instrument, simInstrument: f.simInstrument,
      crossCountry: f.crossCountry, landings: f.landings, nightLandings: f.nightLandings,
      approaches: f.approaches, comments: f.comments,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.date || !form.aircraft) return;
    // Auto-fill model from aircraft list
    let model = form.model;
    if (!model) {
      const ac = aircraft.find((a) => a.tailNumber === form.aircraft);
      if (ac) model = ac.model;
    }
    const payload = { ...form, model };
    if (editingId) {
      updateFlight(editingId, payload);
    } else {
      addFlight(payload);
    }
    setModalOpen(false);
    reload();
  };

  const handleDelete = (id: string) => {
    deleteFlight(id);
    setDeleteConfirm(null);
    reload();
  };

  const setField = (key: string, value: string | number) => setForm((prev) => ({ ...prev, [key]: value }));
  const numField = (key: string, val: string) => setField(key, val === '' ? 0 : parseFloat(val) || 0);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'flights', label: 'Flights', count: flights.length },
    { key: 'totals', label: 'Totals' },
    { key: 'currency', label: 'Currency' },
  ];

  if (!mounted) return <div className={styles.page} />;

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div className={styles.pageHeader} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1 className={styles.pageTitle}>Flight Logbook</h1>
            <p className={styles.pageSubtitle}>
              <span className={styles.hl}>{(totals?.totalTime ?? 0).toFixed(1)}</span> total hours ·{' '}
              <span className={styles.hl}>{totals?.landings?.toLocaleString() ?? 0}</span> landings ·{' '}
              <span className={styles.hl}>{flights.length}</span> flights
            </p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Log Flight</button>
        </motion.div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map((t) => (
            <button key={t.key} className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
              {t.count !== undefined && <span className={styles.tabCount}>{t.count}</span>}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* ---- FLIGHTS TAB ---- */}
            {activeTab === 'flights' && (
              <>
                <div className={styles.searchBar}>
                  <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  <input className={styles.searchInput} placeholder="Search flights…" value={search} onChange={(e) => setSearch(e.target.value)} />
                  {search && <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>}
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr>
                      <th>Date</th><th>Aircraft</th><th>Route</th>
                      <th className={styles.num}>Total</th><th className={styles.num}>PIC</th>
                      <th className={styles.num}>Night</th><th className={styles.num}>Inst</th>
                      <th className={styles.num}>Ldg</th><th>Comments</th><th style={{ width: 60 }} />
                    </tr></thead>
                    <tbody>
                      {filtered.map((f, i) => (
                        <motion.tr key={f.id} className={styles.row} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                          <td className={styles.dateCell}>{new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                          <td><span className={styles.tail}>{f.aircraft}</span></td>
                          <td className={styles.routeCell}>{f.route}</td>
                          <td className={`${styles.num} ${styles.mono}`}>{f.totalTime.toFixed(1)}</td>
                          <td className={`${styles.num} ${styles.mono}`}>{f.pic > 0 ? f.pic.toFixed(1) : '—'}</td>
                          <td className={`${styles.num} ${styles.mono}`}>{f.night > 0 ? f.night.toFixed(1) : '—'}</td>
                          <td className={`${styles.num} ${styles.mono}`}>{f.instrument > 0 ? f.instrument.toFixed(1) : '—'}</td>
                          <td className={`${styles.num} ${styles.mono}`}>{f.landings}</td>
                          <td className={styles.commentCell}>{f.comments}</td>
                          <td>
                            <div className={styles.rowActions}>
                              <button className={styles.editBtn} onClick={() => openEdit(f)} title="Edit">✎</button>
                              <button className={styles.delBtn} onClick={() => setDeleteConfirm(f.id)} title="Delete">✕</button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filtered.length === 0 && <div className={styles.empty}>No flights match your search.</div>}
              </>
            )}

            {/* ---- TOTALS TAB ---- */}
            {activeTab === 'totals' && totals && (
              <div className={styles.totalsGrid}>
                {[
                  { l: 'Total Time', v: totals.totalTime, u: 'hrs' },
                  { l: 'PIC', v: totals.pic, u: 'hrs' },
                  { l: 'Dual Received', v: totals.dual, u: 'hrs' },
                  { l: 'Night', v: totals.night, u: 'hrs' },
                  { l: 'Instrument', v: totals.instrument, u: 'hrs' },
                  { l: 'Sim Instrument', v: totals.simInstrument, u: 'hrs' },
                  { l: 'Cross Country', v: totals.crossCountry, u: 'hrs' },
                  { l: 'SIC', v: totals.sic, u: 'hrs' },
                  { l: 'Total Landings', v: totals.landings, u: '' },
                  { l: 'Night Landings', v: totals.nightLandings, u: '' },
                  { l: 'Approaches', v: totals.approaches, u: '' },
                  { l: 'Flight Count', v: totals.flightCount, u: '' },
                ].map((item, i) => (
                  <motion.div key={item.l} className={styles.totalCard} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <span className={styles.totalLabel}>{item.l}</span>
                    <span className={styles.totalValue}>{item.u === 'hrs' ? item.v.toFixed(1) : item.v.toLocaleString()}</span>
                    {item.u && <span className={styles.totalUnit}>{item.u}</span>}
                  </motion.div>
                ))}
              </div>
            )}

            {/* ---- CURRENCY TAB ---- */}
            {activeTab === 'currency' && (
              <div className={styles.currencyList}>
                {currency.map((c, i) => (
                  <motion.div key={c.name} className={styles.currencyItem} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <span className={`${styles.statusDot} ${styles[`st_${c.status}`]}`} />
                    <div className={styles.currencyInfo}>
                      <span className={styles.currencyName}>{c.name}</span>
                      <span className={styles.currencyDetail}>{c.detail}</span>
                    </div>
                    <span className={`${styles.badge} ${styles[`badge_${c.status}`]}`}>
                      {c.status === 'current' ? 'Current' : c.status === 'warning' ? 'Caution' : 'Expired'}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FAB */}
      <motion.button className={styles.fab} onClick={openAdd} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} aria-label="Add Flight">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </motion.button>

      {/* ---- FLIGHT MODAL ---- */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)}>
            <motion.div className={styles.modal} initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHead}>
                <h3>{editingId ? 'Edit Flight' : 'Log New Flight'}</h3>
                <button className={styles.modalClose} onClick={() => setModalOpen(false)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.formRow}>
                  <div className={styles.fg}><label>Date *</label><input type="date" value={form.date} onChange={(e) => setField('date', e.target.value)} /></div>
                  <div className={styles.fg}>
                    <label>Aircraft *</label>
                    <select value={form.aircraft} onChange={(e) => { setField('aircraft', e.target.value); const ac = aircraft.find((a) => a.tailNumber === e.target.value); if (ac) setField('model', ac.model); }}>
                      <option value="">Select…</option>
                      {aircraft.map((a) => <option key={a.id} value={a.tailNumber}>{a.tailNumber} — {a.model}</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles.fg}><label>Route</label><input value={form.route} onChange={(e) => setField('route', e.target.value)} placeholder="KPAO → KSQL → KPAO" /></div>
                <div className={styles.formRow3}>
                  <div className={styles.fg}><label>Total Time</label><input type="number" step="0.1" value={form.totalTime || ''} onChange={(e) => numField('totalTime', e.target.value)} /></div>
                  <div className={styles.fg}><label>PIC</label><input type="number" step="0.1" value={form.pic || ''} onChange={(e) => numField('pic', e.target.value)} /></div>
                  <div className={styles.fg}><label>SIC</label><input type="number" step="0.1" value={form.sic || ''} onChange={(e) => numField('sic', e.target.value)} /></div>
                </div>
                <div className={styles.formRow3}>
                  <div className={styles.fg}><label>Dual</label><input type="number" step="0.1" value={form.dual || ''} onChange={(e) => numField('dual', e.target.value)} /></div>
                  <div className={styles.fg}><label>Night</label><input type="number" step="0.1" value={form.night || ''} onChange={(e) => numField('night', e.target.value)} /></div>
                  <div className={styles.fg}><label>Instrument</label><input type="number" step="0.1" value={form.instrument || ''} onChange={(e) => numField('instrument', e.target.value)} /></div>
                </div>
                <div className={styles.formRow3}>
                  <div className={styles.fg}><label>Sim Inst</label><input type="number" step="0.1" value={form.simInstrument || ''} onChange={(e) => numField('simInstrument', e.target.value)} /></div>
                  <div className={styles.fg}><label>X-Country</label><input type="number" step="0.1" value={form.crossCountry || ''} onChange={(e) => numField('crossCountry', e.target.value)} /></div>
                  <div className={styles.fg}><label>Landings</label><input type="number" value={form.landings || ''} onChange={(e) => numField('landings', e.target.value)} /></div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.fg}><label>Night Ldg</label><input type="number" value={form.nightLandings || ''} onChange={(e) => numField('nightLandings', e.target.value)} /></div>
                  <div className={styles.fg}><label>Approaches</label><input type="number" value={form.approaches || ''} onChange={(e) => numField('approaches', e.target.value)} /></div>
                </div>
                <div className={styles.fg}><label>Comments</label><textarea rows={2} value={form.comments} onChange={(e) => setField('comments', e.target.value)} placeholder="Flight notes…" /></div>
                <button className={`btn btn-primary ${styles.saveBtn}`} onClick={handleSave}>{editingId ? 'Save Changes' : 'Log Flight'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)}>
            <motion.div className={styles.confirmBox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <p>Delete this flight? This cannot be undone.</p>
              <div className={styles.confirmActions}>
                <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className={styles.confirmDel} onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
