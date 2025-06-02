import { NextResponse } from 'next/server';
import { mockNews } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockNews);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newNews = {
    ...body,
    id: (mockNews.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockNews.push(newNews);

  return NextResponse.json(newNews, { status: 201 });
}