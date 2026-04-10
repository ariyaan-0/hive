import { ImagePlus, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { api } from '../../utils/api';

const UpdatePostModal = ({ isOpen, onClose, post, onPostUpdated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && post) {
      document.body.style.overflow = 'hidden';
      setTitle(post.title || '');
      setContent(post.content || '');
      setCurrentImage(post.imageURL || post.image || null);
      setSelectedFile(null);
      setError('');
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, post]);

  if (!isOpen || !post) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      
      // If a new physical file is selected, attach it
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      
      await api.patch(`/posts/${post.id}`, formData, true);
      
      if (onPostUpdated) onPostUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update post:", err);
      setError("Failed to update post: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setCurrentImage(URL.createObjectURL(file)); // Show preview instantly
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex justify-center items-center bg-black/60 backdrop-blur-sm sm:px-6">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={!loading ? onClose : null} />
      
      {/* Modal Container */}
      <div className="bg-(--color-page-bg) w-full max-w-xl h-auto max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col relative z-10 overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-(--color-surface) border-b border-(--color-divider) px-6 py-4 shrink-0 shadow-sm z-20">
          <h2 className="font-heading font-bold text-(--text-xl) text-(--color-text-heading)">
            Update Post
          </h2>
          <button 
            onClick={onClose}
            disabled={loading}
            type="button"
            className="p-2 text-(--color-text-muted) hover:text-(--color-primary-500) hover:bg-(--color-primary-50) rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-(--color-page-bg)">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium animate-fade-in">
              {error}
            </div>
          )}
          <form id="updatePostForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-(--text-sm) font-medium text-(--color-text-heading)">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post Title..." 
                className="w-full bg-white border border-(--color-divider) rounded-lg px-4 py-3 text-(--text-base) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-(--color-primary-500) transition-all"
              />
            </div>

            {/* Content Input */}
            <div className="space-y-1.5">
              <label className="text-(--text-sm) font-medium text-(--color-text-heading)">Content</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..." 
                rows={6}
                className="w-full bg-white border border-(--color-divider) rounded-lg px-4 py-3 text-(--text-base) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-(--color-primary-500) transition-all resize-y"
              ></textarea>
            </div>

            {/* Image Preview & Upload */}
            <div className="space-y-1.5">
              <label className="text-(--text-sm) font-medium text-(--color-text-heading)">Image Attachment (Optional)</label>
              
              {currentImage && (
                <div className="relative mb-3 rounded-lg overflow-hidden border border-(--color-divider)">
                  <img src={currentImage} alt="Preview" className="w-full h-auto max-h-48 object-cover" />
                  <button 
                    type="button" 
                    onClick={() => { setCurrentImage(null); setSelectedFile(null); }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {!currentImage && (
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-(--color-divider) rounded-lg py-8 flex flex-col items-center justify-center text-(--color-text-muted) hover:text-(--color-primary-500) hover:border-(--color-primary-300) hover:bg-(--color-primary-50) transition-all"
                >
                  <ImagePlus className="w-8 h-8 mb-2 opacity-80" />
                  <span className="font-medium text-(--text-sm)">Click to add an image</span>
                </button>
              )}
              
              <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="bg-(--color-surface) border-t border-(--color-divider) p-4 flex justify-end gap-3 z-20">
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-full text-(--color-text-body) font-medium hover:bg-(--color-divider)/50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="updatePostForm"
            disabled={loading || !title.trim() || !content.trim()}
            className="bg-(--color-primary-500) hover:bg-(--color-primary-700) text-white px-8 py-2.5 rounded-full font-medium shadow-[var(--shadow-btn)] hover:shadow-[var(--shadow-btn-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdatePostModal;
