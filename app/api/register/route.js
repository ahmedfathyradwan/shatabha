import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getDB, { initDB, normalizePhone } from '../../lib/db';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone: rawPhone,
      password,
      role,
      providerType,
      specialization,
      jobTitle,
      avgPrice,
      exhibitionType,
      address,
    } = body;

    const phone = normalizePhone(rawPhone);

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

    // ============ Init DB & get client ============
    await initDB();
    const db = getDB();

    // ============ Check existing user ============
    const existingResult = await db.execute({
      sql: 'SELECT id FROM users WHERE phone = ?',
      args: [phone],
    });

    if (existingResult.rows.length > 0) {
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

    // ============ Insert User ============
    const insertResult = await db.execute({
      sql: `INSERT INTO users (phone, password, full_name, role, is_verified, otp_code, otp_expires_at)
            VALUES (?, ?, ?, ?, 0, ?, ?)`,
      args: [phone, hashedPassword, fullName, role, otp, otpExpiresAt],
    });

    const userId = Number(insertResult.lastInsertRowid);

    // ============ Insert Profile ============
    if (role === 'client') {
      await db.execute({
        sql: 'INSERT INTO client_profiles (user_id) VALUES (?)',
        args: [userId],
      });
    } else if (role === 'serviceProvider') {
      await db.execute({
        sql: `INSERT INTO provider_profiles 
              (user_id, provider_type, address, specialization, job_title, avg_price, exhibition_type)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          userId,
          providerType,
          address || null,
          providerType === 'company' ? (specialization || null) : null,
          providerType === 'freelancer' ? (jobTitle || null) : null,
          providerType === 'freelancer' ? (avgPrice ? parseFloat(avgPrice) : null) : null,
          providerType === 'exhibition' ? (exhibitionType || null) : null,
        ],
      });
    }

    return NextResponse.json(
      { message: 'تم إنشاء الحساب بنجاح، يرجى التحقق من رقم هاتفك' },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Register error:', error);

    if (error.message?.includes('UNIQUE constraint failed') || error.message?.includes('UNIQUE')) {
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
