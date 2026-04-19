import { useState, useEffect, useRef } from 'react';
import PostItem from '../../components/feed/PostItem';
import CreatePostForm from '../../components/feed/CreatePostForm';
import PostModal from '../../components/feed/PostModal';
import { api } from '../../utils/api';

const FeedPage = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await api.get('/posts/?limit=10&skip=0');
      setPosts(data);
      setSkip(10);
      setHasMore(data.length === 10);
      setError('');
    } catch (err) {
      setError(err.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore || loading) return;
    try {
      setLoadingMore(true);
      const data = await api.get(`/posts/?limit=10&skip=${skip}`);
      setPosts(prev => {
        // filter out duplicates safely
        const newPosts = data.filter(d => !prev.some(p => p.Post.id === d.Post.id));
        return [...prev, ...newPosts];
      });
      setSkip(prev => prev + 10);
      setHasMore(data.length === 10);
    } catch (err) {
      setError(err.message || "Failed to load more posts.");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, skip]);

  const handlePostCreated = () => {
    fetchPosts(); // Refresh feed after creation
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        
        {/* Left Side: Posts Feed (2/3) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {error && (
            <div className="p-4 mb-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          {loading ? (
             <div className="text-center py-12">
               <p className="text-text-muted animate-pulse font-medium">Loading network feed...</p>
             </div>
          ) : posts.length > 0 ? (
             <>
               {posts.map(wrapper => (
                 <PostItem 
                    key={wrapper.Post.id} 
                    post={wrapper.Post} 
                    votes={wrapper.votes}
                    commentCount={wrapper.comment_count}
                    onClick={() => setSelectedPost(wrapper.Post)} 
                    onInteraction={fetchPosts}
                 />
               ))}
               
               {/* Infinite Scroll Observer Target / Loading More Indicator */}
               <div ref={observerTarget} className="py-6 text-center w-full">
                 {loadingMore ? (
                   <div className="inline-flex items-center gap-2 text-text-muted font-medium animate-pulse">
                     <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
                     Loading more posts...
                   </div>
                 ) : hasMore ? (
                   <button 
                     onClick={loadMorePosts}
                     className="px-6 py-2 rounded-full border border-divider text-text-body font-medium text-sm hover:bg-primary-500 hover:text-primary-text transition-colors"
                   >
                     Load More
                   </button>
                 ) : (
                   <p className="text-text-muted text-sm py-4">You've reached the end of the line!</p>
                 )}
               </div>
             </>
          ) : (
             <div className="text-center py-16 bg-surface border border-divider rounded-xl shadow-sm">
                <p className="text-text-body font-medium text-lg">It's awfully quiet here.</p>
                <p className="text-text-muted mt-2">Be the first to create a post on the right!</p>
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
