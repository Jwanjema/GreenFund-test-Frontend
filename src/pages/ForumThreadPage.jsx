import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';
import { formatDistanceToNow } from 'date-fns';

function ForumThreadPage() {
  const { threadId } = useParams(); // Get thread ID from URL
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState('');

  useEffect(() => {
    const fetchThread = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiClient.get(`/forum/threads/${threadId}`); // Use correct API endpoint
        setThread(response.data);
        setPosts(response.data.posts || []); // Set posts from response
      } catch (err) {
        console.error("Failed to fetch thread:", err);
        setError('Could not load discussion. It might not exist.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchThread();
  }, [threadId]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setIsPosting(true);
    setPostError('');
    try {
      const response = await apiClient.post('/forum/posts', {
        thread_id: parseInt(threadId, 10), // Ensure ID is integer
        content: newPostContent
      });
      setPosts(prev => [...prev, response.data]); // Add new post to list
      setNewPostContent(''); // Clear textarea
    } catch (err) {
      console.error("Failed to post reply:", err);
      setPostError('Could not post reply. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };


  if (isLoading) return <p className="text-center mt-8">Loading discussion...</p>;
  if (error) return <p className="text-center mt-8 text-red-500 bg-red-100 p-4 rounded">{error}</p>;
  if (!thread) return <p className="text-center mt-8">Discussion not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/app/forum" className="text-primary hover:underline mb-4 block">&larr; Back to Forum</Link>

      {/* Thread Title and Initial Post */}
      <div className="bg-surface p-5 rounded-lg shadow mb-6 border-l-4 border-primary">
        <h1 className="text-3xl font-bold text-text-primary mb-2">{thread.title}</h1>
        <p className="text-text-secondary whitespace-pre-wrap mb-3">{thread.content}</p>
        <div className="text-xs text-gray-500">
          Started by {thread.owner?.full_name || 'User'} • {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
        </div>
      </div>

      {/* Replies/Posts */}
      <h2 className="text-2xl font-semibold text-text-primary mb-4">Replies ({posts.length})</h2>
      <div className="space-y-4 mb-8">
        {posts.map(post => (
          <div key={post.id} className="bg-surface p-4 rounded-lg shadow">
            <p className="text-text-secondary whitespace-pre-wrap">{post.content}</p>
            <div className="text-xs text-gray-500 mt-2 text-right">
              By {post.owner?.full_name || 'User'} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </div>
          </div>
        ))}
        {posts.length === 0 && !isLoading && (
            <p className="text-text-secondary text-center py-4">No replies yet.</p>
        )}
      </div>

      {/* Post Reply Form */}
      <div className="bg-surface p-5 rounded-lg shadow mt-6">
        <h3 className="text-xl font-semibold text-text-primary mb-3">Post a Reply</h3>
        {postError && <p className="text-red-500 bg-red-100 p-2 rounded mb-3 text-sm">{postError}</p>}
        <form onSubmit={handlePostSubmit}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
            placeholder="Write your reply..."
            required
          ></textarea>
          <div className="text-right mt-3">
            <button
              type="submit"
              disabled={isPosting || !newPostContent.trim()}
              className="py-2 px-5 rounded bg-primary text-white hover:bg-green-700 transition disabled:opacity-50"
            >
              {isPosting ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForumThreadPage;