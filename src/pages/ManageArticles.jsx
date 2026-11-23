
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';

import DashboardLayout from '../components/DashboardLayout';
import { getUser } from '../data';
import { apiRequest } from '../services/api';

export default function ManageArticles() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const user = getUser();

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await apiRequest('/articles/manage');
        setItems(data.articles || []);
      } catch (err) {
        setError(err.message || 'Unable to load articles.');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const remove = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this article?'
    );

    if (!confirmDelete) return;

    try {
      setDeleting(id);

      await apiRequest(`/articles/${id}`, {
        method: 'DELETE'
      });

      setItems((previous) =>
        previous.filter((article) => article._id !== id)
      );
    } catch (err) {
      setError(err.message || 'Unable to delete article.');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Recently added';

    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="dash-heading">
        <div>
          <p className="eyebrow">CONTENT LIBRARY</p>

          <h1>
            {user?.role === 'admin'
              ? 'Manage Articles'
              : 'My Articles'}
          </h1>

          <p>Organise, edit and publish your stories.</p>
        </div>

        <Link className="btn-primary" to="/create">
          <Plus size={16} /> New Article
        </Link>
      </div>

      {error && <p className="form-error">{error}</p>}

      <section className="table-panel">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>STORY</th>
                {user?.role === 'admin' && <th>AUTHOR</th>}
                <th>CATEGORY</th>
                <th>DATE</th>
                <th>VIEWS</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 7 : 6}>
                    Loading articles...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 7 : 6}>
                    No articles found. Create your first story!
                  </td>
                </tr>
              ) : (
                items.map((article) => (
                  <tr key={article._id}>
                    <td>
                      <div className="table-story">
                        {article.coverImage && (
                          <img
                            src={article.coverImage}
                            alt=""
                          />
                        )}
                        <b>{article.title}</b>
                      </div>
                    </td>

                    {user?.role === 'admin' && (
                      <td>{article.author?.name || 'Unknown'}</td>
                    )}

                    <td>{article.category}</td>

                    <td>{formatDate(article.createdAt)}</td>

                    <td>{article.views || 0}</td>

                    <td>
                      {article.status === 'published'
                        ? 'Published'
                        : 'Draft'}
                    </td>

                    <td>
                      <button
                        className="table-icon"
                        onClick={() => remove(article._id)}
                        disabled={deleting === article._id}
                        aria-label="Delete article"
                        title="Delete article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}
