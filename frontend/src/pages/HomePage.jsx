import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMatchGroups } from '../hooks/useMatchGroups';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Spinner, Badge, StarRating } from '../components/UI';
import { RatingModal } from '../components/RatingModal';
import { useNotification } from '../context/NotificationContext';
import { MapPin, Users, Calendar, Star, AlertCircle } from 'lucide-react';

const MatchCard = ({ match, onRateClick, isUserMatch, isCompleted }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'ongoing':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'upcoming':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusEmoji = (status) => {
        switch (status) {
            case 'completed':
                return '🔵';
            case 'ongoing':
                return '🟠';
            case 'cancelled':
                return '🔴';
            case 'upcoming':
            default:
                return '🟢';
        }
    };

    return (
        <Card className="h-full hover:shadow-lg transition">
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{match.title}</h3>
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="primary">{match.sport}</Badge>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(match.status)}`}>
                            {getStatusEmoji(match.status)} {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4 text-gray-600">
                <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span className="text-sm">{formatDate(match.matchDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span className="text-sm">{match.location.city}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span className="text-sm">
                        {match.playersJoined.length}/{match.playersNeeded} players
                    </span>
                </div>
            </div>

            {/* Host Info */}
            <div className="border-t pt-3 mb-3">
                <p className="text-sm text-gray-600 mb-2">
                    Hosted by{' '}
                    <Link
                        to={`/player/${match.hostedBy._id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {match.hostedBy.firstName} {match.hostedBy.lastName}
                    </Link>
                </p>
                {match.hostedBy.rating && (
                    <div className="flex items-center gap-2">
                        <StarRating rating={match.hostedBy.rating} size="sm" />
                        <span className="text-xs text-gray-600">{match.hostedBy.rating}/5</span>
                        {match.hostedBy.totalReviews && (
                            <span className="text-xs text-gray-500">({match.hostedBy.totalReviews} reviews)</span>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
                <Link to={`/matches/${match._id}`} className="block">
                    <Button variant="primary" className="w-full text-sm">
                        View Details
                    </Button>
                </Link>
                {isCompleted && isUserMatch && onRateClick && (
                    <Button
                        variant="secondary"
                        onClick={() => onRateClick(match._id)}
                        className="w-full text-sm flex items-center justify-center gap-2"
                    >
                        <Star size={14} />
                        Rate Players
                    </Button>
                )}
            </div>
        </Card>
    );
};

export const HomePage = () => {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const [filters, setFilters] = useState({
        sport: '',
        city: '',
    });
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedMatchId, setSelectedMatchId] = useState(null);

    const { upcomingMatches, ongoingMatches, completedMatches, cancelledMatches, loading, error } = useMatchGroups(filters);

    const sports = ['cricket', 'football', 'badminton', 'basketball', 'tennis', 'volleyball'];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRateClick = (matchId) => {
        setSelectedMatchId(matchId);
        setShowRatingModal(true);
    };

    const isUserInMatch = (match) => {
        return match.playersJoined.some(p => p.player._id === user?._id) ||
            match.hostedBy._id === user?._id;
    };

    const MatchSection = ({ title, matches, status }) => {
        if (matches.length === 0) return null;

        return (
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {matches.length}
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map((match) => (
                        <MatchCard
                            key={match._id}
                            match={match}
                            isUserMatch={isUserInMatch(match)}
                            isCompleted={status === 'completed'}
                            onRateClick={status === 'completed' ? handleRateClick : null}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">🎯 Find Your Match</h1>
                    <p className="text-gray-600">Discover and join local sports events near you</p>
                </div>

                {/* Filters */}
                <Card className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
                            <select
                                name="sport"
                                value={filters.sport}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Sports</option>
                                {sports.map((sport) => (
                                    <option key={sport} value={sport}>
                                        {sport.charAt(0).toUpperCase() + sport.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={filters.city}
                                onChange={handleFilterChange}
                                placeholder="Enter city"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-end">
                            <Link to="/create-match" className="w-full">
                                <Button variant="success" className="w-full">
                                    + Create Match
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner size="lg" />
                    </div>
                ) : error ? (
                    <Card className="bg-red-50 border border-red-200 p-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-red-800 mb-2">
                            <AlertCircle size={20} />
                            <p className="font-medium">{error}</p>
                        </div>
                    </Card>
                ) : (upcomingMatches.length === 0 && ongoingMatches.length === 0 && completedMatches.length === 0 && cancelledMatches.length === 0) ? (
                    <Card className="text-center py-12">
                        <p className="text-gray-600 mb-4">No matches found</p>
                        <Link to="/create-match">
                            <Button variant="primary">Create the first match</Button>
                        </Link>
                    </Card>
                ) : (
                    <>
                        {/* Upcoming Matches Section */}
                        <MatchSection
                            title="🟢 Upcoming Matches"
                            matches={upcomingMatches}
                            status="upcoming"
                        />

                        {/* Ongoing Matches Section */}
                        {ongoingMatches.length > 0 && (
                            <MatchSection
                                title="🟡 Ongoing Matches"
                                matches={ongoingMatches}
                                status="ongoing"
                            />
                        )}

                        {/* Completed Matches Section */}
                        {completedMatches.length > 0 && (
                            <MatchSection
                                title="🔵 Completed Matches"
                                matches={completedMatches}
                                status="completed"
                            />
                        )}

                        {/* Cancelled Matches Section */}
                        {cancelledMatches.length > 0 && (
                            <MatchSection
                                title="🔴 Cancelled Matches"
                                matches={cancelledMatches}
                                status="cancelled"
                            />
                        )}
                    </>
                )}
            </div>

            {/* Rating Modal will be added later when users click "Rate Players" */}
            {showRatingModal && (
                <RatingModal
                    matchId={selectedMatchId}
                    isOpen={showRatingModal}
                    onClose={() => {
                        setShowRatingModal(false);
                        setSelectedMatchId(null);
                    }}
                />
            )}
        </div>
    );
};

