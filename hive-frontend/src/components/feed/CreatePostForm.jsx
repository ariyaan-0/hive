import { ImagePlus, Send } from 'lucide-react';
import { useState, useRef } from 'react';
import { api } from '../../utils/api';

const CreatePostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-(--color-card-bg) border border-(--color-divider) rounded-xl shadow-[var(--shadow-card)] p-5 sticky top-24">
      <h2 className="font-heading font-medium text-(--text-lg) text-(--color-text-heading) mb-4 border-b border-(--color-divider) pb-2">
        Create a Post
      </h2>
      
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title Input */}
        <div>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title..." 
            className="w-full bg-white border border-(--color-divider) rounded-lg px-4 py-2.5 text-(--text-base) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-(--color-primary-500) transition-all placeholder:text-(--color-text-placeholder)"
          />
        </div>

        {/* Content Input */}
        <div>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..." 
            rows={4}
            className="w-full bg-white border border-(--color-divider) rounded-lg px-4 py-2.5 text-(--text-base) focus:outline-none focus:ring-[3px] focus:ring-(--color-primary-500)/15 focus:border-(--color-primary-500) transition-all resize-none placeholder:text-(--color-text-placeholder)"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-2">
          {/* Image Upload Button */}
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-(--color-text-muted) hover:text-(--color-primary-500) transition-colors p-2 -ml-2 rounded-lg hover:bg-(--color-primary-50)"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-(--text-sm) font-medium">
              {selectedFile ? 'Image Selected' : 'Add Image'}
            </span>
          </button>
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
            className="flex items-center gap-2 bg-(--color-primary-500) hover:bg-(--color-primary-700) disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-medium shadow-[var(--shadow-btn)] hover:shadow-[var(--shadow-btn-hover)] transition-all"
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
