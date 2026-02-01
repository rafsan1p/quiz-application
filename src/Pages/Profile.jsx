import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8080/api/quiz';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    favoriteCategory: 'N/A'
  });

  // Function declarations - moved before useEffect
  const fetchUserResults = async () => {
    try {
      const response = await fetch(`${API_URL}/results/user/${user.email}`);
      const data = await response.json();
      setUserResults(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching user results:', error);
      toast.error('Failed to load profile data');
    }
    setLoading(false);
  };

  const calculateStats = (results) => {
    if (results.length === 0) {
      setStats({
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        favoriteCategory: 'N/A'
      });
      return;
    }

    const totalQuizzes = results.length;
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const averageScore = Math.round((totalScore / totalQuizzes) * 10) / 10;
    const bestScore = Math.max(...results.map(result => result.score));
    
    // Find favorite category
    const categoryCount = {};
    results.forEach(result => {
      categoryCount[result.category] = (categoryCount[result.category] || 0) + 1;
    });
    const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b, 'N/A');

    setStats({
      totalQuizzes,
      averageScore,
      bestScore,
      favoriteCategory
    });
  };

  // useEffect hooks - now after function declarations
  useEffect(() => {
    if (!user) {
      toast.error('Please login to view profile');
      navigate('/login');
      return;
    }
    fetchUserResults();
  }, [user, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score, totalQuestions = 5) => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return 'text-green-600';  // 4/5 or better
    if (percentage >= 60) return 'text-yellow-600'; // 3/5 or better
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" />
                ) : (
                  <div className="bg-primary text-primary-content flex items-center justify-center text-2xl font-bold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {user.displayName || 'Quiz Enthusiast'}
              </h1>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <div className="badge badge-primary">
                {user.emailVerified ? 'Verified Account' : 'Unverified'}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{stats.totalQuizzes}</div>
            <div className="text-gray-600">Total Quizzes</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.averageScore}</div>
            <div className="text-gray-600">Average Score</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.bestScore}</div>
            <div className="text-gray-600">Best Score</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-lg font-bold text-purple-600 mb-2">{stats.favoriteCategory}</div>
            <div className="text-gray-600">Favorite Category</div>
          </div>
        </div>

        {/* Quiz History */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz History</h2>
          
          {userResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No quizzes taken yet</h3>
              <p className="text-gray-500 mb-6">Start your quiz journey today!</p>
              <button 
                onClick={() => navigate('/quiz')}
                className="btn btn-primary"
              >
                Take Your First Quiz
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Score</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {userResults.map((result, index) => (
                    <tr key={index}>
                      <td>{formatDate(result.completedAt)}</td>
                      <td>
                        <span className="badge badge-outline">{result.category}</span>
                      </td>
                      <td>
                        <span className={`badge ${
                          result.difficulty === 'Easy' ? 'badge-success' :
                          result.difficulty === 'Medium' ? 'badge-warning' : 'badge-error'
                        }`}>
                          {result.difficulty}
                        </span>
                      </td>
                      <td>
                        <span className={`font-bold ${getScoreColor(result.score, result.totalQuestions || 5)}`}>
                          {result.score}/{result.totalQuestions || 5}
                        </span>
                      </td>
                      <td>{Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pb-8">
          <button 
            onClick={() => navigate('/quiz')}
            className="btn btn-primary btn-lg"
          >
            🎯 Take New Quiz
          </button>
          <button 
            onClick={() => navigate('/leaderboard')}
            className="btn btn-outline btn-lg"
          >
            🏆 View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;