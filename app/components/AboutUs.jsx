import Image from 'next/image';
import styles from '../styles/home/aboutUs.module.css';

export default function AboutUs() {
  return (
    <section className={styles.aboutUsSection}>
      <h2 className={styles.title}>معلومات عنا</h2>
      <img
        src="/images/logo.png"
        alt="شطب - SHATAB.eg"
        className={styles.logo}
      />
      <h3 className={styles.shatab}>SHATABHA<span className={styles.shatabSpan}>.com</span></h3>
      <h3 className={styles.description}>
          منصتك الذكية لتشطيب شقتك بسهولة وبأفضل جودة.<br />
        كل اللي تحتاجه لتشطيب شقتك في مكان واحد.<br />
        شركات موثوقة وفنيين محترفين… بسهولة وبدون تعقيد.
      </h3>
    </section>
  );
}