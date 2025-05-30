import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockUsers);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newUser = {
    ...body,
    id: (mockUsers.length + 1).toString(),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  mockUsers.push(newUser);

  return NextResponse.json(newUser, { status: 201 });
}