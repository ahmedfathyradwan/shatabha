'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      if (!userData || !userData.id) {
        router.push('/auth/login');
      } else if (userData.role === 'client' || userData.userType === 'client') {
        router.push(`/profile/client/${userData.id}`);
      } else if (
        userData.role === 'serviceProvider' ||
        userData.userType === 'serviceProvider'
      ) {
        router.push(`/profile/provider/${userData.id}`);
      } else if (userData.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <p style={{ fontFamily: 'Changa', color: '#64748b' }}>جارٍ التوجيه إلى ملفك الشخصي...</p>
    </div>
  );
};

export default ProfilePage;
