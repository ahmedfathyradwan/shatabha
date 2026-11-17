import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';

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

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        clientProfile: true,
        providerProfile: true,
      },
    });

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
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    if (user.role === 'serviceProvider' && user.providerProfile) {
      userData.providerType = user.providerProfile.providerType;
      userData.address = user.providerProfile.address;
      userData.specialization = user.providerProfile.specialization;
      userData.jobTitle = user.providerProfile.jobTitle;
      userData.avgPrice = user.providerProfile.avgPrice;
      userData.exhibitionType = user.providerProfile.exhibitionType;
      userData.rating = user.providerProfile.rating;
      userData.bio = user.providerProfile.bio;
      userData.avatarUrl = user.providerProfile.avatarUrl;
    }

    if (user.role === 'client' && user.clientProfile) {
      userData.avatarUrl = user.clientProfile.avatarUrl;
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
