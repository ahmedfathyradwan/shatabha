import { NextResponse } from 'next/server';
import getDB from '../../lib/db';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'رقم الهاتف مطلوب' },
        { status: 400 }
      );
    }

    const db = getDB();
    const user = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);

    if (!user) {
      // لا نكشف إذا كان الرقم مسجلاً لأسباب أمنية
      return NextResponse.json(
        { message: 'إذا كان الرقم مسجلاً، ستصلك رسالة بكود التحقق' },
        { status: 200 }
      );
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    console.log(`\n🔑 OTP إعادة تعيين كلمة المرور لـ ${phone}: ${otp}\n`);

    db.prepare(`
      UPDATE users SET otp_code = ?, otp_expires_at = ?, updated_at = datetime('now') WHERE phone = ?
    `).run(otp, otpExpiresAt, phone);

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
