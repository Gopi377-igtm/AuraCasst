import React, { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await onAuthSuccess('login', { email, password });
      } else {
        await onAuthSuccess('register', { name, email, password });
      }
      onClose();
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = (e) => {
    if (e) e.preventDefault();
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="space-auth-modal relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          title="Close"
          className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all border border-white/20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Shooting Stars Cosmic Background Layer */}
        <section className="space-bg-stars" aria-hidden="true">
          <span className="space-star" />
          <span className="space-star" />
          <span className="space-star" />
          <span className="space-star" />
        </section>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="relative z-10">
          {/* Header Title with Flickering Neon & Outlined Subtitle */}
          <div className="space-auth-title">
            <span>{isLogin ? 'sign in to your' : 'create your'}</span>
          </div>
          <div className="space-auth-subhead">
            <span>AURACAST</span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name field in Registration mode */}
          {!isLogin && (
            <div className="space-input-container">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="input-name"
                required={!isLogin}
              />
            </div>
          )}

          {/* Email input */}
          <div className="space-input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-mail"
              required
            />
          </div>

          {/* Password input */}
          <div className="space-input-container">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-pwd"
              required
            />
          </div>

          {/* Submit button with Light Sweep Shimmer animation */}
          <button
            type="submit"
            disabled={isLoading}
            className="space-submit-btn"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="sign-text">Authenticating...</span>
              </>
            ) : (
              <span className="sign-text">{isLogin ? 'Sign in' : 'Create Account'}</span>
            )}
          </button>

          {/* Signup / Sign in Toggle Link */}
          <p className="space-signup-link">
            {isLogin ? 'No account?' : 'Already registered?'}
            <button
              type="button"
              onClick={handleToggleMode}
              className="up"
            >
              {isLogin ? 'Sign up!' : 'Sign in!'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
