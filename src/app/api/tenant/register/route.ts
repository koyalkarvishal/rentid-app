import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, mobile, profilePhoto } = body;

    if (!fullName || !email || !mobile) {
      return NextResponse.json(
        { error: 'Name, Email, and Mobile number are required!' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { mobile }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'This Email or Mobile number is already registered!' },
        { status: 400 }
      );
    }

    // Generate Unique Tenant ID Code (e.g. TID-2026-8F7K29)
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const tenantIdCode = `TID-2026-${randomCode}`;

    // Public Verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${tenantIdCode}`;

    // Generate QR Code
    const qrCodeUrl = await QRCode.toDataURL(verificationUrl);

    // Database Transaction: User + Tenant Profile + Default Consent
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        mobile,
        role: 'TENANT',
        tenantProfile: {
          create: {
            tenantIdCode,
            profilePhoto: profilePhoto || null,
            qrCodeUrl,
            consentSetting: {
              create: {
                shareIdentity: true,
                shareRentalHistory: true,
                shareCurrentAgr: true,
                shareReferences: false,
                sharePayments: false,
              },
            },
          },
        },
      },
      include: {
        tenantProfile: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Tenant Registration Successful!',
        tenantIdCode,
        qrCodeUrl,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          mobile: newUser.mobile,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Server Error! Registration failed.' },
      { status: 500 }
    );
  }
}