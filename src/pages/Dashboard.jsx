import { useEffect, useState } from 'react';
import {
  FileText,
  Eye,
  MessageCircle,
  Plus,
  ArrowUpRight,
  Bookmark
} from 'lucide-react';
import { Link } from 'react-router-dom';

import DashboardLayout from '../components/DashboardLayout';
import { getUser } from '../data';
import { apiRequest } from '../services/api';

export default function Dashboard() {
  const user = getUser() || { name: 'Reader', role: 'user' };

  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const articleResult = await apiRequest('/articles');
        setArticles(articleResult.articles || []);

        if (user.role === 'admin' || user.role === 'author') {
          const statsResult = await apiRequest('/dashboard/stats');
          setStats(statsResult.stats || statsResult);
        }

        if (user.role === 'user') {
          const bookmarkResult = await apiRequest('/bookmarks');
          setBookmarks(bookmarkResult.bookmarks || []);
        }
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user.role]);

  const getArticleId = (article) => article._id || article.id;

  const getArticleImage = (article) => {
    return article.coverImage || article.image || '';
  };

  const getArticleDate = (article) => {
    const date = article.createdAt || article.date;

    if (!date) return 'Recently published';

    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getAuthorName = (article) => {
    return article.author?.name || article.author || 'MuseNest Writer';
  };

  const visibleArticles =
    user.role === 'author'
      ? articles.filter(
          (article) =>
            article.author?._id === user._id ||
            article.author?._id === user.id ||
            article.author === user._id ||
            article.author === user.id ||
            getAuthorName(article) === user.name
        )
      : articles;

  // User dashboard par bookmarks ke bajaye articles explore honge.
  const displayArticles = visibleArticles.slice(0, 4);

  const totalArticles = stats.totalArticles ?? stats.total ?? 0;
  const publishedArticles = stats.publishedArticles ?? stats.published ?? 0;
  const draftArticles = stats.draftArticles ?? stats.drafts ?? 0;
  const totalViews = stats.totalViews ?? stats.views ?? 0;
  const totalComments = stats.totalComments ?? stats.comments ?? 0;

  const dashboardStats =
    user.role === 'admin'
      ? [
          [totalArticles, 'Total Articles', FileText, 'lilac'],
          [totalViews, 'Total Views', Eye, 'pink'],
          [publishedArticles, 'Published', FileText, 'mint'],
          [totalComments, 'Comments', MessageCircle, 'peach']
        ]
      : user.role === 'author'
      ? [
          [totalArticles, 'My Articles', FileText, 'lilac'],
          [totalViews, 'Total Views', Eye, 'pink'],
          [publishedArticles, 'Published', FileText, 'mint'],
          [draftArticles, 'Drafts', FileText, 'peach']
        ]
      : [
          [bookmarks.length, 'Bookmarked', Bookmark, 'lilac'],
          [0, 'Read Articles', FileText, 'pink'],
          [0, 'Comments', MessageCircle, 'peach']
        ];

  return (
    <DashboardLayout>
      <div className="dash-heading">
        <div>
          <p className="eyebrow">{user.role.toUpperCase()} WORKSPACE</p>

          <h1>
            {user.role === 'admin'
              ? 'Admin Dashboard'
              : user.role === 'author'
              ? 'Author Dashboard'
              : 'User Dashboard'}
          </h1>

          <p>
            Welcome back, {user.name}! Here’s what’s happening today.
          </p>
        </div>

        {user.role === 'admin' || user.role === 'author' ? (
          <Link className="btn-primary" to="/create">
            <Plus size={16} /> Add Article
          </Link>
        ) : (
          <Link className="btn-primary" to="/articles">
            Explore Articles <ArrowUpRight size={16} />
          </Link>
        )}
      </div>

      {loading ? (
        <p className="muted">Loading your dashboard...</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : (
        <>
          <div className="stats-grid">
            {dashboardStats.map(([value, label, Icon, color]) => (
              <div className={`stat-card ${color}`} key={label}>
                <span>
                  <Icon size={19} />
                </span>
                <strong>{value}</strong>
                <small>{label}</small>
              </div>
            ))}
          </div>

          <div className="dash-content-grid">
            <section className="dash-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">FRESH FROM THE NEST</p>
                  <h2>
                    {user.role === 'user'
                      ? 'Explore Articles'
                      : 'Recent Articles'}
                  </h2>
                </div>

                <Link to="/articles">
                  View all <ArrowUpRight size={15} />
                </Link>
              </div>

              <div className="dash-article-list">
                {displayArticles.length > 0 ? (
                  displayArticles.map((article) => (
                    <div
                      className="dash-article"
                      key={getArticleId(article)}
                    >
                      {getArticleImage(article) && (
                        <img
                          src={getArticleImage(article)}
                          alt={article.title}
                        />
                      )}

                      <div>
                        <b>{article.title}</b>
                        <small>
                          {getArticleDate(article)} · {getAuthorName(article)}
                        </small>
                      </div>

                      <Link to={`/article/${getArticleId(article)}`}>
                        View
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="muted">
                    No published articles available yet.
                  </p>
                )}
              </div>
            </section>

            <aside className="dash-art-card">
              <div>
                <p className="eyebrow">A NOTE TO YOURSELF</p>
                <h2>
                  Keep
                  <br />
                  Exploring.
                </h2>
                <p>Every idea can become a beautiful story.</p>
              </div>

              <div className="dash-flower">✿</div>
            </aside>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}