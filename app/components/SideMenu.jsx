'use client';

import CloseArrowIcon from './icons/CloseArrowIcon';
import Link from 'next/link';
import styles from '../styles/sideMenu.module.css';

export default function SideMenu({ onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.menu}>
        <button onClick={onClose} className={styles.closeButton}>
          <CloseArrowIcon className={styles.closeIcon} />
        </button>
        <nav className={styles.links}>
          <Link href="/home" onClick={onClose} className={`${styles.link} ${styles.firstLink}`}>الرئيسية</Link>
          <Link href="/finishChoice" onClick={onClose} className={`${styles.link} ${styles.firstLink}`}>قسم التشطيب</Link>
          <Link href="/finishChoice/freelance/guide" onClick={onClose} className={`${styles.link} ${styles.secLink}`}>دليل التشطيب</Link>
          <Link href="/finishChoice/withcompany" onClick={onClose} className={`${styles.link} ${styles.secLink}`}>التشطيب مع شركة</Link>
          <Link href="/finishChoice/freelance" onClick={onClose} className={`${styles.link} ${styles.secLink}`}>التشطيب الحر</Link>
          <Link href="/maintenance" onClick={onClose} className={`${styles.link} ${styles.firstLink}`}>قسم الصيانة</Link>
          <Link href="/maintenance/maintenanceRequest" onClick={onClose} className={`${styles.link} ${styles.secLink}`}>نشر طلب صيانة</Link>
          <Link href="/maintenance/maintenanceCompanies" onClick={onClose} className={`${styles.link} ${styles.secLink}`}>شركات الصيانة</Link>
          <Link href="/maintenance/maintenanceTechnicians" onClick={onClose} className={`${styles.link} ${styles.secLink}`}>المستقلين</Link>
          <Link href="/offersPost" onClick={onClose} className={`${styles.link} ${styles.firstLink}`}>عروض الشهر</Link>
          <Link href="/online" onClick={onClose} className={`${styles.link} ${styles.firstLink}`}>خدمات تشطيب أونلاين</Link>

          <Link href="/home#about-us" onClick={onClose} className={`${styles.link} ${styles.firstLink}`}>معلومات عنا</Link>
          <Link href="/home#contact-us" onClick={onClose} className={`${styles.link} ${styles.firstLink}`}>تواصل معنا</Link>
        </nav>
      </div>
    </div>
  );
}
