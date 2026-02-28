import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, User, Eye, ArrowLeft } from 'lucide-react';
import { getArticleBySlug } from '../lib/api';
import type { Article } from '../lib/types';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  const fetchArticle = async (articleSlug: string) => {
    try {
      setLoading(true);
      const response = await getArticleBySlug(articleSlug);
      if (response.article) {
        setArticle(response.article);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 flex items-center justify-center bg-luxury-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto mb-4"></div>
          <p className="text-luxury-black/70 font-luxury tracking-wide">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 flex items-center justify-center bg-luxury-white">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-luxury-black/10">
          <h2 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">Article not found</h2>
          <Link to="/articles" className="text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide">
            Return to News & Media
          </Link>
        </div>
      </div>
    );
  }

  // Check if imageUrl is Base64
  const isBase64 = article.imageUrl?.startsWith('data:image');

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-luxury-white">
      {/* Breadcrumb - Responsive with proper spacing */}
      <section className="bg-luxury-white py-3 sm:py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <Link to="/articles" className="hover:text-luxury-red transition">News and Media</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-luxury-black truncate max-w-[200px] sm:max-w-none">{article.title}</span>
          </nav>
        </div>
      </section>

      {/* Article Detail */}
      <article className="py-8 sm:py-12 lg:py-16 bg-luxury-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/articles')}
            className="flex items-center space-x-2 text-luxury-black/70 hover:text-luxury-red transition mb-6 sm:mb-8 font-luxury tracking-wide text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Back to News & Media</span>
          </button>

          {/* Article Header */}
          <div className="mb-6 sm:mb-8">
            {article.category && (
              <span className="inline-block text-xs sm:text-sm text-luxury-red font-luxury tracking-wide uppercase mb-3 sm:mb-4">
                {article.category}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-luxury font-light text-luxury-black mb-4 sm:mb-6 tracking-luxury leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-luxury-black/70 font-luxury tracking-wide">
              {article.author && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
              {article.publishedAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              )}
              {article.viewCount !== undefined && (
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{article.viewCount} views</span>
                </div>
              )}
            </div>
          </div>

          {/* Article Image */}
          {article.imageUrl && (
            <div className="mb-6 sm:mb-8 rounded-lg overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className={`w-full h-auto ${isBase64 ? 'object-contain' : 'object-cover'} rounded-lg shadow-lg`}
                style={{ maxHeight: '600px' }}
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none text-luxury-black/80 font-luxury tracking-wide leading-relaxed text-sm sm:text-base"
            style={{
              lineHeight: '1.8',
            }}
            dangerouslySetInnerHTML={{ 
              __html: article.content.replace(/\n/g, '<br />') 
            }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-luxury-black/10">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-luxury-white-off text-luxury-black/70 rounded-full text-xs sm:text-sm font-luxury tracking-wide border border-luxury-black/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back Button at Bottom */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-luxury-black/10">
            <button
              onClick={() => navigate('/articles')}
              className="flex items-center space-x-2 px-6 py-3 bg-luxury-white-off text-luxury-black rounded-lg hover:bg-luxury-white-cream transition font-luxury tracking-wide border border-luxury-black/10"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Back to News & Media</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
