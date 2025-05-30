import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = mockUsers.find((u) => u.id === params.id);
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const userIndex = mockUsers.findIndex((u) => u.id === params.id);
  
  if (userIndex === -1) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  const updatedUser = {
    ...mockUsers[userIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  mockUsers[userIndex] = updatedUser;

  return NextResponse.json(updatedUser);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userIndex = mockUsers.findIndex((u) => u.id === params.id);
  
  if (userIndex === -1) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  mockUsers.splice(userIndex, 1);

  return NextResponse.json({ success: true });
}