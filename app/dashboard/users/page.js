'use client';

import { useEffect, useState } from 'react';
import styles from './users.module.css';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'providers'
  const [clients, setClients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();

      if (res.ok) {
        setClients(data.clients || []);
        setProviders(data.providers || []);
      } else {
        setError(data.error || 'فشل في تحميل بيانات المستخدمين');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  const getProviderTypeBadge = (type) => {
    switch (type) {
      case 'company':
        return <span className={`${styles.badge} ${styles.badgeTypeCompany}`}>شركة / مكتب</span>;
      case 'freelancer':
        return <span className={`${styles.badge} ${styles.badgeTypeFreelance}`}>مستقل / فردي</span>;
      case 'exhibition':
        return <span className={`${styles.badge} ${styles.badgeTypeExhibition}`}>معرض خامات</span>;
      default:
        return <span className={styles.badge}>{type || 'غير محدد'}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>إدارة المستخدمين</h2>
          <p className={styles.subtitle}>عرض وتتبع العملاء ومقدمي الخدمات المسجلين بقاعدة البيانات</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'clients' ? styles.active : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          <span>العملاء</span>
          <span className={styles.countBadge}>{clients.length}</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'providers' ? styles.active : ''}`}
          onClick={() => setActiveTab('providers')}
        >
          <span>مقدمو الخدمة</span>
          <span className={styles.countBadge}>{providers.length}</span>
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}>جارٍ تحميل البيانات...</div>
      ) : error ? (
        <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>{error}</div>
      ) : activeTab === 'clients' ? (
        /* جدول العملاء */
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            {clients.length === 0 ? (
              <p className={styles.emptyState}>لا يوجد عملاء مسجلين حالياً</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم بالكامل</th>
                    <th>رقم الهاتف</th>
                    <th>حالة التفعيل</th>
                    <th>تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, index) => (
                    <tr key={client.id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{client.fullName}</strong>
                      </td>
                      <td dir="ltr" style={{ textAlign: 'right' }}>{client.phone}</td>
                      <td>
                        {client.isVerified ? (
                          <span className={`${styles.badge} ${styles.badgeVerified}`}>مفعّل</span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgePending}`}>قيد التأكيد</span>
                        )}
                      </td>
                      <td>{formatDate(client.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        /* جدول مقدمي الخدمة */
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            {providers.length === 0 ? (
              <p className={styles.emptyState}>لا يوجد مقدمو خدمة مسجلين حالياً</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم / الكيان</th>
                    <th>نوع المزود</th>
                    <th>رقم الهاتف</th>
                    <th>التخصص / المجال</th>
                    <th>المحافظة / العنوان</th>
                    <th>متوسط السعر</th>
                    <th>حالة الحساب</th>
                    <th>تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p, index) => (
                    <tr key={p.id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{p.fullName}</strong>
                      </td>
                      <td>{getProviderTypeBadge(p.providerType)}</td>
                      <td dir="ltr" style={{ textAlign: 'right' }}>{p.phone}</td>
                      <td>
                        {p.specialization || p.jobTitle || p.exhibitionType || '-'}
                      </td>
                      <td>{p.address || '-'}</td>
                      <td>
                        {p.avgPrice ? `${p.avgPrice} ج.م` : '-'}
                      </td>
                      <td>
                        {p.isVerified ? (
                          <span className={`${styles.badge} ${styles.badgeVerified}`}>مفعّل</span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgePending}`}>قيد التأكيد</span>
                        )}
                      </td>
                      <td>{formatDate(p.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
