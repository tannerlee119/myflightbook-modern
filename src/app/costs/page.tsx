'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getFlightCosts, getExternalCosts, addExternalCost, updateExternalCost, deleteExternalCost,
  deleteFlightCost, computeCostSummary, getFlights, computeTotals,
  EXTERNAL_COST_LABELS, type FlightCost, type ExternalCost, type ExternalCostCategory,
} from '@/lib/api';
import styles from './costs.module.css';

type Tab = 'summary' | 'all';

interface UnifiedEntry {
  id: string;
  date: string;
  type: 'flight' | 'external';
  label: string;
  category: string;
  amount: number;
  description: string;
}

const EMPTY_EC: Omit<ExternalCost, 'id'> = { date: new Date().toISOString().split('T')[0], category: 'misc', amount: 0, description: '' };

export default function CostsPage() {
  const [tab, setTab] = useState<Tab>('summary');
  const [flightCosts, setFlightCosts] = useState<FlightCost[]>([]);
  const [externalCosts, setExternalCosts] = useState<ExternalCost[]>([]);
  const [summary, setSummary] = useState<ReturnType<typeof computeCostSummary> | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [totalFlights, setTotalFlights] = useState(0);

  const [ecModal, setEcModal] = useState(false);
  const [ecEditId, setEcEditId] = useState<string | null>(null);
  const [ecForm, setEcForm] = useState(EMPTY_EC);
  const [deleteId, setDeleteId] = useState<{ id: string; type: 'fc' | 'ec' } | null>(null);
  const [mounted, setMounted] = useState(false);

  const reload = useCallback(async () => {
    const fc = await getFlightCosts();
    const ec = await getExternalCosts();
    setFlightCosts(fc);
    setExternalCosts(ec);
    setSummary(computeCostSummary(fc, ec));
    const flights = await getFlights();
    const t = computeTotals(flights);
    setTotalHours(t.totalTime);
    setTotalFlights(flights.length);
  }, []);

  useEffect(() => { reload().then(() => setMounted(true)); }, [reload]);

  const fmtUSD = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtUSD0 = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const numField = (val: string) => val === '' ? 0 : parseFloat(val) || 0;
  const fcTotal = (c: FlightCost) => c.fuelCost + c.rentalCost + c.instructorCost + c.landingFees + c.otherCost;

  // Build unified chronological list
  const unified: UnifiedEntry[] = [
    ...flightCosts.map((c) => ({
      id: c.id, date: c.date, type: 'flight' as const,
      label: c.aircraft ? `Flight — ${c.aircraft}` : 'Flight',
      category: 'Flight', amount: fcTotal(c), description: c.notes,
    })),
    ...externalCosts.map((c) => ({
      id: c.id, date: c.date, type: 'external' as const,
      label: EXTERNAL_COST_LABELS[c.category],
      category: EXTERNAL_COST_LABELS[c.category], amount: c.amount, description: c.description,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const grandTotal = unified.reduce((s, e) => s + e.amount, 0);
  const flightTotal = flightCosts.reduce((s, c) => s + fcTotal(c), 0);
  const externalTotal = externalCosts.reduce((s, c) => s + c.amount, 0);

  // External cost handlers
  const openAddEc = () => { setEcEditId(null); setEcForm(EMPTY_EC); setEcModal(true); };
  const openEditEc = (c: ExternalCost) => { setEcEditId(c.id); setEcForm({ date: c.date, category: c.category, amount: c.amount, description: c.description }); setEcModal(true); };
  const saveEc = async () => { if (ecEditId) await updateExternalCost(ecEditId, ecForm); else await addExternalCost(ecForm); setEcModal(false); await reload(); };

  const handleDelete = async () => {
    if (!deleteId) return;
    if (deleteId.type === 'fc') await deleteFlightCost(deleteId.id);
    else await deleteExternalCost(deleteId.id);
    setDeleteId(null);
    await reload();
  };

  // Category breakdown for summary
  const catBreakdown = [
    { label: 'Flight Costs', total: flightTotal, color: 'var(--accent-cyan)' },
    ...Object.entries(EXTERNAL_COST_LABELS).map(([key, label]) => ({
      label,
      total: externalCosts.filter((c) => c.category === key).reduce((s, c) => s + c.amount, 0),
      color: 'var(--accent-emerald)',
    })),
  ].filter((c) => c.total > 0).sort((a, b) => b.total - a.total);
  const maxCat = Math.max(...catBreakdown.map((c) => c.total), 1);

  // Monthly spending (last 6 months)
  const monthlyData = (() => {
    const months: { label: string; total: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const yr = d.getFullYear();
      const mo = d.getMonth();
      const fcMonth = flightCosts.filter((c) => { const cd = new Date(c.date); return cd.getFullYear() === yr && cd.getMonth() === mo; }).reduce((s, c) => s + fcTotal(c), 0);
      const ecMonth = externalCosts.filter((c) => { const cd = new Date(c.date); return cd.getFullYear() === yr && cd.getMonth() === mo; }).reduce((s, c) => s + c.amount, 0);
      months.push({ label, total: fcMonth + ecMonth });
    }
    return months;
  })();
  const maxMonth = Math.max(...monthlyData.map((m) => m.total), 1);

  if (!mounted) return <div className={styles.page} />;

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div className={styles.pageHeader} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1>Cost Tracking</h1>
            <p className={styles.subtitle}>All aviation expenses in one place</p>
          </div>
          <button className="btn btn-primary" onClick={openAddEc}>+ Add Expense</button>
        </motion.div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { key: 'summary' as Tab, label: 'Summary' },
            { key: 'all' as Tab, label: 'All Expenses', count: unified.length },
          ].map((t) => (
            <button key={t.key} className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
              {t.count !== undefined && <span className={styles.tabCount}>{t.count}</span>}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* ---- SUMMARY TAB ---- */}
            {tab === 'summary' && summary && (
              <div className={styles.summaryLayout}>
                {/* Top Stats */}
                <div className={styles.summaryCards}>
                  {[
                    { l: 'Total Spent', v: grandTotal, accent: true },
                    { l: 'This Month', v: summary.monthTotal },
                    { l: 'Year to Date', v: summary.yearTotal },
                    { l: 'Cost per Hour', v: totalHours > 0 ? grandTotal / totalHours : 0 },
                    { l: 'Cost per Flight', v: totalFlights > 0 ? grandTotal / totalFlights : 0 },
                    { l: 'Avg Monthly', v: monthlyData.length > 0 ? monthlyData.reduce((s, m) => s + m.total, 0) / monthlyData.filter((m) => m.total > 0).length || 0 : 0 },
                  ].map((s, i) => (
                    <motion.div key={s.l} className={`${styles.sumCard} ${s.accent ? styles.sumCardAccent : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <span className={styles.sumLabel}>{s.l}</span>
                      <span className={styles.sumValue}>{fmtUSD(s.v)}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Flight vs External Split */}
                <div className={styles.splitRow}>
                  <div className={styles.splitCard}>
                    <div className={styles.splitHeader}>
                      <span className={styles.splitDot} style={{ background: 'var(--accent-cyan)' }} />
                      <span>Flight Costs</span>
                    </div>
                    <span className={styles.splitValue}>{fmtUSD(flightTotal)}</span>
                    <span className={styles.splitPct}>{grandTotal > 0 ? `${Math.round((flightTotal / grandTotal) * 100)}%` : '0%'} of total</span>
                  </div>
                  <div className={styles.splitCard}>
                    <div className={styles.splitHeader}>
                      <span className={styles.splitDot} style={{ background: 'var(--accent-emerald)' }} />
                      <span>External Costs</span>
                    </div>
                    <span className={styles.splitValue}>{fmtUSD(externalTotal)}</span>
                    <span className={styles.splitPct}>{grandTotal > 0 ? `${Math.round((externalTotal / grandTotal) * 100)}%` : '0%'} of total</span>
                  </div>
                </div>

                {/* Monthly Spending Chart */}
                {monthlyData.some((m) => m.total > 0) && (
                  <div className={styles.chartSection}>
                    <h3>Monthly Spending</h3>
                    <div className={styles.barChart}>
                      {monthlyData.map((m) => (
                        <div key={m.label} className={styles.barCol}>
                          <span className={styles.barValue}>{m.total > 0 ? fmtUSD0(m.total) : ''}</span>
                          <div className={styles.barTrack}>
                            <motion.div className={styles.barFill} initial={{ height: 0 }} animate={{ height: `${(m.total / maxMonth) * 100}%` }} transition={{ duration: 0.6 }} />
                          </div>
                          <span className={styles.barLabel}>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Breakdown */}
                {catBreakdown.length > 0 && (
                  <div className={styles.breakdownSection}>
                    <h3>Breakdown by Category</h3>
                    <div className={styles.breakdownList}>
                      {catBreakdown.map((c) => (
                        <div key={c.label} className={styles.breakdownRow}>
                          <span className={styles.breakdownLabel}>{c.label}</span>
                          <div className={styles.breakdownBarOuter}>
                            <motion.div className={styles.breakdownBarInner} initial={{ width: 0 }} animate={{ width: `${(c.total / maxCat) * 100}%` }} transition={{ duration: 0.6 }} style={{ background: c.color }} />
                          </div>
                          <span className={styles.breakdownVal}>{fmtUSD(c.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---- ALL EXPENSES TAB ---- */}
            {tab === 'all' && (
              <>
                <div className={styles.tabHeader}>
                  <span className={styles.tabTotal}>Total: <strong>{fmtUSD(grandTotal)}</strong></span>
                  <button className="btn btn-primary btn-sm" onClick={openAddEc}>+ Add Expense</button>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr>
                      <th>Date</th><th>Type</th><th>Category</th>
                      <th>Amount</th><th>Description</th><th style={{ width: 60 }} />
                    </tr></thead>
                    <tbody>
                      {unified.map((e) => (
                        <tr key={`${e.type}-${e.id}`} className={styles.row}>
                          <td className={styles.dateCell}>{new Date(e.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td><span className={`${styles.typeBadge} ${e.type === 'flight' ? styles.typeFlight : styles.typeExternal}`}>{e.type === 'flight' ? '✈ Flight' : '📋 External'}</span></td>
                          <td className={styles.catText}>{e.label}</td>
                          <td className={`${styles.mono} ${styles.totalCol}`}>{fmtUSD(e.amount)}</td>
                          <td className={styles.noteCell}>{e.description}</td>
                          <td>
                            <div className={styles.rowActions}>
                              {e.type === 'external' && (
                                <button className={styles.editBtn} onClick={() => {
                                  const ec = externalCosts.find((c) => c.id === e.id);
                                  if (ec) openEditEc(ec);
                                }}>✎</button>
                              )}
                              <button className={styles.delBtn} onClick={() => setDeleteId({ id: e.id, type: e.type === 'flight' ? 'fc' : 'ec' })}>✕</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {unified.length === 0 && <div className={styles.empty}>No expenses recorded yet. Log a flight with a cost or add an external expense.</div>}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---- EXTERNAL COST MODAL ---- */}
      <AnimatePresence>
        {ecModal && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEcModal(false)}>
            <motion.div className={styles.modal} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHead}><h3>{ecEditId ? 'Edit Expense' : 'Add Expense'}</h3><button className={styles.modalClose} onClick={() => setEcModal(false)}>✕</button></div>
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
                <button className={`btn btn-primary ${styles.saveBtn}`} onClick={saveEc}>{ecEditId ? 'Save' : 'Add Expense'}</button>
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
              <p>Delete this expense?</p>
              <div className={styles.confirmActions}><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button><button className={styles.confirmDel} onClick={handleDelete}>Delete</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
