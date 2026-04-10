import { ArrowUp, ArrowDown, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

const PostItem = ({ post, votes, commentCount, onClick, onInteraction }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const voteSum = votes !== undefined ? votes : ((post.upvotes || 0) - (post.downvotes || 0));
  const totalComments = commentCount !== undefined ? commentCount : (post.comments?.length || 0);
  const authorName = post.owner?.username || post.username;
  const authorId = post.owner?.id || post.username;

  const handleAction = (e, action) => {
    e.stopPropagation();
    if (action === 'comment') {
      setShowCommentInput(!showCommentInput);
    }
  };

  const submitVote = async (e, dir) => {
    e.stopPropagation();
    try {
      await api.post('/vote/', { post_id: post.id, dir });
      if (onInteraction) onInteraction();
    } catch (err) {
      if (err.message && err.message.includes('already voted')) {
         // User clicked the identical vote button, toggle strictly off.
         try {
           await api.post('/vote/', { post_id: post.id, dir: 0 });
           if (onInteraction) onInteraction();
         } catch (toggleErr) {
           console.error("Failed to toggle vote:", toggleErr);
         }
      } else {
         console.error("Failed to vote:", err);
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!commentText.trim()) return;

    try {
      await api.post('/comments/', { post_id: post.id, content: commentText });
      setCommentText('');
      if (onInteraction) onInteraction();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'string') return timestamp || "Just now";
    if (timestamp.includes("Z") || timestamp.includes("T")) {
       const date = new Date(timestamp);
       return date.toLocaleDateString(); // Basic parsing fallback
    }
    return timestamp;
  };

  return (
    <div 
      className="bg-(--color-card-bg) border border-(--color-divider) rounded-xl shadow-[var(--shadow-card)] p-5 mb-6 transition-transform hover:-translate-y-1 duration-300 cursor-pointer"
      onClick={onClick}
    >
      
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-medium text-(--text-lg) text-(--color-text-heading)">
            {post.title}
          </h3>
          <p className="text-(--text-xs) text-(--color-text-muted) font-light mt-1 flex items-center gap-1">
            Posted by 
            <Link 
              to={`/profile/${authorId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-(--color-primary-500) font-medium hover:underline"
            >
              {authorName}
            </Link> 
            • {getRelativeTime(post.created_at || post.timestamp)}
          </p>
        </div>
      </div>

      {/* Post Body */}
      <div className="text-(--text-base) text-(--color-text-body) leading-relaxed mb-4 whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Post Image (Optional) */}
      {(post.imageURL || post.image) && (
        <div className="mb-4 rounded-lg overflow-hidden border border-(--color-divider)">
          <img src={post.imageURL || post.image} alt="Post content" className="w-full h-auto object-cover max-h-96" />
        </div>
      )}

      {/* Post Footer Interactions */}
      <div className="flex items-center gap-6 pt-4 border-t border-(--color-divider) text-(--color-text-muted)">
        <div className="flex items-center gap-3 bg-(--color-surface) rounded-full px-4 py-1.5 border border-(--color-divider)" onClick={e => e.stopPropagation()}>
          <button onClick={(e) => submitVote(e, 1)} className="flex items-center hover:text-(--color-primary-500) transition-colors">
            <ArrowUp className="w-5 h-5" />
          </button>
          
          <span className="text-(--text-sm) font-medium text-(--color-text-heading)">{voteSum}</span>
          
          <button onClick={(e) => submitVote(e, -1)} className="flex items-center hover:text-(--color-danger) transition-colors">
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        <button 
          className="flex items-center gap-2 hover:text-(--color-primary-500) transition-colors"
          onClick={(e) => handleAction(e, 'comment')}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-(--text-sm) font-medium">{totalComments} Comments</span>
        </button>
      </div>

      {/* Inline Comment Input */}
      {showCommentInput && (
        <form 
          className="mt-4 pt-4 border-t border-(--color-divider) animate-fade-in-up"
          onClick={e => e.stopPropagation()}
          onSubmit={submitComment}
        >
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Comment on "${post.title}"...`} 
              className="flex-1 bg-white border border-(--color-divider) rounded-full px-4 py-2 text-(--text-sm) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-(--color-primary-500) transition-all placeholder:text-(--color-text-placeholder)"
            />
            <button type="submit" className="p-2 bg-(--color-primary-500) hover:bg-(--color-primary-700) text-white rounded-full transition-colors shadow-[var(--shadow-btn)]">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default PostItem;
