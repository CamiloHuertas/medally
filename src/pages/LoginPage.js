import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const msgs = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/invalid-credential': 'Incorrect email or password.',
      };
      setError(msgs[err.code] || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>💊</span>
          <h1 className={styles.brandName}>MedAlly</h1>
          <p className={styles.brandTagline}>Your Health, Simplified</p>
        </div>
        <ul className={styles.features}>
          <li>🌡️ Track your symptoms over time</li>
          <li>💊 Manage all your medications</li>
          <li>📋 Share reports with your doctor</li>
        </ul>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className={styles.cardSub}>{isSignUp ? 'Sign up to get started' : 'Sign in to your account'}</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email" required placeholder="you@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password" required placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <p className={styles.toggle}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span onClick={() => { setIsSignUp(v => !v); setError(''); }}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
