import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import s from '../components/Shared.module.css';
import rs from './Report.module.css';

function severityColor(n) {
  if (n <= 3) return '#4caf50';
  if (n <= 6) return '#ff9800';
  return '#ef5350';
}

export default function Report({ user }) {
  const [symptoms, setSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [copied, setCopied] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const sq = query(collection(db, 'users', user.uid, 'symptoms'), orderBy('createdAt', 'desc'));
    const mq = query(collection(db, 'users', user.uid, 'medications'), orderBy('createdAt', 'desc'));
    const u1 = onSnapshot(sq, snap => setSymptoms(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u2 = onSnapshot(mq, snap => setMedications(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { u1(); u2(); };
  }, [user.uid]);

  function buildReport() {
    let t = `MEDALLYAPP — HEALTH REPORT\nGenerated: ${today}\n${'='.repeat(40)}\n\n`;
    t += `MEDICATIONS (${medications.length})\n${'-'.repeat(30)}\n`;
    medications.length === 0 ? t += 'No medications recorded.\n'
      : medications.forEach(m => { t += `• ${m.name} — ${m.dose}, ${m.frequency}\n`; });
    t += `\nSYMPTOMS (${symptoms.length})\n${'-'.repeat(30)}\n`;
    symptoms.length === 0 ? t += 'No symptoms recorded.\n'
      : symptoms.forEach(s => { t += `• ${s.name} — Severity ${s.severity}/10 — ${s.date}\n`; });
    t += `\n${'='.repeat(40)}\nPlease share this with your healthcare provider.`;
    return t;
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildReport()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div>
      <div className={s.pageTitle}>Health Report</div>
      <div className={s.pageSub}>Share this summary with your doctor</div>

      <div className={rs.reportHeader}>
        <div>
          <div className={rs.reportTitle}>📋 Health Report</div>
          <div className={rs.reportDate}>Generated: {today}</div>
          <div className={rs.reportUser}>Patient: {user.email}</div>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.sectionTitle}>💊 Medications ({medications.length})</div>
        {medications.length === 0
          ? <p className={s.emptyMsg}>No medications recorded.</p>
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

      <div className={s.card}>
        <div className={s.sectionTitle}>🌡️ Symptoms ({symptoms.length})</div>
        {symptoms.length === 0
          ? <p className={s.emptyMsg}>No symptoms recorded.</p>
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

      <div className={rs.actions}>
        <button className={rs.copyBtn} onClick={handleCopy}>
          {copied ? '✅ Copied!' : '📋 Copy Report'}
        </button>
        <button className={rs.printBtn} onClick={handlePrint}>
          🖨️ Print / Save PDF
        </button>
      </div>
      <p className={rs.hint}>Copy the report and paste it into an email, or print it to bring to your appointment.</p>
    </div>
  );
}
