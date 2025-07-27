import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 text-white font-sans">
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">🎶 My Music Player</h1>
        <div>
          <Link
            to="/login"
            className="bg-white text-indigo-600 px-6 py-2 rounded-full mx-2 hover:bg-indigo-100 transition-all"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-pink-600 px-6 py-2 rounded-full mx-2 hover:bg-pink-100 transition-all"
          >
            Signup
          </Link>
        </div>
      </header>

      <section className="text-center mt-16">
        <h2 className="text-5xl font-bold mb-4">Your Music, Your Memories</h2>
        <p className="text-xl mb-6">Play, Organize & Share Music — with Fun & Gamification</p>
        <button
          onClick={() => navigate('/signup')}
          className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-2xl hover:bg-purple-100 transition"
        >
          Get Started
        </button>
      </section>

      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 px-10">
        <FeatureCard
          title="Powerful Music Controls"
          description="Play, Pause, Shuffle, Repeat & Volume Control at your fingertips."
        />
        <FeatureCard
          title="Smart Music Library"
          description="Manage, Categorize, Filter & Favorite your songs easily."
        />
        <FeatureCard
          title="Gamified Experience"
          description="Earn Badges, Keep Listening Streaks & Unlock Rewards."
        />
        <FeatureCard
          title="Song Stories"
          description="Attach Memories & Create a Diary with your favorite tracks."
        />
        <FeatureCard
          title="Collaborative Playlists"
          description="Invite Friends & Build Playlists Together with Chat."
        />
        <FeatureCard
          title="Download & Share"
          description="Download your tracks or Share them with a simple link."
        />
      </section>

      <footer className="text-center py-10 text-gray-300">
        © 2025 My Music Player | All Rights Reserved
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <div className="bg-white bg-opacity-10 p-5 rounded-2xl shadow-lg hover:scale-105 transition-transform">
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

export default LandingPage;
