'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './forgetpassword.module.css';

const ForgetPassword = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSendCode = async () => {
    setError('');
    const egyptianPhoneRegex = /^(010|011|012|015)\d{8}$/;

    if (!phone) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }

    if (!egyptianPhoneRegex.test(phone)) {
      setError('يرجى إدخال رقم هاتف مصري صحيح مكون من 11 رقم');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        // حفظ الرقم والغرض من التحقق في localStorage
        localStorage.setItem(
          'registerData',
          JSON.stringify({ phone, purpose: 'reset' })
        );
        router.push('/auth/verify');
      } else {
        const data = await res.json();
        setError(data.error || 'حدث خطأ أثناء إرسال الكود');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>نسيت كلمة المرور؟</h1>
        <div className={styles.formGroup}>
          <p className={styles.label}>ادخل رقم الهاتف لإرسال كود التحقق</p>
          <input
            type="tel"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) => {
              let val = e.target.value;
              val = val.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
              if (/^\d*$/.test(val)) {
                setPhone(val.slice(0, 11));
              }
            }}
            maxLength={11}
            required
            className={styles.input}
          />
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <button
          className={styles.button}
          onClick={handleSendCode}
          disabled={loading}
        >
          {loading ? 'جاري الإرسال...' : 'إرسال الكود'}
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;
