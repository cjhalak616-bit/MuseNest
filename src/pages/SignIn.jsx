
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import Brand from '../components/Brand';
import { saveUser } from '../data';
import { apiRequest, saveToken } from '../services/api';

const authArt = 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=900&auto=format&fit=crop&q=85';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const authArt = 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=900&auto=format&fit=crop&q=85';

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      saveToken(data.token);
      saveUser(data.user);

      nav('/dashboard');
    } catch (err) {
      setError(err.message || 'Email or password is incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-art">
        <Brand light />
        <div className="auth-art-copy">
          <h2>Welcome Back!</h2>
          <p>Sign in to continue your creative journey with us.</p>
        </div>
        <img src={authArt} alt="Books and a quiet reading corner" />
      </section>

      <section className="auth-form-wrap">
        <div className="auth-form">
          <p className="eyebrow">WELCOME HOME</p>
          <h1>Sign In</h1>
          <p className="muted">Access your account</p>

          <form onSubmit={submit}>
            <label>Email Address</label>
            <div className="field">
              <Mail />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <label>Password</label>
            <div className="field">
              <LockKeyhole />
              <input
                required
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShow(!show)}>
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="auth-options">
              <label className="check-label">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#forgot">Forgot password?</a>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button className="btn-primary full-width" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            Don’t have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
