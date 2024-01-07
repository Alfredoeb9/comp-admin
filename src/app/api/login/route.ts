import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { compare } from 'bcrypt';

export async function POST(req: NextRequest, res: any) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (email === '') throw new Error('Please provide a email');
    if (password === '') throw new Error('Please provide a password');

    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: 'Email or password do not match' },
        { status: 500 }
      );
    }

    const passwordMatch = await compare(password, existingUserByEmail.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { user: null, message: 'Email or password do not match' },
        { status: 500 }
      );
    }

    if (existingUserByEmail.isVerified == false) {
      return NextResponse.json(
        { message: 'Email is not verified, Please verify email!' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { user: existingUserByEmail, message: 'User created Successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
