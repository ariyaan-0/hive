import { ImagePlus, Send, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { api } from '../../utils/api';
import { validateFileSize } from '../../utils/fileValidation';

const CreatePostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('published', true);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      
      await api.post('/posts/', formData, true);
      
      // Reset form
      setTitle('');
      setContent('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeError = validateFileSize(file);
      if (sizeError) {
        setError(sizeError);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setError('');
      setSelectedFile(file);
    }
  };

  return (
    <div className="bg-card-bg border border-divider rounded-xl shadow-[var(--shadow-card)] p-5 sticky top-24">
      <h2 className="font-heading font-medium text-(--text-lg) text-text-heading mb-4 border-b border-divider pb-2">
        Create a Post
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg text-sm font-medium animate-fade-in">
          {error}
        </div>
      )}
      
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title Input */}
        <div>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title..." 
            className="w-full bg-card-bg border border-divider rounded-lg px-4 py-2.5 text-(--text-base) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-primary-500 transition-all placeholder:text-text-placeholder"
          />
        </div>

        {/* Content Input */}
        <div>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..." 
            rows={4}
            className="w-full bg-card-bg border border-divider rounded-lg px-4 py-2.5 text-(--text-base) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-primary-500 transition-all resize-none placeholder:text-text-placeholder"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-2">
          {/* Image Upload Button */}
          {selectedFile ? (
            <div className="flex items-center gap-1.5 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-(--text-sm) font-medium">
              <ImagePlus className="w-4 h-4" />
              <span className="max-w-[140px] truncate">{selectedFile.name}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setError('');
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-primary-300/30 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-text-muted hover:text-primary-500 transition-colors p-2 -ml-2 rounded-lg hover:bg-primary-50"
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-(--text-sm) font-medium">Add Image</span>
            </button>
          )}
          <input 
            type="file" 
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading || !title.trim() || !content.trim()}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-primary-text px-6 py-2 rounded-full font-medium shadow-[var(--shadow-btn)] hover:shadow-[var(--shadow-btn-hover)] transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
