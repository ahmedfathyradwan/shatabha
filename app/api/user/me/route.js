import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import getDB from '../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// GET /api/user/me - جلب بيانات المستخدم الحالي
export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'غير مسجل الدخول' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: 'الجلسة انتهت، يرجى تسجيل الدخول مرة أخرى' },
        { status: 401 }
      );
    }

    const db = getDB();

    const user = db.prepare(`
      SELECT 
        u.id, 
        u.phone, 
        u.full_name AS fullName, 
        u.role, 
        u.is_verified AS isVerified, 
        u.created_at AS createdAt,
        cp.avatar_url AS clientAvatar,
        pp.provider_type AS providerType,
        pp.address,
        pp.specialization,
        pp.job_title AS jobTitle,
        pp.avg_price AS avgPrice,
        pp.exhibition_type AS exhibitionType,
        pp.rating,
        pp.bio,
        pp.avatar_url AS providerAvatar
      FROM users u
      LEFT JOIN client_profiles cp ON u.id = cp.user_id
      LEFT JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE u.id = ?
    `).get(decoded.id);

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const userData = {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      userType: user.role,
      isVerified: Boolean(user.isVerified),
      createdAt: user.createdAt,
    };

    if (user.role === 'serviceProvider') {
      userData.providerType = user.providerType;
      userData.address = user.address;
      userData.specialization = user.specialization;
      userData.jobTitle = user.jobTitle;
      userData.avgPrice = user.avgPrice;
      userData.exhibitionType = user.exhibitionType;
      userData.rating = user.rating;
      userData.bio = user.bio;
      userData.avatarUrl = user.providerAvatar;
    }

    if (user.role === 'client') {
      userData.avatarUrl = user.clientAvatar;
    }

    return NextResponse.json({ user: userData }, { status: 200 });

  } catch (error) {
    console.error('❌ Get user error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في السيرفر' },
      { status: 500 }
    );
  }
}
