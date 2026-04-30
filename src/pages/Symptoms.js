import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import s from '../components/Shared.module.css';

function severityColor(n) {
  if (n <= 3) return '#4caf50';
  if (n <= 6) return '#ff9800';
  return '#ef5350';
}

export default function Symptoms({ user }) {
  const [symptoms, setSymptoms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState('5');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'users', user.uid, 'symptoms'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setSymptoms(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [user.uid]);

  async function handleAdd(e) {
    e.preventDefault();
    const sev = parseInt(severity);
    if (!name.trim()) { setError('Please describe the symptom.'); return; }
    if (isNaN(sev) || sev < 1 || sev > 10) { setError('Severity must be between 1 and 10.'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'symptoms'), {
        name: name.trim(),
        severity: sev,
        date: new Date().toLocaleString(),
        createdAt: serverTimestamp(),
      });
      setName(''); setSeverity('5'); setError(''); setShowModal(false);
    } catch { setError('Failed to save. Please try again.'); }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this symptom?')) {
      await deleteDoc(doc(db, 'users', user.uid, 'symptoms', id));
    }
  }

  return (
    <div>
      <div className={s.pageTitle}>Symptoms</div>
      <div className={s.pageSub}>Log and track how you're feeling over time</div>

      <button className={s.addBtn} onClick={() => { setShowModal(true); setError(''); }}>
        + Log Symptom
      </button>

      <div className={s.card}>
        <div className={s.sectionTitle}>🌡️ Symptom History</div>
        {symptoms.length === 0
          ? <p className={s.emptyMsg}>No symptoms logged yet.</p>
          : symptoms.map(sym => (
            <div key={sym.id} className={s.itemRow}>
              <div>
                <div className={s.itemName}>{sym.name}</div>
                <div className={s.itemSub}>{sym.date}</div>
              </div>
              <div className={s.itemRight}>
                <span className={s.badge} style={{ background: severityColor(sym.severity) }}>
                  {sym.severity}/10
                </span>
                <button className={s.deleteBtn} onClick={() => handleDelete(sym.id)}>✕</button>
              </div>
            </div>
          ))
        }
      </div>

      {showModal && (
        <div className={s.modalOverlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className={s.modalBox}>
            <div className={s.modalTitle}>Log a Symptom</div>
            <form onSubmit={handleAdd}>
              <div className={s.field}>
                <label>What are you feeling?</label>
                <input placeholder="e.g. Headache, Dizzy, Nausea" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className={s.field}>
                <label>Severity (1 = mild, 10 = severe)</label>
                <input type="number" min="1" max="10" placeholder="5" value={severity} onChange={e => setSeverity(e.target.value)} />
              </div>
              {error && <div className={s.errorMsg}>{error}</div>}
              <div className={s.modalBtns}>
                <button type="button" className={s.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className={s.btnSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
