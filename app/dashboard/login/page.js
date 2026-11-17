'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      setError('يرجى إدخال رقم الهاتف وكلمة المرور');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user?.role !== 'admin') {
          setError('هذا الحساب ليس لديه صلاحية وصول للوحة التحكم');
          return;
        }

        localStorage.setItem('userData', JSON.stringify(data.user));
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('حدث خطأ أثناء الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.card}>
        <div className={styles.header}>
          <Image
            src="/favicon.ico"
            alt="Logo"
            width={48}
            height={48}
            className={styles.logo}
          />
          <h1 className={styles.title}>تسجيل دخول الإدارة</h1>
          <p className={styles.subtitle}>يرجى إدخال بيانات حساب المسؤول للوصول للوحة التحكم</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>رقم الهاتف</label>
            <input
              type="tel"
              className={styles.input}
              placeholder="01xxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>كلمة المرور</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'جارٍ التحقق...' : 'تسجيل الدخول إلى لوحة التحكم'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>نظام إدارة شطبها دوت كوم</span>
        </div>
      </div>
    </div>
  );
}
