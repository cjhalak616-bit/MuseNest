
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Bookmark,
  Eye,
  ArrowLeft,
  Send
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import { getUser } from '../data';
import { getToken, apiRequest } from '../services/api';

export default function ArticleDetails() {
  const { id } = useParams();
  const user = getUser();

  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await apiRequest(`/articles/${id}`);
        const currentArticle = result.article;

        setArticle(currentArticle);

        const articleResult = await apiRequest('/articles');
        setArticles(articleResult.articles || []);

        const commentResult = await apiRequest(`/comments/${id}`);
        setComments(commentResult.comments || []);

        if (getToken()) {
          const bookmarkResult = await apiRequest('/bookmarks');

          const bookmarkList = bookmarkResult.bookmarks || [];

          setSaved(
            bookmarkList.some(
              (item) => (item._id || item.id) === id
            )
          );
        } else {
          setSaved(false);
        }
      } catch (err) {
        setError(err.message || 'Unable to load this story.');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return 'Recently published';

    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const toggle = async () => {
    if (!getToken()) {
      setError('Please sign in to bookmark this story.');
      return;
    }

    try {
      if (saved) {
        await apiRequest(`/bookmarks/${id}`, {
          method: 'DELETE'
        });
        setSaved(false);
      } else {
        await apiRequest(`/bookmarks/${id}`, {
          method: 'POST'
        });
        setSaved(true);
      }
    } catch (err) {
      setError(err.message || 'Unable to update bookmark.');
    }
  };

  const post = async () => {
    if (!comment.trim()) return;

    if (!getToken()) {
      setCommentError('Please sign in to post a comment.');
      return;
    }

    try {
      setPosting(true);
      setCommentError('');

      const result = await apiRequest(`/comments/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          content: comment.trim()
        })
      });

      if (result.comment) {
        setComments((previous) => [...previous, result.comment]);
      } else {
        const updated = await apiRequest(`/comments/${id}`);
        setComments(updated.comments || []);
      }

      setComment('');
    } catch (err) {
      setCommentError(err.message || 'Unable to post comment.');
    } finally {
      setPosting(false);
    }
  };

  const authorName =
    article?.author?.name || 'MuseNest Writer';

  const articleDate = formatDate(article?.createdAt);

  const paragraphs =
    typeof article?.content === 'string'
      ? article.content.split(/\n+/).filter(Boolean)
      : [];

  const relatedArticles = articles
    .filter((item) => item._id !== id)
    .slice(0, 3)
    .map((item) => ({
      ...item,
      id: item._id,
      image: item.coverImage,
      author: item.author?.name || 'MuseNest Writer',
      date: formatDate(item.createdAt)
    }));

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="article-page page-container">
          <p className="muted">Loading story...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error && !article) {
    return (
      <>
        <Navbar />
        <main className="article-page page-container">
          <p className="form-error">{error}</p>
          <Link className="back-link" to="/">
            <ArrowLeft size={16} /> Back to stories
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (!article) return null;

  return (
    <>
      <Navbar />

      <main className="article-page page-container">
        <Link className="back-link" to="/">
          <ArrowLeft size={16} /> Back to stories
        </Link>

        <img
          className="article-cover"
          src={article.coverImage}
          alt={article.title}
        />

        <div className="article-layout">
          <article className="article-content">
            <p className="eyebrow">
              {article.category} · {articleDate}
            </p>

            <h1>{article.title}</h1>

            <p className="article-subtitle">
              {article.excerpt}
            </p>

            <div className="article-byline">
              <span className="mini-avatar">
                {authorName.charAt(0).toUpperCase()}
              </span>

              <b>{authorName}</b>
              <span>·</span>
              <span>{articleDate}</span>

              <span>
                <Eye size={15} />{' '}
                {(article.views || 0).toLocaleString()} views
              </span>

              <button
                className={
                  saved
                    ? 'bookmark-button saved'
                    : 'bookmark-button'
                }
                onClick={toggle}
              >
                <Bookmark
                  size={16}
                  fill={saved ? 'currentColor' : 'none'}
                />
                {saved ? 'Saved' : 'Bookmark'}
              </button>
            </div>

            {error && <p className="form-error">{error}</p>}

            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <div className="comment-panel">
              <h3>Comments</h3>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
              />

              {commentError && (
                <p className="form-error">{commentError}</p>
              )}

              <button
                className="btn-primary"
                onClick={post}
                disabled={posting}
              >
                {posting ? 'Posting...' : 'Post Comment'}
                <Send size={14} />
              </button>

              {comments.map((item, index) => (
                <div
                  className="comment-item"
                  key={item._id || index}
                >
                  <b>
                    {item.user?.name || 'Reader'}
                  </b>
                  <p>{item.content}</p>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="muted">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </article>

          <aside className="related-panel">
            <h3>Related Stories</h3>

            {relatedArticles.map((item) => (
              <ArticleCard
                key={item.id}
                article={item}
              />
            ))}
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
