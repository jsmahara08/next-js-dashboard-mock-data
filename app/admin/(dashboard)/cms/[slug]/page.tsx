// app/admin/(dashboard)/cms/[slug]/page.tsx
import CmsEditPage from '@/components/cms-edit-page';
import { mockCMSPages } from '@/lib/mock-data';

export async function generateStaticParams() {
  return mockCMSPages.map((page) => ({
    slug: page.slug,
  }));
}

export default function Page() {
  return <CmsEditPage />; // ✅ No props passed
}
