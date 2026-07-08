'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getFlightCosts, addFlightCost, updateFlightCost, deleteFlightCost,
  getExternalCosts, addExternalCost, updateExternalCost, deleteExternalCost,
  computeCostSummary, getFlights, computeTotals,
  EXTERNAL_COST_LABELS, type FlightCost, type ExternalCost, type ExternalCostCategory,
} from '@/lib/storage';
import styles from './costs.module.css';

type Tab = 'flight' | 'external' | 'summary';

const EMPTY_FC: Omit<FlightCost, 'id'> = { flightId: '', date: new Date().toISOString().split('T')[0], aircraft: '', fuelCost: 0, rentalCost: 0, instructorCost: 0, landingFees: 0, otherCost: 0, notes: '' };
const EMPTY_EC: Omit<ExternalCost, 'id'> = { date: new Date().toISOString().split('T')[0], category: 'misc', amount: 0, description: '' };

export default function CostsPage() {
  const [tab, setTab] = useState<Tab>('flight');
  const [flightCosts, setFlightCosts] = useState<FlightCost[]>([]);
  const [externalCosts, setExternalCosts] = useState<ExternalCost[]>([]);
  const [summary, setSummary] = useState<ReturnType<typeof computeCostSummary> | null>(null);
  const [totalHours, setTotalHours] = useState(0);

  const [fcModal, setFcModal] = useState(false);
  const [fcEditId, setFcEditId] = useState<string | null>(null);
  const [fcForm, setFcForm] = useState(EMPTY_FC);

  const [ecModal, setEcModal] = useState(false);
  const [ecEditId, setEcEditId] = useState<string | null>(null);
  const [ecForm, setEcForm] = useState(EMPTY_EC);

  const [deleteId, setDeleteId] = useState<{ id: string; type: 'fc' | 'ec' } | null>(null);
  const [mounted, setMounted] = useState(false);

  const reload = useCallback(() => {
    setFlightCosts(getFlightCosts());
    setExternalCosts(getExternalCosts());
    setSummary(computeCostSummary());
    setTotalHours(computeTotals(getFlights()).totalTime);
  }, []);

  useEffect(() => { reload(); setMounted(true); }, [reload]);

  const fcTotal = (c: FlightCost) => c.fuelCost + c.rentalCost + c.instructorCost + c.landingFees + c.otherCost;
  const fmtUSD = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtUSD0 = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const numField = (val: string) => val === '' ? 0 : parseFloat(val) || 0;

  // Flight cost handlers
  const openAddFc = () => { setFcEditId(null); setFcForm(EMPTY_FC); setFcModal(true); };
  const openEditFc = (c: FlightCost) => { setFcEditId(c.id); setFcForm({ flightId: c.flightId, date: c.date, aircraft: c.aircraft, fuelCost: c.fuelCost, rentalCost: c.rentalCost, instructorCost: c.instructorCost, landingFees: c.landingFees, otherCost: c.otherCost, notes: c.notes }); setFcModal(true); };
  const saveFc = () => { if (fcEditId) updateFlightCost(fcEditId, fcForm); else addFlightCost(fcForm); setFcModal(false); reload(); };

  // External cost handlers
  const openAddEc = () => { setEcEditId(null); setEcForm(EMPTY_EC); setEcModal(true); };
  const openEditEc = (c: ExternalCost) => { setEcEditId(c.id); setEcForm({ date: c.date, category: c.category, amount: c.amount, description: c.description }); setEcModal(true); };
  const saveEc = () => { if (ecEditId) updateExternalCost(ecEditId, ecForm); else addExternalCost(ecForm); setEcModal(false); reload(); };

  const handleDelete = () => {
    if (!deleteId) return;
    if (deleteId.type === 'fc') deleteFlightCost(deleteId.id);
    else deleteExternalCost(deleteId.id);
    setDeleteId(null);
    reload();
  };

  // Category breakdown for summary
  const categoryBreakdown = Object.entries(EXTERNAL_COST_LABELS).map(([key, label]) => ({
    key, label,
    total: externalCosts.filter((c) => c.category === key).reduce((s, c) => s + c.amount, 0),
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const fcGrandTotal = flightCosts.reduce((s, c) => s + fcTotal(c), 0);
  const ecGrandTotal = externalCosts.reduce((s, c) => s + c.amount, 0);
  const maxCat = Math.max(...categoryBreakdown.map((c) => c.total), 1);

  if (!mounted) return <div className={styles.page} />;

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div className={styles.pageHeader} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Cost Tracking</h1>
          <p className={styles.subtitle}>Track all aviation expenses — flight costs and external costs</p>
        </motion.div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { key: 'flight' as Tab, label: 'Flight Costs', count: flightCosts.length },
            { key: 'external' as Tab, label: 'External Costs', count: externalCosts.length },
            { key: 'summary' as Tab, label: 'Summary' },
          ].map((t) => (
            <button key={t.key} className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
              {t.count !== undefined && <span className={styles.tabCount}>{t.count}</span>}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* ---- FLIGHT COSTS ---- */}
            {tab === 'flight' && (
              <>
                <div className={styles.tabHeader}>
                  <span className={styles.tabTotal}>Total: <strong>{fmtUSD(fcGrandTotal)}</strong></span>
                  <button className="btn btn-primary btn-sm" onClick={openAddFc}>+ Add Cost</button>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr>
                      <th>Date</th><th>Aircraft</th>
                      <th className={styles.num}>Fuel</th><th className={styles.num}>Rental</th>
                      <th className={styles.num}>Instructor</th><th className={styles.num}>Fees</th>
                      <th className={styles.num}>Other</th><th className={styles.num}>Total</th>
                      <th>Notes</th><th style={{ width: 60 }} />
                    </tr></thead>
                    <tbody>
                      {flightCosts.map((c) => (
                        <tr key={c.id} className={styles.row}>
                          <td className={styles.dateCell}>{new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                          <td><span className={styles.tail}>{c.aircraft || '—'}</span></td>
                          <td className={`${styles.num} ${styles.mono}`}>{c.fuelCost > 0 ? fmtUSD(c.fuelCost) : '—'}</td>
                          <td className={`${styles.num} ${styles.mono}`}>{c.rentalCost > 0 ? fmtUSD(c.rentalCost) : '—'}</td>
                          <td className={`${styles.num} ${styles.mono}`}>{c.instructorCost > 0 ? fmtUSD(c.instructorCost) : '—'}</td>
                          <td className={`${styles.num} ${styles.mono}`}>{c.landingFees > 0 ? fmtUSD(c.landingFees) : '—'}</td>
                          <td className={`${styles.num} ${styles.mono}`}>{c.otherCost > 0 ? fmtUSD(c.otherCost) : '—'}</td>
                          <td className={`${styles.num} ${styles.mono} ${styles.totalCol}`}>{fmtUSD(fcTotal(c))}</td>
                          <td className={styles.noteCell}>{c.notes}</td>
                          <td>
                            <div className={styles.rowActions}>
                              <button className={styles.editBtn} onClick={() => openEditFc(c)}>✎</button>
                              <button className={styles.delBtn} onClick={() => setDeleteId({ id: c.id, type: 'fc' })}>✕</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {flightCosts.length === 0 && <div className={styles.empty}>No flight costs recorded yet.</div>}
              </>
            )}

            {/* ---- EXTERNAL COSTS ---- */}
            {tab === 'external' && (
              <>
                <div className={styles.tabHeader}>
                  <span className={styles.tabTotal}>Total: <strong>{fmtUSD(ecGrandTotal)}</strong></span>
                  <button className="btn btn-primary btn-sm" onClick={openAddEc}>+ Add Cost</button>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr>
                      <th>Date</th><th>Category</th><th className={styles.num}>Amount</th><th>Description</th><th style={{ width: 60 }} />
                    </tr></thead>
                    <tbody>
                      {externalCosts.map((c) => (
                        <tr key={c.id} className={styles.row}>
                          <td className={styles.dateCell}>{new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td><span className={styles.catBadge}>{EXTERNAL_COST_LABELS[c.category]}</span></td>
                          <td className={`${styles.num} ${styles.mono} ${styles.totalCol}`}>{fmtUSD(c.amount)}</td>
                          <td className={styles.noteCell}>{c.description}</td>
                          <td>
                            <div className={styles.rowActions}>
                              <button className={styles.editBtn} onClick={() => openEditEc(c)}>✎</button>
                              <button className={styles.delBtn} onClick={() => setDeleteId({ id: c.id, type: 'ec' })}>✕</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {externalCosts.length === 0 && <div className={styles.empty}>No external costs recorded yet.</div>}
              </>
            )}

            {/* ---- SUMMARY ---- */}
            {tab === 'summary' && summary && (
              <div className={styles.summaryGrid}>
                <div className={styles.summaryCards}>
                  {[
                    { l: 'This Month', v: summary.monthTotal, sub: `Flight: ${fmtUSD0(summary.monthFlightCosts)} · Other: ${fmtUSD0(summary.monthExternalCosts)}` },
                    { l: 'Year to Date', v: summary.yearTotal, sub: `Flight: ${fmtUSD0(summary.yearFlightCosts)} · Other: ${fmtUSD0(summary.yearExternalCosts)}` },
                    { l: 'All Time', v: summary.allTimeTotal, sub: `Flight: ${fmtUSD0(summary.allTimeFlightCosts)} · Other: ${fmtUSD0(summary.allTimeExternalCosts)}` },
                    { l: 'Cost per Hour', v: totalHours > 0 ? summary.allTimeTotal / totalHours : 0, sub: `${totalHours.toFixed(1)} total hours logged` },
                  ].map((s, i) => (
                    <motion.div key={s.l} className={styles.sumCard} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <span className={styles.sumLabel}>{s.l}</span>
                      <span className={styles.sumValue}>{fmtUSD(s.v)}</span>
                      <span className={styles.sumSub}>{s.sub}</span>
                    </motion.div>
                  ))}
                </div>

                {categoryBreakdown.length > 0 && (
                  <div className={styles.breakdownSection}>
                    <h3>External Cost Breakdown</h3>
                    <div className={styles.breakdownList}>
                      {categoryBreakdown.map((c) => (
                        <div key={c.key} className={styles.breakdownRow}>
                          <span className={styles.breakdownLabel}>{c.label}</span>
                          <div className={styles.breakdownBarOuter}>
                            <div className={styles.breakdownBarInner} style={{ width: `${(c.total / maxCat) * 100}%` }} />
                          </div>
                          <span className={styles.breakdownVal}>{fmtUSD(c.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---- FLIGHT COST MODAL ---- */}
      <AnimatePresence>
        {fcModal && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFcModal(false)}>
            <motion.div className={styles.modal} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHead}><h3>{fcEditId ? 'Edit Flight Cost' : 'Add Flight Cost'}</h3><button className={styles.modalClose} onClick={() => setFcModal(false)}>✕</button></div>
              <div className={styles.modalBody}>
                <div className={styles.formRow}>
                  <div className={styles.fg}><label>Date</label><input type="date" value={fcForm.date} onChange={(e) => setFcForm({ ...fcForm, date: e.target.value })} /></div>
                  <div className={styles.fg}><label>Aircraft</label><input value={fcForm.aircraft} onChange={(e) => setFcForm({ ...fcForm, aircraft: e.target.value.toUpperCase() })} placeholder="N172SP" /></div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.fg}><label>Fuel</label><input type="number" step="0.01" value={fcForm.fuelCost || ''} onChange={(e) => setFcForm({ ...fcForm, fuelCost: numField(e.target.value) })} placeholder="0.00" /></div>
                  <div className={styles.fg}><label>Rental</label><input type="number" step="0.01" value={fcForm.rentalCost || ''} onChange={(e) => setFcForm({ ...fcForm, rentalCost: numField(e.target.value) })} placeholder="0.00" /></div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.fg}><label>Instructor</label><input type="number" step="0.01" value={fcForm.instructorCost || ''} onChange={(e) => setFcForm({ ...fcForm, instructorCost: numField(e.target.value) })} placeholder="0.00" /></div>
                  <div className={styles.fg}><label>Landing Fees</label><input type="number" step="0.01" value={fcForm.landingFees || ''} onChange={(e) => setFcForm({ ...fcForm, landingFees: numField(e.target.value) })} placeholder="0.00" /></div>
                </div>
                <div className={styles.fg}><label>Other</label><input type="number" step="0.01" value={fcForm.otherCost || ''} onChange={(e) => setFcForm({ ...fcForm, otherCost: numField(e.target.value) })} placeholder="0.00" /></div>
                <div className={styles.fg}><label>Notes</label><input value={fcForm.notes} onChange={(e) => setFcForm({ ...fcForm, notes: e.target.value })} placeholder="Description…" /></div>
                <button className={`btn btn-primary ${styles.saveBtn}`} onClick={saveFc}>{fcEditId ? 'Save' : 'Add Cost'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- EXTERNAL COST MODAL ---- */}
      <AnimatePresence>
        {ecModal && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEcModal(false)}>
            <motion.div className={styles.modal} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHead}><h3>{ecEditId ? 'Edit External Cost' : 'Add External Cost'}</h3><button className={styles.modalClose} onClick={() => setEcModal(false)}>✕</button></div>
              <div className={styles.modalBody}>
                <div className={styles.formRow}>
                  <div className={styles.fg}><label>Date</label><input type="date" value={ecForm.date} onChange={(e) => setEcForm({ ...ecForm, date: e.target.value })} /></div>
                  <div className={styles.fg}>
                    <label>Category</label>
                    <select value={ecForm.category} onChange={(e) => setEcForm({ ...ecForm, category: e.target.value as ExternalCostCategory })}>
                      {Object.entries(EXTERNAL_COST_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles.fg}><label>Amount ($)</label><input type="number" step="0.01" value={ecForm.amount || ''} onChange={(e) => setEcForm({ ...ecForm, amount: numField(e.target.value) })} placeholder="0.00" /></div>
                <div className={styles.fg}><label>Description</label><input value={ecForm.description} onChange={(e) => setEcForm({ ...ecForm, description: e.target.value })} placeholder="What was this for?" /></div>
                <button className={`btn btn-primary ${styles.saveBtn}`} onClick={saveEc}>{ecEditId ? 'Save' : 'Add Cost'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)}>
            <motion.div className={styles.confirmBox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <p>Delete this cost entry?</p>
              <div className={styles.confirmActions}><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button><button className={styles.confirmDel} onClick={handleDelete}>Delete</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
