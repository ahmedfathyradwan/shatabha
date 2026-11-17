'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch('/api/logout', { method: 'POST' });
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        // حذف بيانات المستخدم من localStorage
        localStorage.removeItem('userData');
        localStorage.removeItem('registerData');
        // التوجيه لصفحة تسجيل الدخول
        router.push('/auth/login');
      }
    };

    logout();
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <p style={{ color: '#64748b', fontFamily: 'Changa', fontSize: '1.2rem' }}>
        جارٍ تسجيل الخروج...
      </p>
    </div>
  );
}
