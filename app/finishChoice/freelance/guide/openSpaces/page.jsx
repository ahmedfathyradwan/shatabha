"use client";

import { useState } from "react";
import styles from "./openSpaces.module.css";
import spacesData from "../../../../data/spacesData";

export default function Page() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>المساحات المفتوحة</h1>

      <h3 className={styles.pageDescription}>
        دول 13 فكرة من أشهر الأفكار اللي ممكن تخليك تستمتع بمساحتك المفتوحة،
        <br></br>
        أكتر فكرة تحبها شوف منها صور أكتر لان كل فكرة ممكن تتنفذ بطرق كتير مختلفة.
      </h3>

      <div className={styles.grid}>
        {spacesData.map((space) => (
          <div key={space.id} className={styles.card}>
            <img
              src={space.image}
              alt={space.title}
              className={styles.image}
              onClick={() => setSelectedImage(space.image)}
              onError={(e) => {
                console.log("Image failed:", space.image);
              }}
            />
            <h2 className={styles.cardTitle}>
              {space.id}- {space.title}
            </h2>
            <h4 className={styles.cardDesc}>{space.description}</h4>

            {/* <ul className={styles.features}>
              {space.features.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul> */}

            {space.responsibleRole && (
              <p className={styles.responsibleRole}>
                المسؤول عن التنفيذ: {space.responsibleRole}
              </p>
            )}

            <a
              href={space.pinterestLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              شاهد المزيد من الصور
            </a>

            {/* زر اختيار المنفذ */}
            <div className={styles.serviceBtnContainer}>
              <button
                className={styles.serviceBtn}
                onClick={() =>
                  (window.location.href = "/finishChoice/freelance/technicians")
                }
              >
                اختيار المنفذ المناسب
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* المودال لتكبير الصور */}
      {selectedImage && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Open space view"
            className={styles.modalImage}
          />
        </div>
      )}
    </div>
  );
}
