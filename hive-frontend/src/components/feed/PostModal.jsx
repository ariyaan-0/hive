import { X, ArrowUp, ArrowDown, MessageSquare, Send, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmModal from '../common/ConfirmModal';
import UpdatePostModal from './UpdatePostModal';

const PostModal = ({ post, onClose }) => {
  const { user: currentUser } = useAuth();
  
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [localVoteSum, setLocalVoteSum] = useState((post.upvotes || 0) - (post.downvotes || 0));
  
  // Settings Menu state
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const settingsRef = useRef(null);

  const [error, setError] = useState('');

  const authorName = post.owner?.username || post.username;

  // Check strict ownership (Post schema usually stores owner_id)
  const isOwner = currentUser && post.owner_id === currentUser.id;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    fetchComments();
    setError('');
    return () => {
      document.body.style.overflow = 'auto'; // Revert back
    };
  }, [post.id]);

  useEffect(() => {
    // Close dropdown on outside click
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchComments = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        api.get(`/posts/${post.id}`),
        api.get(`/comments/${post.id}`)
      ]);
      setComments(commentsData || []);
      setLocalVoteSum(postData.votes);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      await api.post('/comments/', { post_id: post.id, content: commentText });
      setCommentText('');
      await fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const submitVote = async (dir) => {
    try {
      await api.post('/vote/', { post_id: post.id, dir });
      await fetchComments();
    } catch (err) {
      if (err.message && err.message.includes('already voted')) {
         try {
           await api.post('/vote/', { post_id: post.id, dir: 0 });
           await fetchComments();
         } catch (toggleErr) {
           console.error("Failed to toggle vote:", toggleErr);
         }
      } else {
         console.error("Failed to vote:", err);
      }
    }
  };

  const handleDeletePost = async () => {
    setError('');
    try {
      await api.delete(`/posts/${post.id}`);
      onClose();
      window.location.reload(); // Synchronize global feed/profile views safely
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError("Failed to delete post: " + err.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'string') return timestamp || "Just now";
    if (timestamp.includes("Z") || timestamp.includes("T")) {
       const date = new Date(timestamp);
       return date.toLocaleDateString();
    }
    return timestamp;
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center bg-black/60 backdrop-blur-sm sm:pt-10 sm:pb-10 sm:px-6">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div 
        className="bg-(--color-page-bg) w-full max-w-3xl h-full sm:h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col relative z-10 overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-(--color-surface) border-b border-(--color-divider) px-6 py-4 shrink-0 shadow-sm z-20 relative">
          <h2 className="font-heading font-bold text-(--text-xl) text-(--color-text-heading) truncate pr-4">
            {post.title}
          </h2>
          
          <div className="flex items-center gap-2">
            {/* Context Menu (Only if Owner) */}
            {isOwner && (
              <div className="relative" ref={settingsRef}>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-(--color-text-muted) hover:text-(--color-primary-500) hover:bg-(--color-primary-50) rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                {/* Dropdown Menu */}
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-(--color-divider) rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
                    <button 
                      onClick={() => { setShowSettings(false); setShowUpdateModal(true); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-(--text-sm) font-medium text-(--color-text-body) hover:bg-(--color-primary-50) hover:text-(--color-primary-500) transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Update Post
                    </button>
                    <div className="h-px bg-(--color-divider) w-full"></div>
                    <button 
                      onClick={() => { setShowSettings(false); setShowDeleteModal(true); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-(--text-sm) font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={onClose}
              className="p-2 text-(--color-text-muted) hover:text-(--color-primary-500) hover:bg-(--color-primary-50) rounded-full transition-colors shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="m-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium animate-fade-in">
              {error}
            </div>
          )}
          {/* Main Post Section */}
          <div className="p-6 bg-(--color-card-bg) border-b border-(--color-divider)">
            <p className="text-(--text-sm) text-(--color-text-muted) font-light mb-4">
              Posted by <Link to={`/profile/${post.owner?.id || post.username}`} onClick={(e) => e.stopPropagation()} className="text-(--color-primary-500) font-medium hover:underline">{authorName}</Link> • {getRelativeTime(post.created_at || post.timestamp)}
            </p>
            
            <div className="text-(--text-base) text-(--color-text-body) leading-relaxed mb-6 whitespace-pre-wrap">
              {post.content}
            </div>

            {(post.imageURL || post.image) && (
              <div className="mb-6 rounded-lg overflow-hidden border border-(--color-divider)">
                <img src={post.imageURL || post.image} alt="Post content" className="w-full h-auto max-h-[500px] object-cover" />
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex items-center gap-6 text-(--color-text-muted)">
              <div className="flex items-center gap-3 bg-(--color-surface) rounded-full px-4 py-1.5 border border-(--color-divider)">
                <button onClick={() => submitVote(1)} className="flex items-center hover:text-(--color-primary-500) transition-colors">
                  <ArrowUp className="w-5 h-5" />
                </button>
                <span className="text-(--text-sm) font-medium text-(--color-text-heading)">{localVoteSum}</span>
                <button onClick={() => submitVote(-1)} className="flex items-center hover:text-(--color-danger) transition-colors">
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="text-(--text-sm) font-medium">{comments.length} Comments</span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6 pb-24 space-y-6">
            <h3 className="font-heading font-medium text-(--text-lg) text-(--color-text-heading) mb-4">
              Comments
            </h3>
            
            {loading ? (
              <p className="text-center text-(--color-text-muted) animate-pulse py-8">Loading comments...</p>
             ) : comments && comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="bg-(--color-card-bg) p-4 rounded-xl border border-(--color-divider) shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    {comment.owner?.id || comment.user?.id || comment.owner_id || comment.user_id ? (
                      <Link 
                        to={`/profile/${comment.owner?.id || comment.user?.id || comment.owner_id || comment.user_id}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="text-(--text-sm) font-medium text-(--color-primary-500) hover:underline"
                      >
                        {comment.owner?.username || comment.user?.username || 'Anonymous'}
                      </Link>
                    ) : (
                      <span className="text-(--text-sm) font-medium text-(--color-primary-500)">{comment.owner?.username || comment.user?.username || 'Anonymous'}</span>
                    )}
                    <span className="text-(--text-xs) font-light text-(--color-text-placeholder)">{getRelativeTime(comment.created_at || comment.timestamp)}</span>
                  </div>
                  <p className="text-(--text-sm) text-(--color-text-body)">{comment.content || comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-(--text-sm) text-(--color-text-muted) italic">No comments yet. Be the first to start the conversation!</p>
            )}
          </div>
        </div>

        {/* Floating/Sticky Comment Input */}
        <form onSubmit={submitComment} className="absolute left-0 right-0 bottom-0 bg-(--color-surface) border-t border-(--color-divider) p-4 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Write a comment...`} 
              className="flex-1 bg-white border border-(--color-divider) rounded-full px-4 py-2.5 text-(--text-sm) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-(--color-primary-500) transition-all placeholder:text-(--color-text-placeholder)"
            />
            <button type="submit" disabled={!commentText.trim()} className="p-2.5 bg-(--color-primary-500) hover:bg-(--color-primary-700) disabled:opacity-50 text-white rounded-full transition-colors shadow-[var(--shadow-btn)]">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>

      {/* Settings Action Modals */}
      <ConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePost}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action is permanent and cannot be undone."
      />
      
      <UpdatePostModal 
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        post={post}
        onPostUpdated={() => window.location.reload()}
      />
    </div>
  );
};

export default PostModal;
