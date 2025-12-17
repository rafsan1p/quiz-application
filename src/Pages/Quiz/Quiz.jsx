import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8080/api/quiz';

const Quiz = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState('select');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to take quiz');
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  useEffect(() => {
    let interval;
    if (currentPage === 'quiz' && startTime) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentPage, startTime]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const startQuiz = async () => {
    if (!selectedCategory || !selectedDifficulty) {
      toast.error('Please select category and difficulty');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/questions/category/${selectedCategory}/difficulty/${selectedDifficulty}`
      );
      const data = await response.json();
      
      if (data.length === 0) {
        toast.error('No questions available for this selection');
        setLoading(false);
        return;
      }
      
      const quizQuestions = data.slice(0, 10);
      setQuestions(quizQuestions);
      setUserAnswers(new Array(quizQuestions.length).fill(-1));
      setCurrentQuestion(0);
      setStartTime(Date.now());
      setTimeElapsed(0);
      setCurrentPage('quiz');
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error('Failed to load questions');
    }
    setLoading(false);
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const submitQuiz = async () => {
    const unanswered = userAnswers.filter(ans => ans === -1).length;
    if (unanswered > 0) {
      const confirm = window.confirm(`You have ${unanswered} unanswered questions. Submit anyway?`);
      if (!confirm) return;
    }

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user.displayName || 'Anonymous',
          userEmail: user.email,
          category: selectedCategory,
          difficulty: selectedDifficulty,
          userAnswers,
          questionIds: questions.map(q => q.id),
          timeTaken
        })
      });
      
      const data = await response.json();
      setResult(data);
      setCurrentPage('result');
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    }
    setLoading(false);
  };

  const resetQuiz = () => {
    setCurrentPage('select');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setQuestions([]);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setResult(null);
    setTimeElapsed(0);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to take the quiz</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            🎯 QuizHero
          </h1>
          <p className="text-gray-600">Test your knowledge</p>
        </div>

        {/* Selection Page */}
        {currentPage === 'select' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Start New Quiz</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Choose a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Difficulty
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['Easy', 'Medium', 'Hard'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`py-3 px-4 rounded-lg border-2 font-semibold transition ${
                        selectedDifficulty === diff
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startQuiz}
                disabled={loading}
                className="w-full btn btn-primary btn-lg"
              >
                {loading ? 'Loading...' : 'Start Quiz'}
              </button>
            </div>
          </div>
        )}

        {/* Quiz Page */}
        {currentPage === 'quiz' && questions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Question {currentQuestion + 1} / {questions.length}
                  </span>
                  <span className="ml-4 text-sm font-medium text-indigo-600">
                    ⏱️ {formatTime(timeElapsed)}
                  </span>
                </div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium">
                  {selectedDifficulty}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {questions[currentQuestion].questionText}
            </h3>

            <div className="space-y-3 mb-6">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    userAnswers[currentQuestion] === index
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <span className="font-medium text-gray-700">
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="btn btn-outline disabled:opacity-50"
              >
                ← Previous
              </button>
              {currentQuestion < questions.length - 1 ? (
                <button onClick={nextQuestion} className="btn btn-primary">
                  Next →
                </button>
              ) : (
                <button onClick={submitQuiz} disabled={loading} className="btn btn-success">
                  {loading ? 'Submitting...' : 'Submit Quiz 🎯'}
                </button>
              )}
            </div>

            {/* Question Navigator */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-3">Quick Navigation:</p>
              <div className="grid grid-cols-10 gap-2">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition ${
                      idx === currentQuestion
                        ? 'bg-indigo-600 text-white'
                        : userAnswers[idx] !== -1
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result Page */}
        {currentPage === 'result' && result && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">
                {result.percentage >= 70 ? '🎉' : result.percentage >= 50 ? '👍' : '📚'}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {result.message}
              </h2>
              <p className="text-gray-600">
                {result.percentage >= 50 ? 'You passed the quiz!' : 'Keep practicing!'}
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
              <div className="text-5xl font-bold text-indigo-600 mb-2">
                {result.score} / {result.total}
              </div>
              <div className="text-xl text-gray-700 mb-1">
                Score: {result.percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">
                Time taken: {formatTime(timeElapsed)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Category</div>
                <div className="text-lg font-semibold">{selectedCategory}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Difficulty</div>
                <div className="text-lg font-semibold">{selectedDifficulty}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={resetQuiz} className="btn btn-primary">
                Take Another Quiz
              </button>
              <button onClick={() => navigate('/leaderboard')} className="btn btn-outline">
                View Leaderboard 🏆
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;