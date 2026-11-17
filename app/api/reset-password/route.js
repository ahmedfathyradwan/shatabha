import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getDB from '../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, newPassword } = body;

    if (!phone || !newPassword) {
      return NextResponse.json(
        { error: 'رقم الهاتف وكلمة المرور الجديدة مطلوبان' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    const db = getDB();
    const user = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);

    if (!user) {
      return NextResponse.json(
        { error: 'رقم الهاتف غير مسجل' },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    db.prepare(`
      UPDATE users 
      SET password = ?, otp_code = NULL, otp_expires_at = NULL, updated_at = datetime('now') 
      WHERE phone = ?
    `).run(hashedPassword, phone);

    return NextResponse.json(
      { message: 'تم تغيير كلمة المرور بنجاح' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Reset password error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في السيرفر' },
      { status: 500 }
    );
  }
}
