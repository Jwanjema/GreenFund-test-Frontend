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
      const response = await apiClient.get('/forum/threads'); // Use correct API endpoint
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Community Forum</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          + Start New Discussion
        </button>
      </div>

      {isLoading && <p className="text-text-secondary">Loading discussions...</p>}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}

      {!isLoading && !error && (
        <div className="space-y-4">
          {threads.length > 0 ? threads.map(thread => (
            <Link to={`/app/forum/threads/${thread.id}`} key={thread.id} className="block bg-surface p-4 rounded-lg shadow hover:shadow-md transition">
              <h2 className="text-xl font-semibold text-primary mb-1">{thread.title}</h2>
              <p className="text-sm text-text-secondary truncate">{thread.content}</p> {/* Show snippet */}
              <div className="text-xs text-gray-500 mt-2">
                Started by {thread.owner?.full_name || 'User'} • {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
              </div>
            </Link>
          )) : (
            <p className="text-text-secondary text-center py-5">No discussions started yet. Be the first!</p>
          )}
        </div>
      )}

      {/* Modal for Creating New Thread */}
      {isCreateModalOpen && (
        <CreateThreadModal
          onClose={() => setIsCreateModalOpen(false)}
          onThreadCreated={handleThreadCreated}
        />
      )}
    </div>
  );
}

// --- CreateThreadModal Component (can be moved to components folder later) ---
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
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/forum/threads', { title, content });
      onThreadCreated(response.data); // Pass the created thread back
    } catch (err) {
      console.error("Failed to create thread:", err);
      setError('Could not start discussion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Start a New Discussion</h2>
        {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-3 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="threadTitle" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="threadTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              maxLength="150"
              required
            />
          </div>
          <div>
            <label htmlFor="threadContent" className="block text-sm font-medium text-gray-700">Your Message</label>
            <textarea
              id="threadContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="py-2 px-4 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="py-2 px-4 rounded bg-primary text-white hover:bg-green-700 transition disabled:opacity-50">
              {isSubmitting ? 'Starting...' : 'Start Discussion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default ForumListPage;