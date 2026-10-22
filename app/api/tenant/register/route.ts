import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      data: {
        id: 'RENTID-' + Math.floor(100000 + Math.random() * 900000),
        ...body,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}