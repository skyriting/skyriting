import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Image as ImageIcon, Send, Trash2, User, ChevronRight, X, Camera, Loader, MoreHorizontal } from 'lucide-react';
import { getMobilityThreadPosts, createMobilityThreadPost, likeMobilityThreadPost, commentOnMobilityThreadPost, deleteMobilityThreadPost } from '../lib/api';
import { isAuthenticated, getAuthToken } from '../lib/auth';
import type { MobilityThreadPost } from '../lib/types';

function TimeAgo({ date }: { date: string | Date | undefined }) {
  if (!date) return null;
  const d = new Date(date);
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return <span>Just now</span>;
  if (mins < 60) return <span>{mins}m ago</span>;
  if (hrs < 24) return <span>{hrs}h ago</span>;
  if (days < 7) return <span>{days}d ago</span>;
  return <span>{d.toLocaleDateString()}</span>;
}

export default function MobilityThread() {
  const [posts, setPosts] = useState<MobilityThreadPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', images: [] as string[] });
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState<{ [key: string]: boolean }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const token = getAuthToken();
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setCurrentUserId(decoded.id);
        } catch {}
      }
    }
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
    if (!isLoggedIn) { alert('Please login to post'); return; }
    if (!newPost.content.trim() && newPost.images.length === 0) return;

    try {
      setPosting(true);
      await createMobilityThreadPost({ content: newPost.content, images: newPost.images });
      setNewPost({ content: '', images: [] });
      await fetchPosts();
    } catch (error: any) {
      alert(error.message || 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (newPost.images.length + files.length > 4) {
      alert('You can upload a maximum of 4 images per post');
      return;
    }
    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Image "${file.name}" is too large. Max size is 5MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setNewPost(prev => ({ ...prev, images: [...prev.images, base64] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setNewPost(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) { alert('Please login to like posts'); return; }
    try {
      await likeMobilityThreadPost(postId);
      // Optimistically update
      setPosts(prev => prev.map(p => {
        if ((p._id || p.id) !== postId) return p;
        const likes = p.likes || [];
        const isLiked = currentUserId ? likes.includes(currentUserId) : false;
        return {
          ...p,
          likes: isLiked
            ? likes.filter(id => id !== currentUserId)
            : [...likes, currentUserId!],
        };
      }));
    } catch (error: any) {
      alert(error.message || 'Failed to like post');
    }
  };

  const handleComment = async (postId: string) => {
    if (!isLoggedIn) { alert('Please login to comment'); return; }
    const commentText = commentTexts[postId];
    if (!commentText?.trim()) return;
    setSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      await commentOnMobilityThreadPost(postId, commentText);
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
      await fetchPosts();
    } catch (error: any) {
      alert(error.message || 'Failed to add comment');
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await deleteMobilityThreadPost(postId);
      setPosts(prev => prev.filter(p => (p._id || p.id) !== postId));
    } catch (error: any) {
      alert(error.message || 'Failed to delete post');
    }
  };

  const isLiked = (post: MobilityThreadPost) => {
    if (!currentUserId) return false;
    return post.likes?.includes(currentUserId) || false;
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const s = new Set(prev);
      s.has(postId) ? s.delete(postId) : s.add(postId);
      return s;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-red-600 transition">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 font-medium">Mobility Thread</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
            <MessageCircle className="h-3.5 w-3.5 text-red-400" />
            <span className="text-xs tracking-widest uppercase text-white/80">Community</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3 tracking-tight">Mobility Thread</h1>
          <p className="text-white/60 text-sm sm:text-base max-w-lg mx-auto">
            Share thoughts, insights, and experiences about Advanced Air Mobility
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Create Post */}
        {isLoggedIn ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
            <form onSubmit={handlePostSubmit}>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-4.5 w-4.5 text-red-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost.content}
                    onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Share your thoughts about Advanced Air Mobility..."
                    className="w-full px-0 py-1 border-0 text-gray-800 placeholder-gray-400 focus:outline-none resize-none text-sm leading-relaxed"
                    rows={3}
                  />

                  {/* Image previews */}
                  {newPost.images.length > 0 && (
                    <div className={`grid gap-2 mt-3 ${newPost.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {newPost.images.map((img, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100">
                          <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition hover:bg-black/80"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={newPost.images.length >= 4}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        Photo {newPost.images.length > 0 && `(${newPost.images.length}/4)`}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={posting || (!newPost.content.trim() && newPost.images.length === 0)}
                      className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {posting ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      {posting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              <Link to="/login" className="text-red-600 hover:text-red-700 font-semibold">Sign in</Link>
              {' '}to share your thoughts and join the conversation.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition"
            >
              Sign In to Post
            </Link>
          </div>
        )}

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-20">
            <Loader className="h-8 w-8 text-red-600 animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <MessageCircle className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map(post => {
              const postId = post._id || post.id || '';
              const liked = isLiked(post);
              const commentsOpen = expandedComments.has(postId);

              return (
                <div key={postId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Post Header */}
                  <div className="flex items-start gap-3 p-4 pb-3">
                    {post.userPhoto ? (
                      <img src={post.userPhoto} alt={post.userName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">{post.userName?.[0]?.toUpperCase() || 'U'}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{post.userName}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs">
                            <TimeAgo date={post.createdAt} />
                          </span>
                          {currentUserId === post.userId && (
                            <button
                              onClick={() => handleDelete(postId)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  {post.content && (
                    <div className="px-4 pb-3">
                      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>
                  )}

                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className={`grid gap-0.5 ${post.images.length === 1 ? '' : post.images.length === 2 ? 'grid-cols-2' : post.images.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {post.images.slice(0, 4).map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative overflow-hidden bg-gray-100 ${
                            post.images!.length === 1 ? 'aspect-video' :
                            post.images!.length === 3 && idx === 0 ? 'row-span-2 aspect-square' :
                            'aspect-square'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Post image ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => window.open(img, '_blank')}
                          />
                          {idx === 3 && post.images!.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white text-xl font-bold">+{post.images!.length - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t border-gray-50 flex items-center gap-4">
                    <button
                      onClick={() => handleLike(postId)}
                      className={`flex items-center gap-1.5 text-sm transition ${
                        liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                      <span className="text-xs font-medium">{post.likes?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(postId)}
                      className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">{post.comments?.length || 0}</span>
                    </button>
                  </div>

                  {/* Comments */}
                  {commentsOpen && (
                    <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                      {/* Existing comments */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-3 mb-3">
                          {post.comments.map(comment => (
                            <div key={comment._id} className="flex gap-2">
                              {comment.userPhoto ? (
                                <img src={comment.userPhoto} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-semibold">{comment.userName?.[0]?.toUpperCase() || 'U'}</span>
                                </div>
                              )}
                              <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                                <p className="text-xs font-semibold text-gray-900 mb-0.5">{comment.userName}</p>
                                <p className="text-xs text-gray-700 leading-relaxed">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment input */}
                      {isLoggedIn ? (
                        <div className="flex gap-2 items-center">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={commentTexts[postId] || ''}
                              onChange={e => setCommentTexts(prev => ({ ...prev, [postId]: e.target.value }))}
                              placeholder="Write a comment..."
                              className="w-full px-4 py-2 bg-gray-100 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/30 pr-10"
                              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment(postId); } }}
                            />
                          </div>
                          <button
                            onClick={() => handleComment(postId)}
                            disabled={submittingComment[postId] || !commentTexts[postId]?.trim()}
                            className="w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full transition disabled:opacity-50"
                          >
                            {submittingComment[postId] ? (
                              <Loader className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Send className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 text-center py-1">
                          <Link to="/login" className="text-red-600 hover:underline">Sign in</Link> to comment
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
