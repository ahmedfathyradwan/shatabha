"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import requests from "../../../mockData/requests";
import styles from "./OfferPage.module.css";

export default function OfferPage() {
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const request = requests.find((r) => r.id === Number(id)) || requests[0];

  // ✅ نمنع الـ mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // يمنع الـ hydration error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmChecked) {
      alert("يجب تأكيد أنك طلبت صورة البطاقة الشخصية من العميل قبل المتابعة.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      {/* 🔹 تفاصيل الطلب */}
      <div className={styles.requestCard}>
        <div className={styles.requestInfo}>
          <p className={styles.orderDetails}>
            <strong>نوع الخدمة المطلوبة:</strong> {request.serviceType}
          </p>
          <p className={styles.orderDetails}>
            <strong>مقدم الخدمة المطلوب:</strong> {request.providerType}
          </p>
          <p className={styles.orderDetails}>
            <strong>المساحة:</strong> {request.area} م²
          </p>
          <p className={styles.orderDetails}>
            <strong>العنوان:</strong> {request.address}
          </p>
          <p className={styles.orderDetails}>
            <strong>وصف الخدمة:</strong> {request.description}
          </p>
          <p className={styles.orderDetails}>
            <strong>تاريخ نشر الخدمة:</strong> {request.date}
          </p>
        </div>
        <img
          src={request.image}
          alt={request.serviceType}
          className={styles.image}
        />

      </div>
      <h2 className={styles.title}>تقديم عرض</h2>

      {/* 🔹 بعد التقديم */}
      {submitted ? (
        <div className={styles.successBox}>
          <p>تم تقديم عرضك بنجاح</p>
          <p>في انتظار قبول العميل لعرضك بالتوفيق!</p>

          <button
            className={styles.backButton}
            onClick={() => router.push(`/profile/provider/${id}`)}
          >
            الرجوع إلى الملف الشخصي
          </button>
        </div>
      ) : (

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>السعر التقريبي</label>
            <input
              type="number"
              placeholder="مثال: 5000"
              maxLength={20}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>مدة التنفيذ المتوقعة</label>
            <input
              type="text"
              placeholder="مثال: 10 أيام"
              className={styles.input}
              required
              maxLength={50}

            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>تاريخ بدء التنفيذ</label>
            <input
              type="date"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>رقم الهاتف</label>
            <input
              type="number"
              placeholder="01XXXXXXXXX"
              className={styles.input}
              required
              maxLength={11}
              pattern="^(010|011|012|015)[0-9]{8}$"
              title="الرجاء إدخال رقم هاتف مصري صحيح مكون من 11 رقمًا (يبدأ بـ 010 أو 011 أو 012 أو 015)"
            />
          </div>

          {/* ✅ التشيك بوكس */}
          <div className={styles.warningBox}>
            <input
              type="checkbox"
              id="confirm"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              required
            />
            <label htmlFor="confirm" className={styles.warning}>
              هام جدًا: برجاء طلب صورة البطاقة الشخصية للعميل قبل بدء التنفيذ وإعطائها لأحد أفراد عائلتك وإعلامهم بمكان عملك.
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            تقديم عرض
          </button>
        </form>
      )}
    </div>
  );
}
