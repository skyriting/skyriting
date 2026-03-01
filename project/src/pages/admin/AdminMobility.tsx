import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Trash2, ArrowLeft, Eye } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

function AdminMobilityContent() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) {
      navigate('/3636847rgyuvfu3f/98184t763gvf/login');
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${API_URL}/admin/mobility-thread`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) return;

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${API_URL}/admin/mobility-thread/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      fetchPosts();
      if (selectedPost?._id === id) {
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Mobility Thread</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Posts ({posts.length})</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {posts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No posts found</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post._id}
                      onClick={() => setSelectedPost(post)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                        selectedPost?._id === post._id ? 'bg-red-50 border-l-4 border-red-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{post.userId?.name || 'Anonymous'}</h3>
                            <span className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{post.content}</p>
                          {post.images && post.images.length > 0 && (
                            <div className="mt-2 flex space-x-2">
                              {post.images.slice(0, 3).map((img: string, idx: number) => (
                                <img key={idx} src={img} alt={`Post ${idx + 1}`} className="h-16 w-16 object-cover rounded" />
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(post._id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedPost ? (
              <div className="bg-white rounded-lg shadow sticky top-4">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Post Details</h2>
                </div>
                <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">User</h3>
                    <div className="text-sm">
                      <p><span className="font-medium">Name:</span> {selectedPost.userId?.name || 'Anonymous'}</p>
                      <p><span className="font-medium">Email:</span> {selectedPost.userId?.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Content</h3>
                    <p className="text-sm text-gray-600">{selectedPost.content}</p>
                  </div>

                  {selectedPost.images && selectedPost.images.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Images</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedPost.images.map((img: string, idx: number) => (
                          <img key={idx} src={img} alt={`Image ${idx + 1}`} className="w-full h-32 object-cover rounded" />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-400">
                      Posted: {new Date(selectedPost.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Select a post to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminMobility() {
  return (
    <ProtectedRoute admin={true}>
      <AdminMobilityContent />
    </ProtectedRoute>
  );
}
