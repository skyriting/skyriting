import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Image as ImageIcon, Send, Trash2, User, ChevronRight } from 'lucide-react';
import { getMobilityThreadPosts, createMobilityThreadPost, likeMobilityThreadPost, commentOnMobilityThreadPost, deleteMobilityThreadPost } from '../lib/api';
import { isAuthenticated, getAuthToken } from '../lib/auth';
import type { MobilityThreadPost } from '../lib/types';

export default function MobilityThread() {
  const [posts, setPosts] = useState<MobilityThreadPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', images: [] as string[] });
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getMobilityThreadPosts({ limit: 50 });
      setPosts(response.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('Please login to post');
      return;
    }
    if (!newPost.content.trim()) return;

    try {
      setPosting(true);
      await createMobilityThreadPost(newPost);
      setNewPost({ content: '', images: [] });
      fetchPosts();
    } catch (error: any) {
      alert(error.message || 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setNewPost(prev => ({ ...prev, images: [...prev.images, base64] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) {
      alert('Please login to like posts');
      return;
    }
    try {
      await likeMobilityThreadPost(postId);
      fetchPosts();
    } catch (error: any) {
      alert(error.message || 'Failed to like post');
    }
  };

  const handleComment = async (postId: string) => {
    if (!isLoggedIn) {
      alert('Please login to comment');
      return;
    }
    const commentText = commentTexts[postId];
    if (!commentText?.trim()) return;

    try {
      await commentOnMobilityThreadPost(postId, commentText);
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (error: any) {
      alert(error.message || 'Failed to add comment');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteMobilityThreadPost(postId);
      fetchPosts();
    } catch (error: any) {
      alert(error.message || 'Failed to delete post');
    }
  };

  const isPostLiked = (post: MobilityThreadPost) => {
    if (!isLoggedIn) return false;
    const token = getAuthToken();
    if (!token) return false;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return post.likes?.includes(decoded.id);
    } catch {
      return false;
    }
  };

  const getUserId = () => {
    if (!isLoggedIn) return null;
    const token = getAuthToken();
    if (!token) return null;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.id;
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Breadcrumb */}
      <section className="bg-luxury-white py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-luxury-black">Mobility Thread</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">
            Mobility Thread
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            Share your thoughts, insights, and experiences about Advanced Air Mobility
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20 bg-luxury-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Create Post Form */}
          {isLoggedIn ? (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-luxury-black/10">
              <h2 className="text-xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">Create Post</h2>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Share your thoughts about Advanced Air Mobility..."
                  className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide resize-none"
                  rows={4}
                  required
                />
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer text-luxury-black/70 hover:text-luxury-red transition font-luxury tracking-wide">
                    <ImageIcon className="h-5 w-5" />
                    <span>Add Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {newPost.images.length > 0 && (
                    <span className="text-sm text-luxury-black/70 font-luxury tracking-wide">
                      {newPost.images.length} image(s)
                    </span>
                  )}
                </div>
                {newPost.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {newPost.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setNewPost({ ...newPost, images: newPost.images.filter((_, i) => i !== idx) })}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={posting || !newPost.content.trim()}
                  className="w-full bg-luxury-red text-white py-3 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg disabled:opacity-50"
                >
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-luxury-black/10 text-center">
              <p className="text-luxury-black/70 mb-4 font-luxury tracking-wide">
                Please <Link to="/login" className="text-luxury-red hover:underline">login</Link> to create posts and engage with the community.
              </p>
            </div>
          )}

          {/* Posts Feed */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto mb-4"></div>
              <p className="text-luxury-black/70 font-luxury tracking-wide">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-luxury-black/10">
              <p className="text-luxury-black/70 font-luxury tracking-wide">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post._id || post.id} className="bg-white rounded-xl shadow-lg p-6 border border-luxury-black/10">
                  {/* Post Header */}
                  <div className="flex items-start space-x-3 mb-4">
                    {post.userPhoto ? (
                      <img src={post.userPhoto} alt={post.userName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-luxury-red/20 flex items-center justify-center">
                        <User className="h-6 w-6 text-luxury-red" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-luxury font-light text-luxury-black tracking-luxury">{post.userName}</h3>
                      <p className="text-xs text-luxury-black/50 font-luxury tracking-wide">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                    {isLoggedIn && getUserId() === post.userId && (
                      <button
                        onClick={() => handleDelete(post._id || post.id || '')}
                        className="text-luxury-black/50 hover:text-luxury-red transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Post Content */}
                  <p className="text-luxury-black/80 mb-4 font-luxury tracking-wide whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {post.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`Post image ${idx + 1}`} className="w-full h-48 object-cover rounded" />
                      ))}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center space-x-6 pt-4 border-t border-luxury-black/10">
                    <button
                      onClick={() => handleLike(post._id || post.id || '')}
                      className={`flex items-center space-x-2 transition font-luxury tracking-wide ${
                        isPostLiked(post) ? 'text-luxury-red' : 'text-luxury-black/50 hover:text-luxury-red'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isPostLiked(post) ? 'fill-current' : ''}`} />
                      <span>{post.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => {
                        const postId = post._id || post.id || '';
                        setExpandedComments(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(postId)) {
                            newSet.delete(postId);
                          } else {
                            newSet.add(postId);
                          }
                          return newSet;
                        });
                      }}
                      className="flex items-center space-x-2 text-luxury-black/50 hover:text-luxury-red transition font-luxury tracking-wide"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments.has(post._id || post.id || '') && (
                    <div className="mt-4 pt-4 border-t border-luxury-black/10">
                      {/* Comment Form */}
                      {isLoggedIn && (
                        <div className="flex items-center space-x-2 mb-4">
                          <input
                            type="text"
                            value={commentTexts[post._id || post.id || ''] || ''}
                            onChange={(e) => setCommentTexts(prev => ({ ...prev, [post._id || post.id || '']: e.target.value }))}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleComment(post._id || post.id || '');
                              }
                            }}
                          />
                          <button
                            onClick={() => handleComment(post._id || post.id || '')}
                            className="bg-luxury-red text-white px-4 py-2 rounded-lg hover:bg-luxury-red/90 transition"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Comments List */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-3">
                          {post.comments.map((comment) => (
                            <div key={comment._id} className="flex items-start space-x-3">
                              {comment.userPhoto ? (
                                <img src={comment.userPhoto} alt={comment.userName} className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-luxury-red/20 flex items-center justify-center">
                                  <User className="h-4 w-4 text-luxury-red" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-luxury font-light text-luxury-black text-sm tracking-luxury">{comment.userName}</p>
                                <p className="text-luxury-black/70 text-sm font-luxury tracking-wide">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
