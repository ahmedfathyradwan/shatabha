'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './verify.module.css';

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [purpose, setPurpose] = useState('register');
  const [message, setMessage] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('registerData'));
    if (data?.phone) {
      setPhoneNumber(data.phone);
      setPurpose(data.purpose || 'register');
    } else {
      router.push('/auth/register/client');
    }
  }, []);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [seconds]);

  const handleResend = async () => {
    try {
      setMessage('');
      setSeconds(30);
      setCanResend(false);

      const res = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('✅ تم إرسال كود جديد');
        // في وضع التطوير: اطبع الكود في console
        if (data.otp) console.log('📨 كود جديد:', data.otp);
      } else {
        setMessage(data.error || 'حدث خطأ أثناء إعادة الإرسال');
      }
    } catch (err) {
      console.error(err);
      setMessage('حدث خطأ أثناء إعادة الإرسال');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // لو purpose هو reset → نتحقق من OTP بس من غير تفعيل الحساب
      // لو purpose هو register → نفعّل الحساب
      const endpoint = purpose === 'reset' ? '/api/verify-reset' : '/api/verify';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp: code }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ تم التحقق بنجاح');
        localStorage.removeItem('registerData');

        setTimeout(() => {
          if (purpose === 'reset') {
            // حفظ الرقم لصفحة إعادة تعيين كلمة المرور
            localStorage.setItem(
              'registerData',
              JSON.stringify({ phone: phoneNumber, purpose: 'reset', verified: true })
            );
            router.push('/auth/resetpassword');
          } else {
            router.push('/auth/login');
          }
        }, 1500);
      } else {
        setMessage(data.error || '❌ الكود غير صحيح');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ حدث خطأ في السيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>تأكيد رقم الهاتف</h2>
        <p className={styles.labelVerify}>
          تم إرسال كود تحقق إلى رقم الهاتف: <strong>{phoneNumber}</strong>
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.labelVerify}>ادخل كود التحقق</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className={styles.input}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثال: 123456"
              required
            />
          </div>

          <button type="submit" className={styles.buttonVerify} disabled={loading}>
            {loading ? 'جاري التحقق...' : 'تأكيد الكود'}
          </button>
        </form>

        <div className={styles.formGroup}>
          {canResend ? (
            <button className={styles.smallButtonVerify} onClick={handleResend}>
              إعادة إرسال الكود
            </button>
          ) : (
            <p className={styles.labelVerify}>يمكنك إعادة الإرسال خلال {seconds} ثانية</p>
          )}
        </div>

        {message && <p className={styles.labelVerify}>{message}</p>}
      </div>
    </div>
  );
}
