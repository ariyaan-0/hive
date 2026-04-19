import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PostItem from '../../components/feed/PostItem';
import PostModal from '../../components/feed/PostModal';
import UpdateProfileModal from '../../components/profile/UpdateProfileModal';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

const UserProfileCard = ({ user, isOwnProfile, onUpdateClick }) => {
  return (
    <div className="bg-card-bg border border-divider rounded-xl shadow-[var(--shadow-card)] p-6 sticky top-24">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <img 
          src={user?.imageURL || 'https://ui-avatars.com/api/?name=User&background=000000&color=fff&size=200'}  
          alt={user?.name || 'User Profile'} 
          className="w-32 h-32 rounded-full border-4 border-surface shadow-sm object-cover"
        />
      </div>

      {/* Primary Details */}
      <div className="text-center mb-6">
        <h2 className="font-heading font-medium text-(--text-xl) text-text-heading mb-1">
          {user?.name}
        </h2>
        <p className="text-(--text-sm) font-medium text-primary-500 mb-4">
          @{user?.username}
        </p>
        
        {/* Email - Shown only if own profile */}
        {isOwnProfile && user?.email && (
          <p className="text-(--text-sm) text-text-muted mb-4">
            {user.email}
          </p>
        )}

        {/* Bio */}
        <p className="text-(--text-base) text-text-body leading-relaxed">
          {user?.bio || "No biography provided."}
        </p>
      </div>

      {/* Update Button - Shown only if own profile */}
      {isOwnProfile && (
        <div className="mt-8">
          <button 
            onClick={onUpdateClick}
            className="w-full py-2.5 bg-primary-500 hover:bg-primary-700 text-primary-text rounded-full font-medium shadow-[var(--shadow-btn)] hover:shadow-[var(--shadow-btn-hover)] transition-all"
          >
            Update Profile
          </button>
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Determine target. If no param id exists, it defaults to the active user explicitly.
  const targetId = id || currentUser?.id;
  const isOwnProfile = currentUser && targetId === currentUser.id;

  const fetchProfileData = async () => {
    if (!targetId) return;
    try {
      setLoading(true);
      const [uRes, pRes] = await Promise.all([
         api.get(`/users/${targetId}`),
         api.get(`/posts/user?user_id=${targetId}`)
      ]);
      setProfileUser(uRes);
      setUserPosts(pRes);
    } catch (err) {
      setError(err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [targetId]);

  // Surgically update a single post's vote/comment count without re-fetching everything
  const updatePostStats = async (postId) => {
    try {
      const freshPost = await api.get(`/posts/${postId}`);
      setUserPosts(prev =>
        prev.map(wrapper =>
          wrapper.Post.id === postId
            ? { ...wrapper, votes: freshPost.votes, comment_count: freshPost.comment_count ?? wrapper.comment_count }
            : wrapper
        )
      );
    } catch (err) {
      console.error('Failed to refresh post stats:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-text-muted animate-pulse font-medium">Loading profile...</p>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-heading text-2xl text-text-heading">Profile not found.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: User Profile Metrics (1/3) */}
        <div className="w-full lg:w-1/3">
          <UserProfileCard 
            user={profileUser} 
            isOwnProfile={isOwnProfile} 
            onUpdateClick={() => setIsUpdateModalOpen(true)}
          />
        </div>

        {/* Right Side: Associated User Posts (2/3) */}
        <div className="w-full lg:w-2/3">
          {userPosts.length > 0 ? (
            userPosts.map(wrapper => (
              <PostItem 
                key={wrapper.Post.id} 
                post={wrapper.Post}
                votes={wrapper.votes}
                commentCount={wrapper.comment_count} 
                onClick={() => setSelectedPost(wrapper.Post)} 
                onInteraction={() => updatePostStats(wrapper.Post.id)}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-surface border border-divider rounded-xl">
              <p className="text-text-muted font-light">
                {profileUser.name} hasn't posted anything yet.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Update Profile Form Overlay */}
      <UpdateProfileModal 
        user={profileUser}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />

      {/* Shared Post Modal Component */}
      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </div>
  );
};

export default ProfilePage;
