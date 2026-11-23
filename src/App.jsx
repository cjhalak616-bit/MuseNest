
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home.jsx';
import ArticleDetails from './pages/ArticleDetails.jsx';
import SignIn from './pages/SignIn.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ManageArticles from './pages/ManageArticles.jsx';
import CreateArticle from './pages/CreateArticle.jsx';
import Profile from './pages/Profile.jsx';

import { getUser } from './data';
import { getToken } from './services/api';

function Protected({ children, roles }) {
  const user = getUser();
  const token = getToken();

  if (!user || !token) {
    return <Navigate to="/signin" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function DashboardRouter() {
  const user = getUser();
  const token = getToken();

  if (!user || !token) {
    return <Navigate to="/signin" replace />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/article/:id" element={<ArticleDetails />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<DashboardRouter />} />

        <Route
          path="/articles"
          element={
            <Protected roles={['admin', 'author']}>
              <ManageArticles />
            </Protected>
          }
        />

        <Route
          path="/create"
          element={
            <Protected roles={['admin', 'author']}>
              <CreateArticle />
            </Protected>
          }
        />

        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
