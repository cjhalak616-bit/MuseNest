
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Search,
  PenLine,
  UsersRound,
  Compass
} from 'lucide-react';

import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import { categories } from '../data';
import { apiRequest } from '../services/api';
import heroArt from '../assets/home-hero.png';

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await apiRequest('/articles');

        const formattedArticles = (data.articles || []).map((article) => ({
          ...article,
          id: article._id,
          image: article.coverImage,
          author: article.author?.name || 'MuseNest Writer',
          date: article.createdAt
            ? new Date(article.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })
            : 'Recently published'
        }));

        setArticles(formattedArticles);
      } catch (err) {
        setError(err.message || 'Unable to load stories.');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filtered = useMemo(() => {
    return articles.filter(
      (article) =>
        (category === 'All' || article.category === category) &&
        `${article.title} ${article.excerpt}`
          .toLowerCase()
          .includes(query.toLowerCase())
    );
  }, [articles, category, query]);

  return (
    <>
      <Navbar />

      <main>
        <section className="hero-wrap">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={15} /> A CREATIVE SPACE FOR CURIOUS MINDS
            </div>

            <h1>
              Stories begin
              <br />
              with an <em>idea.</em>
            </h1>

            <p>
              A little inspiration can take you a long way. Discover thoughtful
              stories, explore new perspectives and share the ideas that matter
              to you.
            </p>

            <div className="hero-buttons">
              <a className="btn-primary" href="#discover">
                Explore Stories <ArrowRight size={16} />
              </a>

              <Link className="text-link" to="/register">
                Start Writing
              </Link>
            </div>

            <div className="hero-note">
              ✧ Read. Imagine. Create. Repeat.
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit"></div>
            <img src={heroArt} alt="A cozy stack of books" />

            <div className="floating-note note-one">
              Think freely ✨
            </div>

            <div className="floating-note note-two">
              Your next idea awaits.
            </div>
          </div>
        </section>

        <section className="about-strip" id="about">
          <p className="eyebrow">A LITTLE ABOUT US</p>
          <h2>A home for every idea.</h2>

          <p>
            MuseNest is a space where creativity meets curiosity. Read stories,
            discover different viewpoints and give your own thoughts a place to
            grow.
          </p>

          <div className="value-grid">
            <div>
              <span><Compass /></span>
              <b>Discover</b>
              <small>Find fresh perspectives.</small>
            </div>

            <div>
              <span><PenLine /></span>
              <b>Create</b>
              <small>Share what inspires you.</small>
            </div>

            <div>
              <span><UsersRound /></span>
              <b>Connect</b>
              <small>Grow through stories.</small>
            </div>
          </div>
        </section>

        <section
          className="discover-section page-container"
          id="discover"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">EDITOR'S PICK</p>
              <h2>Stories to get lost in.</h2>
              <p>
                Little thoughts. Big inspiration. Something for every curious
                mind.
              </p>
            </div>

            <div className="search-box">
              <Search size={17} />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stories, topics or ideas..."
              />
            </div>
          </div>

          <div className="category-row">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={
                  category === c
                    ? 'category-pill selected'
                    : 'category-pill'
                }
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="muted">Loading inspiring stories...</p>
          ) : error ? (
            <p className="form-error">{error}</p>
          ) : (
            <>
              <div className="story-grid">
                {filtered.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="empty-state">
                  No stories found. Try another search.
                </p>
              )}
            </>
          )}
        </section>

        <section className="join-banner">
          <div>
            <p className="eyebrow">YOUR STORY MATTERS</p>
            <h2>Have an idea? Give it a home.</h2>

            <p>
              Join the MuseNest community and turn your thoughts into stories
              worth sharing.
            </p>

            <Link className="btn-primary" to="/register">
              Join the Community <ArrowRight size={15} />
            </Link>
          </div>

          <div className="join-decoration">✿</div>
        </section>
      </main>

      <Footer />
    </>
  );
}
