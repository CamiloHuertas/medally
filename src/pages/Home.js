import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import s from '../components/Shared.module.css';

function severityColor(n) {
  if (n <= 3) return '#4caf50';
  if (n <= 6) return '#ff9800';
  return '#ef5350';
}

export default function Home({ user }) {
  const [symptoms, setSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const username = user.email.split('@')[0];

  useEffect(() => {
    const sq = query(collection(db, 'users', user.uid, 'symptoms'), orderBy('createdAt', 'desc'), limit(3));
    const mq = query(collection(db, 'users', user.uid, 'medications'), orderBy('createdAt', 'desc'), limit(3));
    const u1 = onSnapshot(sq, snap => setSymptoms(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u2 = onSnapshot(mq, snap => setMedications(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { u1(); u2(); };
  }, [user.uid]);

  return (
    <div>
      <div className={s.pageTitle}>Hello, {username} 👋</div>
      <div className={s.pageSub}>Here's your health summary</div>

      <div className={s.statsRow}>
        <div className={s.statBox}>
          <div className={s.statNum}>{symptoms.length}</div>
          <div className={s.statLabel}>Recent Symptoms</div>
        </div>
        <div className={s.statBox}>
          <div className={s.statNum}>{medications.length}</div>
          <div className={s.statLabel}>Medications</div>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.sectionTitle}>🌡️ Recent Symptoms</div>
        {symptoms.length === 0
          ? <p className={s.emptyMsg}>No symptoms logged yet. Go to the Symptoms tab to add one.</p>
          : symptoms.map(sym => (
            <div key={sym.id} className={s.itemRow}>
              <div>
                <div className={s.itemName}>{sym.name}</div>
                <div className={s.itemSub}>{sym.date}</div>
              </div>
              <span className={s.badge} style={{ background: severityColor(sym.severity) }}>
                {sym.severity}/10
              </span>
            </div>
          ))
        }
      </div>

      <div className={s.card}>
        <div className={s.sectionTitle}>💊 Current Medications</div>
        {medications.length === 0
          ? <p className={s.emptyMsg}>No medications added yet. Go to the Medications tab to add one.</p>
          : medications.map(med => (
            <div key={med.id} className={s.itemRow}>
              <div>
                <div className={s.itemName}>{med.name}</div>
                <div className={s.itemSub}>{med.dose} · {med.frequency}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
