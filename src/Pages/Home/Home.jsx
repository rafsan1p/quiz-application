import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../Provider/AuthProvider';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold text-indigo-900 mb-6 animate-fade-in">
                        Welcome to <span className="quiz-hero-gradient">QuizHero</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Challenge yourself with engaging quizzes across multiple categories. 
                        Test your knowledge, compete with others, and track your progress!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {user ? (
                            <>
                                <button 
                                    onClick={() => navigate('/quiz')}
                                    className="btn btn-primary btn-lg text-lg px-8"
                                >
                                    🎯 Start Quiz
                                </button>
                                <button 
                                    onClick={() => navigate('/leaderboard')}
                                    className="btn btn-outline btn-lg text-lg px-8"
                                >
                                    🏆 View Leaderboard
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="btn btn-primary btn-lg text-lg px-8"
                                >
                                    Login to Start
                                </button>
                                <button 
                                    onClick={() => navigate('/signup')}
                                    className="btn btn-outline btn-lg text-lg px-8"
                                >
                                    Create Account
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                        <div className="text-5xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Multiple Categories</h3>
                        <p className="text-gray-600">
                            Choose from Programming, Science, Mathematics, History, Geography, and more specialized topics. 
                            Each category has 15 carefully crafted questions!
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                        <div className="text-5xl mb-4">🎯</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Three Difficulty Levels</h3>
                        <p className="text-gray-600">
                            Start with Easy, challenge yourself with Medium, or master Hard difficulty. 
                            Each level has 25 questions across all categories!
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                        <div className="text-5xl mb-4">🏆</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Global Leaderboard</h3>
                        <p className="text-gray-600">
                            Compete with players worldwide. Track your progress and see where you rank 
                            in each category!
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Quiz Statistics
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">75</div>
                            <div className="text-gray-600">Total Questions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">5</div>
                            <div className="text-gray-600">Categories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">3</div>
                            <div className="text-gray-600">Difficulty Levels</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">5</div>
                            <div className="text-gray-600">Questions per Quiz</div>
                        </div>
                    </div>
                    
                    {/* Additional Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
                            <div className="text-gray-600">Questions per Topic/Level</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">15</div>
                            <div className="text-gray-600">Questions per Category</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">25</div>
                            <div className="text-gray-600">Questions per Difficulty</div>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-5xl mb-3">1️⃣</div>
                            <h3 className="font-bold text-lg mb-2">Sign Up</h3>
                            <p className="text-indigo-100 text-sm">Create your free account to get started</p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl mb-3">2️⃣</div>
                            <h3 className="font-bold text-lg mb-2">Choose Quiz</h3>
                            <p className="text-indigo-100 text-sm">Select category and difficulty level</p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl mb-3">3️⃣</div>
                            <h3 className="font-bold text-lg mb-2">Answer Questions</h3>
                            <p className="text-indigo-100 text-sm">5 multiple choice questions from our pool of 75 curated questions</p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl mb-3">4️⃣</div>
                            <h3 className="font-bold text-lg mb-2">Get Results</h3>
                            <p className="text-indigo-100 text-sm">See your score and climb the leaderboard</p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                {!user && (
                    <div className="text-center mt-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Ready to Test Your Knowledge?
                        </h2>
                        <p className="text-xl text-gray-600 mb-6">
                            Join thousands of quiz enthusiasts today!
                        </p>
                        <button 
                            onClick={() => navigate('/signup')}
                            className="btn btn-primary btn-lg text-lg px-12"
                        >
                            Get Started Free
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;