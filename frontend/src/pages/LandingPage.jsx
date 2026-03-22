import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI';
import { Zap, Users, Calendar, Trophy, ChevronRight, Star, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // If user is logged in, redirect to dashboard
    if (user) {
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="landing-page min-h-screen overflow-hidden">
            {/* Animated gradient background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-black"></div>
                {/* Animated blobs */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
            </div>

            {/* Navigation Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/30">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline">PlayConnect</span>
                    </div>

                    {/* Navigation Links - Center (optional, can be hidden on mobile) */}
                    <nav className="hidden md:flex items-center gap-8 text-sm">
                        <a href="#" className="text-gray-400 hover:text-white transition duration-300">Features</a>
                        <a href="#" className="text-gray-400 hover:text-white transition duration-300">How It Works</a>
                        <a href="#" className="text-gray-400 hover:text-white transition duration-300">Pricing</a>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition duration-300 rounded-lg border border-white/20 hover:border-white/40 backdrop-blur-sm"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition duration-300"
                        >
                            Join Now
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 text-center">
                    {/* Animated Badge */}
                    <div className="inline-flex items-center gap-2 mb-8 animate-fade-in-down opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <div className="bg-gradient-to-r from-blue-400/20 to-purple-400/20 backdrop-blur-md border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full hover:border-blue-400/60 transition duration-500 group cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Star size={16} />
                                <span className="text-sm font-medium">The Future of Local Sports</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Heading with gradient text */}
                    <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight animate-fade-in-down opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                            PlayConnect
                        </span>
                    </h1>

                    {/* Tagline */}
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-down opacity-0 font-light" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                        Connect with passionate players. Find local matches. Play the games you love. All in one place.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in-down opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                        <button
                            onClick={() => navigate('/signup')}
                            className="group relative px-8 py-4 text-lg font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                Get Started
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 text-lg font-semibold rounded-lg border border-white/20 backdrop-blur-md hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            Sign In
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Floating Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 animate-fade-in-down opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
                        {/* Card 1 */}
                        <div className="group relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-blue-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-2xl transition-all duration-500"></div>
                            <div className="relative">
                                <div className="text-4xl mb-4">🏆</div>
                                <h3 className="font-semibold text-lg text-white group-hover:text-blue-300 transition">Skill-Based Matching</h3>
                                <p className="text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition">Play with players at your level</p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-pink-400/0 group-hover:from-purple-400/10 group-hover:to-pink-400/10 rounded-2xl transition-all duration-500"></div>
                            <div className="relative">
                                <div className="text-4xl mb-4">📍</div>
                                <h3 className="font-semibold text-lg text-white group-hover:text-purple-300 transition">Find Nearby Matches</h3>
                                <p className="text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition">Discover games in your area</p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group relative bg-gradient-to-br from-indigo-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-indigo-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/0 to-blue-400/0 group-hover:from-indigo-400/10 group-hover:to-blue-400/10 rounded-2xl transition-all duration-500"></div>
                            <div className="relative">
                                <div className="text-4xl mb-4">⚡</div>
                                <h3 className="font-semibold text-lg text-white group-hover:text-indigo-300 transition">Instant Connection</h3>
                                <p className="text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition">Join matches in seconds</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 py-32 bg-gradient-to-b from-black via-purple-900/10 to-black">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Why <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Choose PlayConnect?</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to connect with local sports enthusiasts</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <div className="group relative h-full animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full hover:border-blue-400/50 hover:bg-blue-500/10 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/50">
                                    <Zap size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Create Matches</h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition">Host your own matches and invite other players</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative h-full animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full hover:border-purple-400/50 hover:bg-purple-500/10 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/50">
                                    <Users size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Join Matches</h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition">Find and join matches that match your skill level</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative h-full animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-indigo-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full hover:border-indigo-400/50 hover:bg-indigo-500/10 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/50">
                                    <Calendar size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Real-time Updates</h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition">Get instant notifications about match changes</p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="group relative h-full animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-pink-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full hover:border-pink-400/50 hover:bg-pink-500/10 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/10">
                                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/50">
                                    <Trophy size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Player Ratings</h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition">Build your reputation in the community</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative z-10 py-32 bg-gradient-to-b from-black via-blue-900/10 to-black">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            How It <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Works</span>
                        </h2>
                        <p className="text-xl text-gray-400">Get started in just 3 simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="relative group animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                            <div className="flex flex-col items-center">
                                <div className="relative mb-8 group/circle">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full blur-xl opacity-0 group-hover/circle:opacity-75 transition-opacity duration-300"></div>
                                    <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold hover:scale-110 transition-transform duration-300 shadow-2xl shadow-blue-500/50 border border-blue-400/50">
                                        1
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white mb-3">Sign Up</h3>
                                    <p className="text-gray-400">Create your account with your email and basic info</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                            <div className="flex flex-col items-center">
                                <div className="relative mb-8 group/circle">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full blur-xl opacity-0 group-hover/circle:opacity-75 transition-opacity duration-300"></div>
                                    <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold hover:scale-110 transition-transform duration-300 shadow-2xl shadow-purple-500/50 border border-purple-400/50">
                                        2
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white mb-3">Browse & Search</h3>
                                    <p className="text-gray-400">Find matches by sport, location, and skill level</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                            <div className="flex flex-col items-center">
                                <div className="relative mb-8 group/circle">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-full blur-xl opacity-0 group-hover/circle:opacity-75 transition-opacity duration-300"></div>
                                    <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold hover:scale-110 transition-transform duration-300 shadow-2xl shadow-indigo-500/50 border border-indigo-400/50">
                                        3
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white mb-3">Play & Connect</h3>
                                    <p className="text-gray-400">Join matches and connect with local players</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
                {/* Background blur elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {/* Stat 1 */}
                        <div className="group p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                            <div className="text-6xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">10K+</div>
                            <p className="text-blue-100 text-lg font-medium">Active Players</p>
                        </div>

                        {/* Stat 2 */}
                        <div className="group p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                            <div className="text-6xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">50+</div>
                            <p className="text-blue-100 text-lg font-medium">Cities Covered</p>
                        </div>

                        {/* Stat 3 */}
                        <div className="group p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                            <div className="text-6xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">1K+</div>
                            <p className="text-blue-100 text-lg font-medium">Matches Monthly</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 bg-black overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Join the Game?</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
                            Start connecting with local sports enthusiasts today. No credit card required.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                        <button
                            onClick={() => navigate('/signup')}
                            className="group relative px-10 py-4 text-lg font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-300"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-2 text-white">
                                Get Started Free
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-10 py-4 text-lg font-semibold rounded-lg border-2 border-white/30 backdrop-blur-md hover:border-white/60 hover:bg-white/10 transition-all duration-300 text-white flex items-center justify-center gap-2 group"
                        >
                            Already have an account?
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <p className="text-gray-500 text-sm animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                        ✓ Free to join • ✓ No credit card • ✓ Cancel anytime
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 bg-black border-t border-white/10 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Logo & Description */}
                    <div className="mb-12 pb-12 border-b border-white/10">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">PlayConnect</h3>
                        <p className="text-gray-400 max-w-md">Connect with local sports enthusiasts. Find matches. Play the games you love.</p>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Features</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">About</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Cookies</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Sports</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Cricket</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Football</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">More...</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">&copy; 2026 PlayConnect. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm">Facebook</a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm">Instagram</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
