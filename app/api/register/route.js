import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getDB from '../../lib/db';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      password,
      role,
      providerType,
      specialization,
      jobTitle,
      avgPrice,
      exhibitionType,
      address,
    } = body;

    // ============ Validation ============
    if (!fullName || !phone || !password || !role) {
      return NextResponse.json(
        { error: 'جميع الحقول الأساسية مطلوبة' },
        { status: 400 }
      );
    }

    if (!['client', 'serviceProvider'].includes(role)) {
      return NextResponse.json(
        { error: 'نوع الحساب غير صالح' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    if (!/^01[0125][0-9]{8}$/.test(phone)) {
      return NextResponse.json(
        { error: 'رقم الهاتف غير صالح' },
        { status: 400 }
      );
    }

    if (role === 'serviceProvider' && !providerType) {
      return NextResponse.json(
        { error: 'يرجى تحديد نوع مقدم الخدمة' },
        { status: 400 }
      );
    }

    const db = getDB();

    // ============ Check existing user ============
    const existingUser = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
    if (existingUser) {
      return NextResponse.json(
        { error: 'رقم الهاتف هذا مسجل مسبقاً' },
        { status: 409 }
      );
    }

    // ============ Hash password ============
    const hashedPassword = await bcrypt.hash(password, 12);

    // ============ Generate OTP ============
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    console.log(`\n🔐 OTP لـ ${phone}: ${otp}\n`);

    // ============ Create User (transaction) ============
    const insertUser = db.prepare(`
      INSERT INTO users (phone, password, full_name, role, is_verified, otp_code, otp_expires_at)
      VALUES (?, ?, ?, ?, 0, ?, ?)
    `);

    const insertClientProfile = db.prepare(`
      INSERT INTO client_profiles (user_id) VALUES (?)
    `);

    const insertProviderProfile = db.prepare(`
      INSERT INTO provider_profiles 
        (user_id, provider_type, address, specialization, job_title, avg_price, exhibition_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      const result = insertUser.run(phone, hashedPassword, fullName, role, otp, otpExpiresAt);
      const userId = result.lastInsertRowid;

      if (role === 'client') {
        insertClientProfile.run(userId);
      } else if (role === 'serviceProvider') {
        insertProviderProfile.run(
          userId,
          providerType,
          address || null,
          providerType === 'company' ? (specialization || null) : null,
          providerType === 'freelancer' ? (jobTitle || null) : null,
          providerType === 'freelancer' ? (avgPrice ? parseFloat(avgPrice) : null) : null,
          providerType === 'exhibition' ? (exhibitionType || null) : null
        );
      }

      return userId;
    });

    transaction();

    return NextResponse.json(
      { message: 'تم إنشاء الحساب بنجاح، يرجى التحقق من رقم هاتفك' },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Register error:', error);

    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'رقم الهاتف هذا مسجل مسبقاً' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'حدث خطأ في السيرفر، يرجى المحاولة مرة أخرى' },
      { status: 500 }
    );
  }
}
