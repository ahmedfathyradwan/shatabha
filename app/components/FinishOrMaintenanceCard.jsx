
'use client';

import CloseArrowIcon from './icons/CloseArrowIcon';
import { useRouter } from 'next/navigation';
import styles from '../styles/home/FinishOrMaintenanceCard.module.css';

export default function FinishOrMaintenanceCard() {
  const router = useRouter();

  const cards = [
    {
      title: 'التشطيب',
      description: 'تشطيب داخلي وخارجي',
      image: '/images/fin.jpg',
      link: '/finishChoice',
    },
    {
      title: 'الصيانة',
      description: 'صيانة المنزل والأجهزة المنزلية',
      image: '/images/Plumbing.jpg',
      link: '/maintenance',
    }
  ];

  return (
    <>
    <div className={styles.container}>
      <h1 className={styles.title}>خدماتنا</h1>
      <div className={styles.container2}>  
      {cards.map((card, index) => (
        <div
          key={index}
          className={styles.card}
          onClick={() => router.push(card.link)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={card.image}
            alt={card.title}
            className={styles.cardImage}
          />

          <div className={styles.cardFooter}>
            <div className={styles.cardText}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <h5 className={styles.cardDescription}>{card.description}</h5>
            </div>

            <button
              className={styles.arrowButton}
              onClick={(e) => {
                e.stopPropagation();
                router.push(card.link);
              }}
            >
              <CloseArrowIcon className={styles.icon} />
            </button>
          </div>
        </div>
      ))}
      </div>
    </div>
    </>
  );
}
