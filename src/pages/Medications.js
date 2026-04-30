import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import s from '../components/Shared.module.css';

export default function Medications({ user }) {
  const [medications, setMedications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'users', user.uid, 'medications'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setMedications(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [user.uid]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim() || !dose.trim() || !frequency.trim()) { setError('Please fill in all fields.'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'medications'), {
        name: name.trim(), dose: dose.trim(), frequency: frequency.trim(),
        createdAt: serverTimestamp(),
      });
      setName(''); setDose(''); setFrequency(''); setError(''); setShowModal(false);
    } catch { setError('Failed to save. Please try again.'); }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (window.confirm('Remove this medication?')) {
      await deleteDoc(doc(db, 'users', user.uid, 'medications', id));
    }
  }

  return (
    <div>
      <div className={s.pageTitle}>Medications</div>
      <div className={s.pageSub}>Keep track of everything you're taking</div>

      <button className={s.addBtn} onClick={() => { setShowModal(true); setError(''); }}>
        + Add Medication
      </button>

      <div className={s.card}>
        <div className={s.sectionTitle}>💊 Medication List</div>
        {medications.length === 0
          ? <p className={s.emptyMsg}>No medications added yet.</p>
          : medications.map(med => (
            <div key={med.id} className={s.itemRow}>
              <div>
                <div className={s.itemName}>{med.name}</div>
                <div className={s.itemSub}>Dose: {med.dose} · {med.frequency}</div>
              </div>
              <button className={s.deleteBtn} onClick={() => handleDelete(med.id)}>✕</button>
            </div>
          ))
        }
      </div>

      {showModal && (
        <div className={s.modalOverlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className={s.modalBox}>
            <div className={s.modalTitle}>Add a Medication</div>
            <form onSubmit={handleAdd}>
              <div className={s.field}>
                <label>Medication Name</label>
                <input placeholder="e.g. Ibuprofen" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className={s.field}>
                <label>Dose</label>
                <input placeholder="e.g. 200mg" value={dose} onChange={e => setDose(e.target.value)} />
              </div>
              <div className={s.field}>
                <label>Frequency</label>
                <input placeholder="e.g. Twice a day" value={frequency} onChange={e => setFrequency(e.target.value)} />
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
