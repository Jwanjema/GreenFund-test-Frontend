import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { formatDistanceToNow } from 'date-fns'; // For relative time

function ForumListPage() {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for create modal

  const fetchThreads = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch using the correct API endpoint, which includes /api implicitly via apiClient
      const response = await apiClient.get('/forum/threads');
      setThreads(response.data);
    } catch (err) {
      console.error("Failed to fetch forum threads:", err);
      setError('Could not load forum threads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const handleThreadCreated = (newThread) => {
    // Add the new thread to the top of the list
    setThreads(prev => [newThread, ...prev]);
    setIsCreateModalOpen(false); // Close modal after creation
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-text-primary">Community Forum</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-white py-2 px-4 rounded hover:bg-green-700 transition flex items-center gap-2"
        >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg> Start Discussion
        </button>
      </div>

      {isLoading && <p className="text-text-secondary text-center py-5">Loading discussions...</p>}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded text-center">{error}</p>}

      {!isLoading && !error && (
        <div className="space-y-4">
          {threads.length > 0 ? threads.map(thread => (
            // Link to the specific thread page under /app
            <Link to={`/app/forum/threads/${thread.id}`} key={thread.id} className="block bg-surface p-4 rounded-lg shadow hover:shadow-md transition group">
              <h2 className="text-xl font-semibold text-primary group-hover:underline mb-1">{thread.title}</h2>
              <p className="text-sm text-text-secondary truncate">{thread.content}</p> {/* Show snippet */}
              <div className="text-xs text-gray-500 mt-2">
                Started by {thread.owner?.full_name || 'User'} • {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
              </div>
            </Link>
          )) : (
            <div className="text-center py-10 bg-surface rounded-lg shadow">
                <p className="text-text-secondary mb-4">No discussions started yet.</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-primary text-white py-2 px-4 rounded hover:bg-green-700 transition"
                >
                  Be the first to start one!
                </button>
            </div>
          )}
        </div>
      )}

      {/* Modal for Creating New Thread */}
      {/* Ensure CreateThreadModal component is defined or imported */}
      {isCreateModalOpen && (
        <CreateThreadModal
          onClose={() => setIsCreateModalOpen(false)}
          onThreadCreated={handleThreadCreated}
        />
      )}
    </div>
  );
}

// --- CreateThreadModal Component (keep here or move to components folder) ---
function CreateThreadModal({ onClose, onThreadCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    if (title.length < 3 || title.length > 150) {
        setError('Title must be between 3 and 150 characters.');
        return;
    }
     if (content.length < 10) {
        setError('Content must be at least 10 characters.');
        return;
    }

    setIsSubmitting(true);
    try {
      // Use correct API endpoint, includes /api implicitly
      const response = await apiClient.post('/forum/threads', { title, content });
      onThreadCreated(response.data); // Pass the created thread back
    } catch (err) {
      console.error("Failed to create thread:", err);
      setError(err.response?.data?.detail || 'Could not start discussion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     // Using a portal might be better for modals, but basic div is fine for now
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl m-4"> {/* Added margin */}
        <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold text-gray-800">Start a New Discussion</h2>
             <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        {error && <p className="text-red-600 bg-red-100 p-3 rounded mb-4 text-sm border border-red-300">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="threadTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="threadTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              maxLength="150"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="threadContent" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
            <textarea
              id="threadContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              required
              disabled={isSubmitting}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Minimum 10 characters.</p>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="py-2 px-4 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()} className="py-2 px-4 rounded bg-primary text-white hover:bg-green-700 transition disabled:opacity-50 text-sm">
              {isSubmitting ? 'Starting...' : 'Start Discussion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default ForumListPage;