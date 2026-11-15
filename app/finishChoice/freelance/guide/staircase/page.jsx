
"use client";

import { useState } from "react";
import styles from "./staircaseFinishes.module.css";

import staircaseFinishesData from "../../../../data/staircaseFinishesData";
import staircaseRailingsData from "../../../../data/staircaseRailingsData";

export default function Page() {
  const [selectedImage, setSelectedImage] = useState(null);

  // التأكد من أن البيانات Array
  const getArrayData = (data, key) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.[key])) {
      return data[key];
    }

    console.error(`Invalid data format: ${key}`, data);
    return [];
  };

  const finishes = getArrayData(
    staircaseFinishesData,
    "staircaseFinishesData"
  );

  const railings = getArrayData(
    staircaseRailingsData,
    "staircaseRailingsData"
  );

  // عرض الكروت
  const renderCards = (data) => {
    return (
      <div className={styles.grid}>
        {data.map((item) => (
          <div key={item.id} className={styles.card}>
            <img
              src={item.image}
              alt={item.title}
              className={styles.image}
              onClick={() => setSelectedImage(item.image)}
              onError={() => {
                console.log("Image failed:", item.image);
              }}
            />

            <h2 className={styles.cardTitle}>
              {item.id}- {item.title}
            </h2>

            <h4 className={styles.cardDesc}>
              {item.description}
            </h4>

            {item.responsibleRole && (
              <p className={styles.responsibleRole}>
                المسؤول عن التنفيذ: {item.responsibleRole}
              </p>
            )}

            <a
              href={item.pinterestLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              شاهد المزيد من الصور
            </a>

            <div className={styles.serviceBtnContainer}>
              <button
                className={styles.serviceBtn}
                onClick={() => {
                  window.location.href =
                    "/finishChoice/freelance/technicians";
                }}
              >
                اختيار المنفذ المناسب
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>

      {/* العنوان الرئيسي */}
      <h1 className={styles.pageTitle}>
         تشطيب السلم والترابزين
      </h1>

      <h3 className={styles.pageDescription}>
        هنستعرض أشهر أنواع تشطيب للسلم والترابزين.
      </h3>

      {/* القسم الأول: تشطيب درجات السلم */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          أولاً: أشهر أنواع تشطيب درجات السلم
        </h2>

        {/* <p className={styles.sectionDescription}>
          اختار نوع الخامة المناسبة لتشطيب درجات السلم，
          وشوف التصميمات والأشكال المختلفة لكل نوع.
        </p> */}

        {renderCards(finishes)}
      </section>

      {/* القسم الثاني: ترابزين السلم */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          ثانياً: أشهر أنواع تشطيب ترابزين السلم
        </h2>

        {/* <p className={styles.sectionDescription}>
          اختار شكل وخامة الترابزين المناسبة للسلم，
          واستعرض التصميمات المختلفة وطرق التنفيذ.
        </p> */}

        {renderCards(railings)}
      </section>

      {/* تكبير الصور */}
      {selectedImage && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Staircase design view"
            className={styles.modalImage}
          />
        </div>
      )}

    </div>
  );
}
