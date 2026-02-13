import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { usePage } from '@/hooks/useSupabase';
import { buildStandaloneSections } from '@/app/useSectionComponents';
import { SidekickThemeProvider } from '@/contexts/SidekickThemeContext';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { page, loading, error } = usePage(slug);

  // Update document title when page loads
  useEffect(() => {
    if (page) {
      document.title = page.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', page.meta_description || '');
      } else if (page.meta_description) {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = page.meta_description;
        document.head.appendChild(meta);
      }
    }
    return () => {
      document.title = 'Work AI Platform';
    };
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-gray-400 text-sm">Loading page...</span>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400 mb-6">This page does not exist or is not published yet.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const sectionComponents = buildStandaloneSections(page.sections_visibility);

  return (
    <SidekickThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {page.sections_order.map((sectionId) => {
          const component = sectionComponents[sectionId];
          if (!component) return null;
          return component;
        })}
      </div>
    </SidekickThemeProvider>
  );
}
