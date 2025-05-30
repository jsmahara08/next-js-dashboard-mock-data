import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to the Admin Panel
        </h1>
        <p className="text-muted-foreground text-lg">
          A comprehensive admin dashboard for managing your content, users, courses, and more.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/admin/login">
              Access Admin Panel <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}