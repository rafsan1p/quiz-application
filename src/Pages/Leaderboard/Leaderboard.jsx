import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8080/api/quiz';

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [userResults, setUserResults] = useState([]);
  const [activeTab, setActiveTab] = useState('global');

  // Function declarations - moved before useEffect
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const endpoint = selectedCategory === 'all' 
        ? `${API_URL}/leaderboard`
        : `${API_URL}/leaderboard/category/${selectedCategory}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    }
    setLoading(false);
  };

  const fetchUserResults = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/results/user/${user.email}`);
      const data = await response.json();
      setUserResults(data);
    } catch (error) {
      console.error('Error fetching user results:', error);
    }
  };

  // useEffect hooks - now after function declarations
  useEffect(() => {
    fetchCategories();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (user && activeTab === 'personal') {
      fetchUserResults();
    }
  }, [user, activeTab]);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedCategory]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'difficulty-badge-easy';
      case 'medium': return 'difficulty-badge-medium';
      case 'hard': return 'difficulty-badge-hard';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            🏆 Leaderboard
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            See how you rank against other players and compete for the top spot!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('global')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'global'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'leaderboard-tab-inactive'
            }`}
          >
            Global Rankings
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'personal'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'leaderboard-tab-inactive'
              }`}
            >
              My Results
            </button>
          )}
        </div>

        {/* Global Leaderboard */}
        {activeTab === 'global' && (
          <div className="leaderboard-header bg-white rounded-xl shadow-lg p-6">
            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-filter select select-bordered w-full max-w-xs"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="loading-container text-center py-12 rounded-lg">
                <div className="loading loading-spinner loading-lg text-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading leaderboard...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="empty-state text-center py-12 rounded-lg">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-gray-600 text-lg mb-4">No results yet. Be the first to take a quiz!</p>
                <button onClick={() => navigate('/quiz')} className="btn btn-primary">
                  Take Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`leaderboard-entry flex items-center justify-between p-6 rounded-xl transition-all duration-300 ${
                      user && entry.userEmail === user.email
                        ? 'user-entry'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <span className="rank-medal text-3xl font-bold min-w-16 text-center">
                        {getMedalEmoji(index)}
                      </span>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-800 flex items-center gap-3 mb-2">
                          {entry.userName}
                          {user && entry.userEmail === user.email && (
                            <span className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full font-semibold">You</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`difficulty-badge-${entry.difficulty.toLowerCase()} px-3 py-1 rounded-full text-xs font-semibold`}>
                            {entry.difficulty}
                          </span>
                          <span className="text-sm text-gray-600 font-medium">{entry.category}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="time-display text-xs">{formatDate(entry.completedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="score-display text-right">
                      <div className="text-3xl font-bold text-indigo-600 mb-1">
                        {entry.score}/{entry.totalQuestions}
                      </div>
                      <div className="percentage-display text-sm mb-1">
                        {entry.percentage.toFixed(1)}%
                      </div>
                      <div className="time-display text-xs">
                        ⏱️ {formatTime(entry.timeTaken)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Personal Results */}
        {activeTab === 'personal' && user && (
          <div className="leaderboard-header bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Quiz History</h2>
            
            {userResults.length === 0 ? (
              <div className="empty-state text-center py-12 rounded-lg">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-600 text-lg mb-4">You haven't taken any quizzes yet</p>
                <button onClick={() => navigate('/quiz')} className="btn btn-primary">
                  Take Your First Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userResults.map((result) => (
                  <div
                    key={result.id}
                    className="leaderboard-entry flex items-center justify-between p-6 rounded-xl transition-all duration-300"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-800 mb-2">
                        {result.category}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`difficulty-badge-${result.difficulty.toLowerCase()} px-3 py-1 rounded-full text-xs font-semibold`}>
                          {result.difficulty}
                        </span>
                        <span className="time-display text-xs">{formatDate(result.completedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="score-display text-right">
                      <div className="text-2xl font-bold text-indigo-600 mb-1">
                        {result.score}/{result.totalQuestions}
                      </div>
                      <div className="percentage-display text-sm mb-1">
                        {result.percentage.toFixed(1)}%
                      </div>
                      <div className="time-display text-xs">
                        ⏱️ {formatTime(result.timeTaken)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/quiz')}
            className="btn btn-primary btn-lg"
          >
            Take a Quiz Now 🎯
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;