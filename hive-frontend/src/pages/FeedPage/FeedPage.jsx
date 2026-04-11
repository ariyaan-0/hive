import { useState, useEffect } from 'react';
import PostItem from '../../components/feed/PostItem';
import CreatePostForm from '../../components/feed/CreatePostForm';
import PostModal from '../../components/feed/PostModal';
import { api } from '../../utils/api';

const FeedPage = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      // The backend returns an array of { Post: {...}, votes: 0, comment_count: 0 }
      const data = await api.get('/posts/');
      setPosts(data);
    } catch (err) {
      setError(err.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    fetchPosts(); // Refresh feed after creation
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        
        {/* Left Side: Posts Feed (2/3) */}
        <div className="w-full lg:w-2/3">
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          {loading ? (
             <div className="text-center py-12">
               <p className="text-(--color-text-muted) animate-pulse font-medium">Loading network feed...</p>
             </div>
          ) : posts.length > 0 ? (
             posts.map(wrapper => (
               <PostItem 
                  key={wrapper.Post.id} 
                  post={wrapper.Post} 
                  votes={wrapper.votes}
                  commentCount={wrapper.comment_count}
                  onClick={() => setSelectedPost(wrapper.Post)} 
                  onInteraction={fetchPosts}
               />
             ))
          ) : (
             <div className="text-center py-16 bg-(--color-surface) border border-(--color-divider) rounded-xl shadow-sm">
                <p className="text-(--color-text-body) font-medium text-lg">It's awfully quiet here.</p>
                <p className="text-(--color-text-muted) mt-2">Be the first to create a post on the right!</p>
             </div>
          )}
        </div>

        {/* Right Side: Create Post Form (1/3) */}
        <div className="w-full lg:w-1/3">
          <CreatePostForm onPostCreated={handlePostCreated} />
        </div>
      </div>

      {/* Post Modal Overlay */}
      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </div>
  );
};

export default FeedPage;
