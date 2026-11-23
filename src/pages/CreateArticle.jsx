
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../services/api';

export default function CreateArticle() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    title: '',
    category: 'Life',
    excerpt: '',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&auto=format&fit=crop&q=85',

    body: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e, status) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await apiRequest('/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          excerpt: form.excerpt,
          coverImage: form.image,
          content: form.body,
          status,
          readTime: Math.max(
            1,
            Math.ceil(form.body.trim().split(/\s+/).length / 200)
          )
        })
      });

      nav('/articles');
    } catch (err) {
      setError(err.message || 'Unable to save your story.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="dash-heading">
        <div>
          <p className="eyebrow">MAKE SOMETHING BEAUTIFUL</p>
          <h1>Create a Story</h1>
          <p>Your next idea deserves a place to grow.</p>
        </div>
      </div>

      <form
        className="editor-panel"
        onSubmit={(e) => submit(e, 'published')}
      >
        <label>Story Title</label>
        <input
          name="title"
          required
          value={form.title}
          onChange={change}
          placeholder="Give your story a lovely title"
        />

        <label>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={change}
        >
          {[
            'Life',
            'Travel',
            'Technology',
            'Wellness',
            'Creativity'
          ].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <label>Short Description</label>
        <textarea
          name="excerpt"
          required
          value={form.excerpt}
          onChange={change}
          rows="2"
          placeholder="What is your story about?"
        />

        <label>Cover Image URL</label>
        <input
          name="image"
          type="url"
          value={form.image}
          onChange={change}
          placeholder="Enter an image URL"
        />

        <label>Story Content</label>
        <textarea
          name="body"
          required
          value={form.body}
          onChange={change}
          rows="9"
          placeholder="Write your story here. Separate paragraphs with a new line."
        />

        {error && (
          <p className="form-error">{error}</p>
        )}

        <div className="create-actions">
          <button
            className="btn-soft"
            type="button"
            disabled={loading}
            onClick={(e) => submit(e, 'draft')}
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Story'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
