import { X, ImagePlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../utils/api';
import { validateFileSize } from '../../utils/fileValidation';

const UpdateProfileModal = ({ user, isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(user?.profilePicture || '');

  const [error, setError] = useState('');

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError('');
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sizeError = validateFileSize(file);
      if (sizeError) {
        setError(sizeError);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setError('');
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Construct FormData correctly packaging files and strings
    const formData = new FormData(e.target);
    const username = formData.get('username');

    if (username && username.trim() !== '' && !/^[a-zA-Z0-9]+$/.test(username)) {
      setError('Username must contain only letters and numbers (no special characters or spaces).');
      return;
    }
    
    // Remove empty fields to avoid overriding valid ones with null values
    const keysToRemove = [];
    for (let [key, value] of formData.entries()) {
      if ((typeof value === 'string' && value.trim() === '') || (value instanceof File && value.name === '')) {
         keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => formData.delete(k));

    try {
      const updatedUser = await api.put(`/users/${user.id}`, formData, true);
      // Optional: if utilizing a universal state, trigger a refresh here.
      onClose();
      window.location.reload(); // Hard reload to refresh feed/profile elements immediately
    } catch (err) {
      console.error(err);
      setError("Failed to update profile: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm sm:px-6">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="bg-page-bg w-full max-w-xl h-auto max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col relative z-10 overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-surface border-b border-divider px-6 py-4 shrink-0 shadow-sm z-20">
          <h2 className="font-heading font-bold text-(--text-xl) text-text-heading">
            Update Profile
          </h2>
          <button 
            onClick={onClose}
            type="button"
            className="p-2 text-text-muted hover:text-primary-500 hover:bg-primary-50 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 bg-page-bg">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form id="updateProfileForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload Area */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <img 
                  src={previewImage || 'https://ui-avatars.com/api/?name=User&background=000000&color=fff&size=200'} 
                  alt="Profile Preview" 
                  className="w-28 h-28 rounded-full border-4 border-surface object-cover shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary-500 text-primary-text p-2 rounded-full shadow-[var(--shadow-btn)] hover:bg-primary-700 transition-colors"
                >
                  <ImagePlus className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  name="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-(--text-xs) text-text-muted">JPG, PNG, GIF — max 5MB (Optional)</p>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-(--text-sm) font-medium text-text-body">Name</label>
                <input 
                  type="text" 
                  name="name"
                  defaultValue={user?.name}
                  placeholder="Your Name"
                  className="w-full bg-card-bg border border-divider rounded-lg px-4 py-2 text-(--text-base) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-primary-500 transition-all placeholder:text-text-placeholder"
                />
              </div>

              <div className="space-y-1">
                <label className="text-(--text-sm) font-medium text-text-body">Username</label>
                <input 
                  type="text" 
                  name="username"
                  defaultValue={user?.username}
                  placeholder="e.g. alicewonder"
                  className="w-full bg-card-bg border border-divider rounded-lg px-4 py-2 text-(--text-base) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-primary-500 transition-all placeholder:text-text-placeholder"
                />
                <p className="text-(--text-xs) text-text-muted">Letters and numbers only.</p>
              </div>

              <div className="space-y-1">
                <label className="text-(--text-sm) font-medium text-text-body">Email</label>
                <input 
                  type="email" 
                  name="email"
                  defaultValue={user?.email}
                  placeholder="email@example.com"
                  className="w-full bg-card-bg border border-divider rounded-lg px-4 py-2 text-(--text-base) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-primary-500 transition-all placeholder:text-text-placeholder"
                />
              </div>

              <div className="space-y-1">
                <label className="text-(--text-sm) font-medium text-text-body">New Password</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Leave blank to keep current"
                  className="w-full bg-card-bg border border-divider rounded-lg px-4 py-2 text-(--text-base) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-primary-500 transition-all placeholder:text-text-placeholder"
                />
              </div>
            </div>

            {/* Bio Field */}
            <div className="space-y-1">
              <label className="text-(--text-sm) font-medium text-text-body">Bio</label>
              <textarea 
                name="bio"
                rows={3}
                defaultValue={user?.bio}
                placeholder="A little bit about yourself..."
                className="w-full bg-card-bg border border-divider rounded-lg px-4 py-2 text-(--text-base) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-primary-500 transition-all resize-none placeholder:text-text-placeholder"
              />
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="bg-surface border-t border-divider p-4 flex justify-end gap-3 z-20">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full text-text-body font-medium hover:bg-divider/50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="updateProfileForm"
            className="bg-primary-500 hover:bg-primary-700 text-primary-text px-8 py-2 rounded-full font-medium shadow-[var(--shadow-btn)] hover:shadow-[var(--shadow-btn-hover)] transition-all"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateProfileModal;
