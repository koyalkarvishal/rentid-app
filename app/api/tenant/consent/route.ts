import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tenantIdCode, shareIdentity, shareRentalHistory, shareCurrentAgr } = body;

    const tenantProfile = await prisma.tenantProfile.findUnique({
      where: { tenantIdCode },
    });

    if (!tenantProfile) {
      return NextResponse.json({ error: 'Tenant profile not found' }, { status: 404 });
    }

    const updatedConsent = await prisma.consentSetting.upsert({
      where: { tenantId: tenantProfile.id },
      update: {
        shareIdentity,
        shareRentalHistory,
        shareCurrentAgr,
      },
      create: {
        tenantId: tenantProfile.id,
        shareIdentity,
        shareRentalHistory,
        shareCurrentAgr,
      },
    });

    return NextResponse.json({
      message: 'Privacy settings updated successfully!',
      consent: updatedConsent,
    });
  } catch (error) {
    console.error('Consent API Error:', error);
    return NextResponse.json({ error: 'Failed to update privacy settings' }, { status: 500 });
  }
}