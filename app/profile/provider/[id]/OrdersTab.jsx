"use client";
import styles from "./OrdersTab.module.css";
import requests from "../../../mockData/requests";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function OrdersTab() {
  const router = useRouter();

  return (
    <div className={styles.ordersContainer}>
      {requests.map((req) => (
        <div key={req.id} className={styles.orderCard}>
          <div className={styles.orderInfo}>
            <p className={styles.orderDetails}>
              <strong>نوع الخدمة المطلوبة:</strong> {req.serviceType}
            </p>
            <p className={styles.orderDetails}>
              <strong>مقدم الخدمة المطلوب:</strong> {req.providerType}
            </p>
            <p className={styles.orderDetails}>
              <strong>المساحة:</strong> {req.area} م²
            </p>
            <p className={styles.orderDetails}>
              <strong>العنوان:</strong> {req.address}
            </p>
            <p className={styles.orderDetails}>
              <strong>وصف الخدمة:</strong> {req.description}
            </p>
            <p className={styles.orderDetails}>
              <strong>تاريخ نشر الخدمة:</strong> {req.date}
            </p>

            {/* 🔹 زر تقديم عرض */}
            <button
              className={styles.offerButton}
              onClick={() => router.push(`/profile/provider/offer?id=${req.id}`)}
            >
              تقديم عرض
            </button>
          </div>

                    <Image
            src={req.image}
            alt={req.serviceType}
            width={100}
            height={100}
            className={styles.orderImage}
          />
        </div>
      ))}
    </div>
  );
}
