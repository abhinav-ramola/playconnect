import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Trophy, Users, Calendar, Heart } from 'lucide-react';
import { Button, Spinner, Alert, Badge, StarRating } from '../components/UI';
import { matchAPI, api } from '../services/api';

export const EnhancedProfilePage = () => {
    const { playerId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('stats');

    useEffect(() => {
        fetchProfileData();
    }, [playerId]);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const response = await matchAPI.getUserProfile(playerId);
            // Response structure: { success, message, data: profileData }
            setProfile(response.data.data || response.data);
        } catch (err) {
            try {
                const response = await api.get(`/reviews/player/${playerId}`);
                setProfile(response.data.data || response.data.profile);
            } catch (fallbackErr) {
                setError(fallbackErr.response?.data?.message || 'Failed to load profile');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <Alert type="error" message={error || 'Profile not found'} />
                <Button onClick={() => navigate('/dashboard')} className="mt-4">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const stats = profile.stats || {
        totalMatches: 0,
        averageRating: 0,
        totalReviews: 0,
        positiveReviews: 0,
        wouldPlayAgainCount: 0,
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="relative px-8 pb-8">
                        <div className="flex items-end gap-6 -mt-16 mb-4">
                            {profile.profilePicture ? (
                                <img
                                    src={profile.profilePicture}
                                    alt={`${profile.firstName} ${profile.lastName}`}
                                    className="w-32 h-32 rounded-lg border-4 border-white shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-lg border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-gray-600">
                                        {profile.firstName?.[0]}{profile.lastName?.[0]}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-gray-900">
                                    {profile.firstName} {profile.lastName}
                                </h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <StarRating rating={stats.averageRating} size="md" />
                                    <span className="font-semibold text-gray-700">
                                        {stats.averageRating?.toFixed(1) || 'N/A'} ({stats.totalReviews || 0} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {profile.bio && <p className="text-gray-600 mb-4">{profile.bio}</p>}
                        {profile.location?.city && (
                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                <MapPin size={16} />
                                <span>{profile.location.city}</span>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {profile.skillLevel && <Badge variant="primary">{profile.skillLevel}</Badge>}
                            {profile.sportPreferences?.slice(0, 3).map(sport => (
                                <Badge key={sport} variant="success">{sport}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="flex justify-center mb-2">
                            <Trophy className="text-blue-500" size={32} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalMatches}</div>
                        <div className="text-gray-600 text-sm">Matches Played</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="flex justify-center mb-2">
                            <Star className="text-yellow-400 fill-yellow-400" size={32} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.averageRating?.toFixed(1) || 'N/A'}</div>
                        <div className="text-gray-600 text-sm">Average Rating</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="flex justify-center mb-2">
                            <Heart className="text-red-500 fill-red-500" size={32} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.positiveReviews}</div>
                        <div className="text-gray-600 text-sm">Positive Reviews</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="flex justify-center mb-2">
                            <Users className="text-purple-500" size={32} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.wouldPlayAgainCount}</div>
                        <div className="text-gray-600 text-sm">Would Play Again</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="flex border-b">
                        {['stats', 'reviews', 'history'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 px-6 font-semibold border-b-2 transition ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'stats' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-600 text-sm mb-1">Total Reviews</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-600 text-sm mb-1">Positive Rate</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {stats.totalReviews > 0 ? Math.round((stats.positiveReviews / stats.totalReviews) * 100) : 0}%
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-600 text-sm mb-1">Matches Hosted</p>
                                        <p className="text-2xl font-bold text-gray-900">{profile.stats?.totalHosted || 0}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-600 text-sm mb-1">Matches Joined</p>
                                        <p className="text-2xl font-bold text-gray-900">{profile.stats?.totalJoined || 0}</p>
                                    </div>
                                </div>
                                {profile.achievements?.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">🏅 Achievements</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.achievements.map((achievement, idx) => (
                                                <Badge key={idx} variant="primary">{achievement.badge}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-4">
                                {profile.reviews?.length > 0 ? (
                                    profile.reviews.map(review => (
                                        <div key={review._id} className="border-l-4 border-blue-500 p-4 bg-gray-50 rounded">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {review.reviewedBy?.firstName} {review.reviewedBy?.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <StarRating rating={review.rating} size="sm" />
                                            </div>
                                            {review.comment && <p className="text-gray-700 mb-2">{review.comment}</p>}
                                            <div className="flex gap-4 text-xs text-gray-600 mb-2">
                                                {review.categories?.teamwork && <span>Teamwork: {review.categories.teamwork}/5</span>}
                                                {review.categories?.communication && <span>Communication: {review.categories.communication}/5</span>}
                                                {review.categories?.sportsmanship && <span>Sportsmanship: {review.categories.sportsmanship}/5</span>}
                                            </div>
                                            {review.wouldPlayAgain && (
                                                <div className="flex items-center gap-1 text-xs text-green-600">
                                                    <Heart size={12} className="fill-green-600" />
                                                    Would play again
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 text-center py-8">No reviews yet</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-3">
                                {profile.matchHistory?.length > 0 ? (
                                    profile.matchHistory.map((match, idx) => (
                                        <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{match.title || match.matchDetails?.title}</h4>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 flex-wrap">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {new Date(match.matchDate || match.matchDetails?.matchDate).toLocaleDateString()}
                                                        </span>
                                                        <span>{match.sport || match.matchDetails?.sport}</span>
                                                        <Badge variant={match.status === 'completed' ? 'success' : 'warning'}>{match.status}</Badge>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{match.role || 'player'}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 text-center py-8">No match history</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedProfilePage;
