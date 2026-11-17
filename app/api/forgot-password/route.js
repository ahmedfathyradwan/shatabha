import { NextResponse } from 'next/server';
import getDB, { initDB, normalizePhone } from '../../lib/db';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone: rawPhone } = body;
    const phone = normalizePhone(rawPhone);

    if (!phone) {
      return NextResponse.json(
        { error: 'رقم الهاتف مطلوب' },
        { status: 400 }
      );
    }

    await initDB();
    const db = getDB();

    const result = await db.execute({
      sql: 'SELECT id FROM users WHERE phone = ?',
      args: [phone],
    });

    if (result.rows.length === 0) {
      // لا نكشف إذا كان الرقم مسجلاً لأسباب أمنية
      return NextResponse.json(
        { message: 'إذا كان الرقم مسجلاً، ستصلك رسالة بكود التحقق' },
        { status: 200 }
      );
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    console.log(`\n🔑 OTP إعادة تعيين كلمة المرور لـ ${phone}: ${otp}\n`);

    await db.execute({
      sql: `UPDATE users SET otp_code = ?, otp_expires_at = ?, updated_at = datetime('now') WHERE phone = ?`,
      args: [otp, otpExpiresAt, phone],
    });

    return NextResponse.json(
      { message: 'تم إرسال كود التحقق' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في السيرفر' },
      { status: 500 }
    );
  }
}
