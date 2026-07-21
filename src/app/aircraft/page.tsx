'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAircraft, addAircraft, updateAircraft, deleteAircraft,
  getFlights, type Aircraft, type Flight,
} from '@/lib/api';
import styles from './aircraft.module.css';

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];
const EMPTY: Omit<Aircraft, 'id'> = { tailNumber: '', model: '', year: new Date().getFullYear(), category: 'Single Engine Land', notes: '', imageColor: COLORS[0] };

export default function AircraftPage() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const reload = useCallback(async () => { setAircraft(await getAircraft()); setFlights(await getFlights()); }, []);
  useEffect(() => { reload().then(() => setMounted(true)); }, [reload]);

  const openAdd = () => { setEditingId(null); setForm({ ...EMPTY, imageColor: COLORS[aircraft.length % COLORS.length] }); setModalOpen(true); };
  const openEdit = (a: Aircraft) => { setEditingId(a.id); setForm({ tailNumber: a.tailNumber, model: a.model, year: a.year, category: a.category, notes: a.notes, imageColor: a.imageColor }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.tailNumber || !form.model) return;
    if (editingId) await updateAircraft(editingId, form);
    else await addAircraft(form);
    setModalOpen(false);
    await reload();
  };

  const handleDelete = async (id: string) => { await deleteAircraft(id); setDeleteConfirm(null); await reload(); };

  const acFlights = (tail: string) => flights.filter((f) => f.aircraft === tail);
  const acHours = (tail: string) => acFlights(tail).reduce((s, f) => s + f.totalTime, 0);

  if (!mounted) return <div className={styles.page} />;

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div className={styles.pageHeader} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1>Aircraft</h1>
            <p className={styles.subtitle}>{aircraft.length} aircraft in your fleet</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Aircraft</button>
        </motion.div>

        {aircraft.length === 0 ? (
          <div className={styles.empty}>No aircraft yet. Add one to start logging flights.</div>
        ) : (
          <div className={styles.grid}>
            {aircraft.map((ac, i) => {
              const hrs = acHours(ac.tailNumber);
              const flts = acFlights(ac.tailNumber).length;
              return (
                <motion.div key={ac.id} className={styles.card} style={{ '--ac-color': ac.imageColor } as React.CSSProperties} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardIcon}>✈</span>
                    <div className={styles.cardTopActions}>
                      <button className={styles.cardEdit} onClick={() => openEdit(ac)}>✎</button>
                      <button className={styles.cardDel} onClick={() => setDeleteConfirm(ac.id)}>✕</button>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.tailNumber}>{ac.tailNumber}</span>
                    <span className={styles.modelName}>{ac.model}</span>
                    <span className={styles.category}>{ac.category}</span>
                    {ac.notes && <span className={styles.notes}>{ac.notes}</span>}
                    <div className={styles.cardMeta}>
                      <div className={styles.metaItem}><span className={styles.metaLabel}>Year</span><span className={styles.metaValue}>{ac.year}</span></div>
                      <div className={styles.metaItem}><span className={styles.metaLabel}>Hours</span><span className={styles.metaValue}>{hrs.toFixed(1)}</span></div>
                      <div className={styles.metaItem}><span className={styles.metaLabel}>Flights</span><span className={styles.metaValue}>{flts}</span></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)}>
            <motion.div className={styles.modal} initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHead}><h3>{editingId ? 'Edit Aircraft' : 'Add Aircraft'}</h3><button className={styles.modalClose} onClick={() => setModalOpen(false)}>✕</button></div>
              <div className={styles.modalBody}>
                <div className={styles.formRow}>
                  <div className={styles.fg}><label>Tail Number *</label><input value={form.tailNumber} onChange={(e) => setForm({ ...form, tailNumber: e.target.value.toUpperCase() })} placeholder="N172SP" /></div>
                  <div className={styles.fg}><label>Year</label><input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 0 })} /></div>
                </div>
                <div className={styles.fg}><label>Model *</label><input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Cessna C172S Skyhawk SP" /></div>
                <div className={styles.fg}>
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option>Single Engine Land</option><option>Single Engine Sea</option>
                    <option>Multi Engine Land</option><option>Multi Engine Sea</option>
                    <option>Helicopter</option><option>Glider</option><option>AATD</option><option>FTD</option><option>Other</option>
                  </select>
                </div>
                <div className={styles.fg}><label>Notes</label><input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Primary trainer, etc." /></div>
                <div className={styles.fg}>
                  <label>Color</label>
                  <div className={styles.colorPicker}>
                    {COLORS.map((c) => (
                      <button key={c} className={`${styles.colorSwatch} ${form.imageColor === c ? styles.colorSelected : ''}`} style={{ background: c }} onClick={() => setForm({ ...form, imageColor: c })} />
                    ))}
                  </div>
                </div>
                <button className={`btn btn-primary ${styles.saveBtn}`} onClick={handleSave}>{editingId ? 'Save Changes' : 'Add Aircraft'}</button>
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
              <p>Delete this aircraft?</p>
              <div className={styles.confirmActions}><button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button><button className={styles.confirmDel} onClick={() => handleDelete(deleteConfirm)}>Delete</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
