import { NextResponse } from 'next/server';
import getDB from '../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'رقم الهاتف وكود التحقق مطلوبان' },
        { status: 400 }
      );
    }

    const db = getDB();
    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);

    if (!user) {
      return NextResponse.json(
        { error: 'رقم الهاتف غير مسجل' },
        { status: 404 }
      );
    }

    if (user.is_verified) {
      return NextResponse.json(
        { error: 'الحساب مفعّل مسبقاً' },
        { status: 400 }
      );
    }

    if (!user.otp_code || user.otp_code !== otp.toString()) {
      return NextResponse.json(
        { error: 'كود التحقق غير صحيح' },
        { status: 400 }
      );
    }

    if (!user.otp_expires_at || new Date() > new Date(user.otp_expires_at)) {
      return NextResponse.json(
        { error: 'كود التحقق منتهي الصلاحية، يرجى طلب كود جديد' },
        { status: 400 }
      );
    }

    // ============ Activate Account ============
    db.prepare(`
      UPDATE users 
      SET is_verified = 1, otp_code = NULL, otp_expires_at = NULL, updated_at = datetime('now')
      WHERE phone = ?
    `).run(phone);

    return NextResponse.json(
      { message: 'تم تفعيل الحساب بنجاح' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Verify error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في السيرفر' },
      { status: 500 }
    );
  }
}
