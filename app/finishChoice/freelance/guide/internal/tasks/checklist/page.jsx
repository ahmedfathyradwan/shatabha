'use client'

import styles from './checklist.module.css'
import EyeIcon from '../../../../../../components/icons/EyeIcon'
import DownloadIcon from '../../../../../../components/icons/DownloadIcon'

export default function ChecklistPage() {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/Finishing_Items_Checklist.pdf'
    link.download = 'Finishing_Items_Checklist.pdf'
    link.click()
  }

  const handlePreview = () => {
    // يفتح الملف في تبويب جديد للعرض
    window.open('/Finishing_Items_Checklist.pdf', '_blank')
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>تحديد متطلبات التشطيب</h2>

      <div className={styles.parContainer}>
        {/* <p className={styles.par}>
          تكمن أهمية تحديد متطلبات التشطيب في توفير تصور مناسب وعدم الوقوع في
          الأخطاء الشائعة والحفاظ على الوقت والجهد والمال，
        </p> */}
        <p className={styles.par}>
          الخطوة دي مهمة جدا جدا وفرنا ليك ملف جاهز للطباعة هتحمله وتطبعه وتملاه بكل تفاصيل التشطيب اللي تناسب ذوقك وتوريه لكل مقاول قبل ما يبدأ شغل عشان ينفذ متطلباتك بالظبط من غير أي غلطات أو سوء تفاهم.
        </p>
        {/* <p className={styles.par}>
          وفرنا لك قائمة تحديد متطلبات التشطيب في شكل ملف جاهز للطباعة حتى تتمكن
          من تحديد تصورك النهائي بشكل مبسط،
        </p>
        <p className={styles.par2}>
          قم بتحميل الملف وطباعته وملئه بما يناسب تصورك.
        </p> */}
      </div>

      <div className={styles.btnGroup}>
        <button onClick={handlePreview} className={styles.previewBtn}>
          <EyeIcon className={styles.icon} />
          <span>عرض الملف</span>
        </button>

        <button onClick={handleDownload} className={styles.downloadBtn}>
          <DownloadIcon className={styles.icon} />
          <span>تحميل الملف</span>
        </button>
      </div>
    </div>
  )
}
