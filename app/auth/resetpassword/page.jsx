'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../auth/form.module.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('registerData'));
    if (data?.phone) {
      setPhone(data.phone);
    } else {
      router.push('/auth/forgetpassword');
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword.length < 6) {
      setMessage('❌ كلمة المرور يجب ألا تقل عن 6 أحرف');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem('registerData');
        setMessage('✅ تم تغيير كلمة المرور بنجاح');
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || 'حدث خطأ أثناء تغيير كلمة المرور'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>تغيير كلمة المرور</h2>

        <form className={styles.form} onSubmit={handleReset}>
          <div className={styles.group}>
            <label className={styles.label}>رقم الهاتف</label>
            <input
              type="tel"
              className={styles.input}
              value={phone}
              disabled
            />
          </div>

          <div className={styles.group}>
            <label className={styles.label}>كلمة المرور الجديدة</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="أدخل كلمة المرور الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                maxLength={20}
              />
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'جاري التغيير...' : 'تأكيد التغيير'}
          </button>
        </form>

        {message && <p className={styles.labelVerify}>{message}</p>}
      </div>
    </div>
  );
}
