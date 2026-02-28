import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { getArticles } from '../lib/api';
import type { Article } from '../lib/types';

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [category, featured]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (category !== 'all') params.category = category;
      if (featured) params.featured = true;
      
      const response = await getArticles(params);
      setArticles(response.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Breadcrumb - Responsive with proper spacing */}
      <section className="bg-luxury-white py-3 sm:py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-luxury-black">News and Media</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">
            News and Media
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            Growing demand for private aviation soars as luxury travel takes off to new heights.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <button
              onClick={() => setCategory('all')}
              className={`px-4 py-2 rounded-lg font-luxury tracking-wide transition ${
                category === 'all' ? 'bg-luxury-red text-white' : 'bg-white text-luxury-black border border-luxury-black/20'
              }`}
            >
              All
            </button>
            {['News', 'Media', 'Press Release', 'Blog', 'Industry Insights'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-luxury tracking-wide transition ${
                  category === cat ? 'bg-luxury-red text-white' : 'bg-white text-luxury-black border border-luxury-black/20'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setFeatured(!featured)}
              className={`px-4 py-2 rounded-lg font-luxury tracking-wide transition ${
                featured ? 'bg-luxury-red text-white' : 'bg-white text-luxury-black border border-luxury-black/20'
              }`}
            >
              Featured
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto mb-4"></div>
              <p className="text-luxury-black/70 font-luxury tracking-wide">Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-luxury-black/70 font-luxury tracking-wide">No articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((art) => (
                <Link
                  key={art._id || art.id}
                  to={`/articles/${art.slug || art.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-luxury-black/10 group"
                >
                  {art.imageUrl && (
                    <div className="relative h-48 bg-luxury-black/5 overflow-hidden">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className={`w-full h-full ${art.imageUrl.startsWith('data:image') ? 'object-contain' : 'object-cover'} group-hover:scale-110 transition-transform duration-300`}
                        style={{ maxHeight: '200px' }}
                      />
                      {art.isFeatured && (
                        <div className="absolute top-4 right-4 bg-luxury-red text-white px-3 py-1 rounded-full text-xs font-luxury tracking-wide">
                          Featured
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    {art.category && (
                      <span className="text-xs text-luxury-red font-luxury tracking-wide uppercase mb-2 block">
                        {art.category}
                      </span>
                    )}
                    <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury line-clamp-2">
                      {art.title}
                    </h3>
                    {art.excerpt && (
                      <p className="text-luxury-black/70 mb-4 text-sm font-luxury tracking-wide line-clamp-3">
                        {art.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-luxury-black/50 font-luxury tracking-wide">
                      {art.publishedAt && (
                        <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
                      )}
                      <div className="flex items-center space-x-2 group-hover:text-luxury-red transition">
                        <span>Read More</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
