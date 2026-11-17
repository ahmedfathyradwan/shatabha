import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import getDB, { initDB } from '../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    // التحقق من صلاحية الأدمن
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'جلسة الدخول منتهية' }, { status: 401 });
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'صلاحية أدمن مطلوبة' }, { status: 403 });
    }

    await initDB();
    const db = getDB();

    // 1. جلب العملاء
    const clientsResult = await db.execute(`
      SELECT 
        u.id,
        u.full_name AS fullName,
        u.phone,
        u.is_verified AS isVerified,
        u.created_at AS createdAt,
        cp.avatar_url AS avatarUrl
      FROM users u
      LEFT JOIN client_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'client'
      ORDER BY u.created_at DESC
    `);

    // 2. جلب مقدمي الخدمة
    const providersResult = await db.execute(`
      SELECT 
        u.id,
        u.full_name AS fullName,
        u.phone,
        u.is_verified AS isVerified,
        u.created_at AS createdAt,
        pp.provider_type AS providerType,
        pp.address,
        pp.specialization,
        pp.job_title AS jobTitle,
        pp.avg_price AS avgPrice,
        pp.exhibition_type AS exhibitionType,
        pp.rating
      FROM users u
      INNER JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE u.role = 'serviceProvider'
      ORDER BY u.created_at DESC
    `);

    return NextResponse.json({
      clients: clientsResult.rows,
      providers: providersResult.rows,
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching dashboard users:', error);
    return NextResponse.json({ error: 'حدث خطأ في جلب البيانات' }, { status: 500 });
  }
}
