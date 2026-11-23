
import { Eye, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  const articleId = article._id || article.id;
  const image = article.coverImage || article.image;

  const author =
    typeof article.author === 'object'
      ? article.author?.name
      : article.author;

  const views = Number(article.views || 0);

  const date = article.date ||
    (article.createdAt
      ? new Date(article.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : 'Recently published');

  return (
    <article className="story-card">
      <Link
        to={`/article/${articleId}`}
        className="story-image"
      >
        {image ? (
          <img src={image} alt={article.title} />
        ) : (
          <div className="story-image-placeholder">
            MuseNest
          </div>
        )}

        <span>{article.category}</span>
      </Link>

      <div className="story-card-body">
        <p className="eyebrow">
          {article.category} · {date}
        </p>

        <h3>
          <Link to={`/article/${articleId}`}>
            {article.title}
          </Link>
        </h3>

        <p>{article.excerpt}</p>

        <div className="story-meta">
          <span>{author || 'MuseNest Writer'}</span>

          <span>
            <Eye size={14} /> {views.toLocaleString()}
          </span>

          <Link
            to={`/article/${articleId}`}
            aria-label="Read story"
          >
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}
