import { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Modal } from './UI';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { matchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const RatingModal = ({ matchId, isOpen, onClose }) => {
    const { user, refreshUser } = useAuth();
    const { addNotification } = useNotification();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});
    const [submittedPlayers, setSubmittedPlayers] = useState(new Set());

    useEffect(() => {
        if (isOpen && matchId) {
            fetchMatch();
        }
    }, [isOpen, matchId]);

    const fetchMatch = async () => {
        try {
            setLoading(true);
            const response = await matchAPI.getMatchById(matchId);
            setMatch(response.data.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load match');
            console.error('Error fetching match:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (loading) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Rate Players">
                <div className="flex justify-center items-center py-12">
                    <Spinner size="lg" />
                </div>
            </Modal>
        );
    }

    if (error) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Rate Players">
                <Alert type="error" message={error} />
                <div className="mt-4">
                    <Button onClick={onClose} variant="secondary" className="w-full">
                        Close
                    </Button>
                </div>
            </Modal>
        );
    }

    if (!match) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Rate Players">
                <p className="text-center text-gray-600">Match not found</p>
                <div className="mt-4">
                    <Button onClick={onClose} variant="secondary" className="w-full">
                        Close
                    </Button>
                </div>
            </Modal>
        );
    }

    // Get all unique players including the host (exclude current user)
    const allPlayers = [
        match.hostedBy,
        ...match.playersJoined.map(p => p.player)
    ].filter((player, index, self) =>
        self.findIndex(p => p._id === player._id) === index
    );

    // Get players already rated by current user in this match
    const alreadyRatedPlayerIds = new Set(
        (match.reviews || [])
            .filter(review => review.reviewedBy?._id === user?._id || review.reviewedBy === user?._id)
            .map(review => review.reviewedPlayer?._id || review.reviewedPlayer)
    );

    // Filter to exclude current user and already-rated players
    const playersToRate = allPlayers.filter(
        player => player._id !== user?._id && !alreadyRatedPlayerIds.has(player._id)
    );

    if (playersToRate.length === 0) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Rate Players">
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                        {alreadyRatedPlayerIds.size > 0 ? 'You have already rated all players in this match' : 'No other players to rate'}
                    </p>
                    <Button onClick={onClose} variant="secondary" className="w-full">
                        Close
                    </Button>
                </div>
            </Modal>
        );
    }

    const currentPlayer = playersToRate[currentPlayerIndex];
    const currentRating = ratings[currentPlayer._id] || 0;
    const currentComment = comments[currentPlayer._id] || '';
    const isSubmitted = submittedPlayers.has(currentPlayer._id);

    const handleRatePlayer = async () => {
        if (isSubmitted || currentRating === 0) return;

        try {
            await matchAPI.submitReview(matchId, currentPlayer._id, {
                rating: currentRating,
                comment: currentComment,
                categories: {
                    teamwork: currentRating,
                    communication: currentRating,
                    sportsmanship: currentRating,
                    skillLevel: currentRating,
                },
                performance: currentRating >= 4 ? 'good' : currentRating >= 3 ? 'average' : 'below_average',
                wouldPlayAgain: currentRating >= 3,
            });

            // Refresh user data to show updated rating
            try {
                const updatedUser = await refreshUser();
                console.log('User data refreshed after rating:', updatedUser);
            } catch (refreshErr) {
                console.warn('Failed to refresh user data:', refreshErr);
            }

            setSubmittedPlayers(prev => new Set([...prev, currentPlayer._id]));
            addNotification(`Rated ${currentPlayer.firstName} ${currentPlayer.lastName} with ${currentRating} stars!`, 'success');

            // Move to next player
            if (currentPlayerIndex < playersToRate.length - 1) {
                setTimeout(() => {
                    setCurrentPlayerIndex(prev => prev + 1);
                }, 800);
            } else {
                // All players rated
                setTimeout(() => {
                    addNotification('All players rated! Thank you for your feedback.', 'success', 3000);
                    onClose();
                }, 800);
            }
        } catch (err) {
            if (err.response?.status === 400 && err.response?.data?.message?.includes('completed')) {
                addNotification('Match must be completed before rating', 'error');
            } else {
                addNotification(err.response?.data?.message || 'Failed to rate player', 'error');
            }
            console.error('Error rating player:', err);
        }
    };

    const handleNext = () => {
        if (currentPlayerIndex < playersToRate.length - 1) {
            setCurrentPlayerIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPlayerIndex > 0) {
            setCurrentPlayerIndex(prev => prev - 1);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Rate Players">
            <div className="space-y-6 max-h-96 overflow-y-auto">
                {/* Progress */}
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                        Player {currentPlayerIndex + 1} of {playersToRate.length}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${((currentPlayerIndex + 1) / playersToRate.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Player Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <img
                            src={currentPlayer.profilePicture || 'https://via.placeholder.com/80'}
                            alt={currentPlayer.firstName}
                            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {currentPlayer.firstName} {currentPlayer.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">Rate this player's performance</p>

                    {isSubmitted && (
                        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-sm mt-4">
                            ✅ Rated {currentRating} / 5
                        </div>
                    )}
                </Card>

                {/* Comment Section */}
                {!isSubmitted && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Share Your Review (Optional)
                        </label>
                        <textarea
                            value={currentComment}
                            onChange={(e) => setComments(prev => ({
                                ...prev,
                                [currentPlayer._id]: e.target.value
                            }))}
                            placeholder="Write your feedback about this player..."
                            maxLength={500}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                            rows="3"
                        />
                        <p className="text-xs text-gray-500 mt-1">{currentComment.length}/500 characters</p>
                    </div>
                )}

                {/* Rating Stars */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                        Rating: {currentRating > 0 ? `${currentRating} / 5 Stars` : 'Select a rating'}
                    </label>
                    <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onClick={() => !isSubmitted && setRatings(prev => ({
                                    ...prev,
                                    [currentPlayer._id]: star
                                }))}
                                disabled={isSubmitted}
                                className={`transition-transform ${isSubmitted
                                    ? 'cursor-not-allowed opacity-60'
                                    : 'hover:scale-125 cursor-pointer'
                                    } ${star <= currentRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                title={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                            >
                                <Star size={40} fill="currentColor" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                {!isSubmitted && (
                    <Button
                        onClick={handleRatePlayer}
                        disabled={currentRating === 0}
                        variant="primary"
                        className="w-full"
                    >
                        Submit Review ({currentRating > 0 ? `${currentRating} stars` : 'Select rating'})
                    </Button>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                    <Button
                        onClick={handlePrevious}
                        disabled={currentPlayerIndex === 0}
                        variant="secondary"
                        className="flex-1 flex items-center justify-center gap-2"
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={currentPlayerIndex === playersToRate.length - 1}
                        variant="secondary"
                        className="flex-1 flex items-center justify-center gap-2"
                    >
                        Next
                        <ChevronRight size={18} />
                    </Button>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                    <div className="flex justify-between mb-2">
                        <span>Rated:</span>
                        <span className="font-semibold">{submittedPlayers.size} / {playersToRate.length}</span>
                    </div>
                    {submittedPlayers.size === playersToRate.length && (
                        <p className="text-green-600 font-medium">✅ All players rated!</p>
                    )}
                </div>

                {/* Close Button */}
                <Button onClick={onClose} variant="primary" className="w-full">
                    {submittedPlayers.size === playersToRate.length ? 'Done' : 'Close'}
                </Button>
            </div>
        </Modal>
    );
};
