import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { landlordName, landlordMobile, houseNo, propertyAddress, tenantIdCode, rentAmount, depositAmount, overallRating, rentPayment, maintenance, comment } = body;

    // 1. Find Tenant Profile
    const tenantProfile = await prisma.tenantProfile.findUnique({
      where: { tenantIdCode },
    });

    if (!tenantProfile) {
      return NextResponse.json({ error: 'Tenant ID not found!' }, { status: 404 });
    }

    // 2. Find or Create Landlord
    let landlordUser = await prisma.user.findFirst({ where: { mobile: landlordMobile } });
    if (!landlordUser) {
      landlordUser = await prisma.user.create({
        data: {
          fullName: landlordName,
          email: `landlord_${Date.now()}@rentid.com`,
          mobile: landlordMobile,
          role: 'LANDLORD',
        },
      });
    }

    let landlordProfile = await prisma.landlordProfile.findUnique({
      where: { userId: landlordUser.id },
    });

    if (!landlordProfile) {
      landlordProfile = await prisma.landlordProfile.create({
        data: { userId: landlordUser.id },
      });
    }

    // 3. Create Property
    const property = await prisma.property.create({
      data: {
        landlordId: landlordProfile.id,
        houseNo,
        address: propertyAddress,
        rentAmount: parseFloat(rentAmount),
        deposit: parseFloat(depositAmount),
      },
    });

    // 4. Create Agreement & Tenancy
    const agreement = await prisma.agreement.create({
      data: {
        agreementCode: `AGR-${Date.now()}`,
        propertyId: property.id,
        tenantId: tenantProfile.id,
        landlordId: landlordProfile.id,
        startDate: new Date(),
        rentAmount: parseFloat(rentAmount),
        depositAmount: parseFloat(depositAmount),
      },
    });

    const tenancy = await prisma.tenancy.create({
      data: {
        agreementId: agreement.id,
        tenantId: tenantProfile.id,
        propertyId: property.id,
        startDate: new Date(),
      },
    });

    // 5. Submit Official Review
    const review = await prisma.review.create({
      data: {
        tenancyId: tenancy.id,
        targetTenantId: tenantProfile.id,
        landlordId: landlordProfile.id,
        overallRating: parseFloat(overallRating),
        rentPayment: parseFloat(rentPayment || overallRating),
        maintenance: parseFloat(maintenance || overallRating),
        comment,
      },
    });

    return NextResponse.json({ message: 'Review & Tenancy recorded successfully!', review }, { status: 201 });
  } catch (error) {
    console.error('Landlord Review Error:', error);
    return NextResponse.json({ error: 'Failed to record landlord review' }, { status: 500 });
  }
}