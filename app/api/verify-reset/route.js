import { NextResponse } from 'next/server';
import getDB, { initDB, normalizePhone } from '../../lib/db';

// POST /api/verify-reset - التحقق من OTP لإعادة تعيين كلمة المرور (بدون تفعيل الحساب)
export async function POST(request) {
  try {
    const body = await request.json();
    const { phone: rawPhone, otp } = body;
    const phone = normalizePhone(rawPhone);

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'رقم الهاتف وكود التحقق مطلوبان' },
        { status: 400 }
      );
    }

    await initDB();
    const db = getDB();

    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE phone = ?',
      args: [phone],
    });
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: 'رقم الهاتف غير مسجل' },
        { status: 404 }
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

    // لا نحذف الـ OTP هنا - سيُحذف بعد تغيير كلمة المرور
    return NextResponse.json(
      { message: 'تم التحقق بنجاح، يمكنك الآن تغيير كلمة المرور' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Verify reset error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في السيرفر' },
      { status: 500 }
    );
  }
}
