"use client";
import styles from "./ProfileTab.module.css";
import { useState } from "react";

export default function ProfileTab({ data }) {
  const [images, setImages] = useState([]);
  const maxImages = 5;

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newImages = filesToAdd.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);

    if (files.length > remainingSlots) {
      alert(
        `الحد الأقصى للصور هو ${maxImages}. يمكنك رفع المزيد مقابل الاشتراك المدفوع.`
      );
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={styles.profileContainer}>
        <h3 className={styles.worksTitle}>معرض أعمالي</h3>

        <label className={styles.singleButton}>
          إضافة أو حذف صور
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            hidden
          />
        </label>

        <p style={{ fontSize: "0.9rem", color: "gray", marginTop: "0.5rem" }}>
          الحد الأقصى للصور: {maxImages}. يمكنك رفع المزيد مقابل الاشتراك المدفوع.
          <br />
          للإشتراك المدفوع، يرجى التواصل معنا من خلال صفحة "تواصل معنا".
        </p>

        <div className={styles.imagesGrid}>
          {images.length > 0 ? (
            images.map((src, index) => (
              <div key={index} className={styles.imageWrapper}>
                <img
                  src={src}
                  alt={`work-${index}`}
                  className={styles.imagePreview}
                />
                <button
                  className={styles.removeImageButton}
                  onClick={() => handleRemoveImage(index)}
                >
                  ✖
                </button>
              </div>
            ))
          ) : (
            <p className={styles.noImages}>لا توجد صور حالياً</p>
          )}
        </div>
    </div>
  );
}
