'use client'

import { useRef, useState } from 'react'
import styles from './visualization.module.css'

export default function VisualizationPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const drawings = [
    {
      id: 1,
      title: "رسمة ثنائية الأبعاد 2D",
      type: "Image",
      image: "/images/2d.jpg",
      desc: [
        "هي الأساس اللي بيعتمد عليه التنفيذ في الموقع.",
        "بتوضح توزيع العناصر والمسافات بدقة لتجنب الغلطات.",
      ],
      responsible: [
        "المهندس المعماري",
        "رسام 2D"
      ]
    },
    {
      id: 2,
      title: "رسمة ثلاثية الأبعاد 3D",
      type: "Image",
      image: "/images/3d.jpg",
      desc: [
        "بتوضح الشكل النهائي للشقة بشكل واقعي قبل التنفيذ.",
        "بتساعد في اتخاذ قرارات بخصوص الألوان والخامات والإضاءة.",
        "تقلل من احتمالية التعديلات المكلفة أثناء التنفيذ."
      ],
      responsible: [
        "المهندس المعماري",
        "رسام 3D"
      ]
    },
    {
      id: 3,
      title: "فيديو تخيلي للشقة",
      type: "Video",
      image: "/images/3D VID.mp4",
      desc: [
        "يوفر تجربة بصرية واقعية للحركة داخل التصميم.",
        "يساعد في فهم توزيع المساحات والتناسق بين الغرف.",
      ],
      responsible: [
        "مصمم داخلي",
        "مصمم فيديوهات تخيلية (3D Motion Designer)"
      ]
    }
  ]

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>إنشاء الرسومات - 2D & 3D "اختياري"</h2>
      <p className={styles.par}>
        بعد ما حددت متطلبات التشطيب واخترت نوع التشطيب اللي مرتاحله وحددت الديكورات اللي عايزها في شقتك واخترت الألوان اللي عجبتك،
        دلوقي نقدر نتصور الشقة بعد ما تتشطب هيكون شكلها اي متاح رسم ثنائي وثلاثي الأبعاد وكمان فيديو تخيلي للشقة بعد التشطيب كلم منفذ الخدمة اللي محتاجها وابعتله كل البيانات وشوف شقتك هيكون شكلها اي بعد التشطيب.
      </p>

      <div className={styles.grid}>
        {drawings.map(d => (
          <div key={d.id} className={styles.card}>
            {d.type === "Video" ? (
              <div className={styles.videoContainer}>
                <video
                  ref={videoRef}
                  src={d.image}
                  className={styles.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <button className={styles.playBtn} onClick={togglePlay}>
                  {isPlaying ? "⏸ إيقاف مؤقت" : "▶️ تشغيل"}
                </button>
              </div>
            ) : (
              <img src={d.image} alt={d.title} className={styles.image} />
            )}

            <div className={styles.info}>
              <h3 className={styles.titleCard}>{d.title}</h3>

              <ul className={styles.descList}>
                {d.desc.map((item, index) => (
                  <li key={index} className={styles.descItem}>
                    • {item}
                  </li>
                ))}
              </ul>

              <div className={styles.responsible}>
                <strong>المسئول عن تنفيذ هذه المرحلة:</strong>
                <ul className={styles.respList}>
                  {d.responsible.map((person, index) => (
                    <li key={index} className={styles.respItem}>• {person}</li>
                  ))}
                </ul>
              </div>

              <button
                className={styles.serviceBtn}
                onClick={() => window.location.href = "/freelance/technicians"}
              >
                اختيار المنفذ المناسب
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
