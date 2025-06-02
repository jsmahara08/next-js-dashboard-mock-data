import { NextResponse } from 'next/server';
import { mockNews } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const news = mockNews.find((n) => n.id === params.id);
  
  if (!news) {
    return NextResponse.json(
      { error: 'News article not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(news);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const newsIndex = mockNews.findIndex((n) => n.id === params.id);
  
  if (newsIndex === -1) {
    return NextResponse.json(
      { error: 'News article not found' },
      { status: 404 }
    );
  }

  const updatedNews = {
    ...mockNews[newsIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  mockNews[newsIndex] = updatedNews;

  return NextResponse.json(updatedNews);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const newsIndex = mockNews.findIndex((n) => n.id === params.id);
  
  if (newsIndex === -1) {
    return NextResponse.json(
      { error: 'News article not found' },
      { status: 404 }
    );
  }

  mockNews.splice(newsIndex, 1);

  return NextResponse.json({ success: true });
}