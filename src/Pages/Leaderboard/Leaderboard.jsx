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
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-600">See how you rank against other players</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('global')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'global'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Global Rankings
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'personal'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Results
            </button>
          )}
        </div>

        {/* Global Leaderboard */}
        {activeTab === 'global' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select select-bordered w-full max-w-xs"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="loading loading-spinner loading-lg text-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading leaderboard...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No results yet. Be the first to take a quiz!</p>
                <button onClick={() => navigate('/quiz')} className="btn btn-primary mt-4">
                  Take Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition ${
                      user && entry.userEmail === user.email
                        ? 'bg-indigo-50 border-2 border-indigo-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-2xl font-bold min-w-12 text-center">
                        {getMedalEmoji(index)}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 flex items-center gap-2">
                          {entry.userName}
                          {user && entry.userEmail === user.email && (
                            <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">You</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(entry.difficulty)}`}>
                            {entry.difficulty}
                          </span>
                          <span>{entry.category}</span>
                          <span>•</span>
                          <span>{formatDate(entry.completedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">
                        {entry.score}/{entry.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.percentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Quiz History</h2>
            
            {userResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">You haven't taken any quizzes yet</p>
                <button onClick={() => navigate('/quiz')} className="btn btn-primary">
                  Take Your First Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {result.category}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(result.difficulty)}`}>
                          {result.difficulty}
                        </span>
                        <span>{formatDate(result.completedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-indigo-600">
                        {result.score}/{result.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.percentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
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