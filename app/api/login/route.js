import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDB from '../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: 'رقم الهاتف وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    const db = getDB();

    // ============ Find User ============
    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);

    if (!user) {
      return NextResponse.json(
        { error: 'رقم الهاتف أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // ============ Check if verified ============
    if (!user.is_verified) {
      return NextResponse.json(
        { error: 'الحساب لم يتم تفعيله بعد، يرجى تأكيد رقم هاتفك' },
        { status: 403 }
      );
    }

    // ============ Check Password ============
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'رقم الهاتف أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // ============ Get Profile data ============
    let providerType = null;
    if (user.role === 'serviceProvider') {
      const profile = db.prepare('SELECT provider_type FROM provider_profiles WHERE user_id = ?').get(user.id);
      if (profile) providerType = profile.provider_type;
    }

    // ============ Generate JWT ============
    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ============ Build user data ============
    const userData = {
      id: user.id,
      fullName: user.full_name,
      phone: user.phone,
      role: user.role,
      userType: user.role,
      ...(providerType && { providerType }),
    };

    const response = NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      user: userData,
      userType: user.role,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في السيرفر، يرجى المحاولة مرة أخرى' },
      { status: 500 }
    );
  }
}
