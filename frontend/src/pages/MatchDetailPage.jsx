import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatch } from '../hooks/useMatches';
import { useAuth } from '../context/AuthContext';
import { matchAPI, api } from '../services/api';
import { Card, Button, Spinner, Alert, Input, Select } from '../components/UI';
import { MatchCompletionForm, PlayerReviewForm } from '../components/ReviewComponents';
import { MapPin, Users, Calendar, Trophy, ArrowLeft, Edit2, X, CheckCircle } from 'lucide-react';

export const MatchDetailPage = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { match, loading, error } = useMatch(matchId);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [showCompletionForm, setShowCompletionForm] = useState(false);
    const [userToReview, setUserToReview] = useState(null);
    const [reviewedPlayers, setReviewedPlayers] = useState([]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || !match) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Alert type="error" message={error || 'Match not found'} />
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-4">
                    <ArrowLeft size={16} />
                    Back to Matches
                </button>
            </div>
        );
    }

    const isHost = user?._id === match.hostedBy._id;
    const isJoined = match.playersJoined.some((p) => p.player._id === user?._id);
    const isFull = match.playersJoined.length >= match.playersNeeded;

    const handleJoinMatch = async () => {
        try {
            setActionLoading(true);
            setActionError('');
            await matchAPI.joinMatch(matchId);
            setActionSuccess('Joined match successfully!');
            setTimeout(() => {
                navigate(`/matches/${matchId}`);
                window.location.reload();
            }, 1000);
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to join match');
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeaveMatch = async () => {
        if (window.confirm('Are you sure you want to leave this match?')) {
            try {
                setActionLoading(true);
                setActionError('');
                await matchAPI.leaveMatch(matchId);
                setActionSuccess('Left match successfully!');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (err) {
                setActionError(err.response?.data?.message || 'Failed to leave match');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleEditClick = () => {
        setEditFormData({
            title: match.title,
            description: match.description,
            sport: match.sport,
            playersNeeded: match.playersNeeded,
            matchDate: match.matchDate.split('T')[0],
            matchType: match.matchType,
            skillLevel: match.skillLevel,
            duration: match.duration,
            ground: match.ground || '',
            equipment: match.equipment || '',
            notes: match.notes || '',
        });
        setIsEditing(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveEdit = async () => {
        try {
            setActionLoading(true);
            setActionError('');
            await matchAPI.updateMatch(matchId, {
                ...editFormData,
                location: match.location,
            });
            setActionSuccess('Match updated successfully!');
            setIsEditing(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to update match');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCompleteMatch = async (formData) => {
        try {
            setActionLoading(true);
            setActionError('');
            await api.put(`/reviews/${matchId}/complete`, formData);
            setActionSuccess('Match completed! Now review your teammates.');
            setShowCompletionForm(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to complete match');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitReview = async (formData) => {
        if (!userToReview) return;
        try {
            setActionLoading(true);
            setActionError('');
            await api.post(`/reviews/${matchId}/review/${userToReview._id}`, formData);
            setActionSuccess('Review submitted successfully!');
            setReviewedPlayers([...reviewedPlayers, userToReview._id]);
            setUserToReview(null);
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isEditing) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Edit Match</h1>
                        <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>

                    {actionError && <Alert type="error" message={actionError} onClose={() => setActionError('')} />}

                    <Card>
                        <div className="space-y-4">
                            <Input label="Match Title" name="title" value={editFormData.title} onChange={handleEditFormChange} />
                            <Input label="Description" name="description" value={editFormData.description} onChange={handleEditFormChange} />
                            <Select label="Sport" name="sport" value={editFormData.sport} onChange={handleEditFormChange} options={[
                                { value: 'cricket', label: 'Cricket' },
                                { value: 'football', label: 'Football' },
                                { value: 'badminton', label: 'Badminton' },
                                { value: 'basketball', label: 'Basketball' },
                                { value: 'tennis', label: 'Tennis' },
                                { value: 'volleyball', label: 'Volleyball' },
                            ]} />
                            <Input label="Players Needed" name="playersNeeded" type="number" value={editFormData.playersNeeded} onChange={handleEditFormChange} />
                            <Input label="Match Date & Time" name="matchDate" type="datetime-local" value={editFormData.matchDate} onChange={handleEditFormChange} />
                            <Select label="Match Type" name="matchType" value={editFormData.matchType} onChange={handleEditFormChange} options={[
                                { value: 'casual', label: 'Casual' },
                                { value: 'competitive', label: 'Competitive' },
                                { value: 'tournament', label: 'Tournament' },
                            ]} />
                            <Select label="Skill Level" name="skillLevel" value={editFormData.skillLevel} onChange={handleEditFormChange} options={[
                                { value: 'beginner', label: 'Beginner' },
                                { value: 'intermediate', label: 'Intermediate' },
                                { value: 'advanced', label: 'Advanced' },
                                { value: 'professional', label: 'Professional' },
                            ]} />
                            <Input label="Duration (minutes)" name="duration" type="number" value={editFormData.duration} onChange={handleEditFormChange} />
                            <Input label="Ground/Venue" name="ground" value={editFormData.ground} onChange={handleEditFormChange} />
                            <Input label="Equipment Needed" name="equipment" value={editFormData.equipment} onChange={handleEditFormChange} />
                            <Input label="Additional Notes" name="notes" value={editFormData.notes} onChange={handleEditFormChange} />

                            <div className="flex gap-4 pt-4">
                                <Button onClick={handleSaveEdit} variant="primary" className="flex-1" disabled={actionLoading}>
                                    {actionLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button onClick={() => setIsEditing(false)} variant="secondary" className="flex-1" disabled={actionLoading}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
                    <ArrowLeft size={20} />
                    Back to Matches
                </button>

                {actionError && <Alert type="error" message={actionError} onClose={() => setActionError('')} />}
                {actionSuccess && <Alert type="success" message={actionSuccess} onClose={() => setActionSuccess('')} />}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Side - Match Details */}
                    <div className="lg:col-span-2">
                        <Card className="mb-6">
                            <div className="mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{match.title}</h1>
                                        <p className="text-gray-600">{match.description}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full font-semibold ${match.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                                    </span>
                                </div>

                                {/* Key Details */}
                                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Sport</p>
                                        <p className="font-semibold text-lg">{match.sport.charAt(0).toUpperCase() + match.sport.slice(1)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Match Type</p>
                                        <p className="font-semibold text-lg">{match.matchType.charAt(0).toUpperCase() + match.matchType.slice(1)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Skill Level</p>
                                        <p className="font-semibold text-lg">{match.skillLevel.charAt(0).toUpperCase() + match.skillLevel.slice(1)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Duration</p>
                                        <p className="font-semibold text-lg">{match.duration} minutes</p>
                                    </div>
                                </div>

                                {/* Location & Date */}
                                <div className="space-y-3 mb-6 pb-6 border-b">
                                    <div className="flex items-start gap-3">
                                        <Calendar size={20} className="text-blue-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600">Date & Time</p>
                                            <p className="font-semibold">{formatDate(match.matchDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin size={20} className="text-blue-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600">Location</p>
                                            <p className="font-semibold">{match.location.address}</p>
                                            <p className="text-gray-600">{match.location.city}</p>
                                        </div>
                                    </div>
                                    {match.ground && (
                                        <div className="flex items-start gap-3">
                                            <Trophy size={20} className="text-blue-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-600">Ground</p>
                                                <p className="font-semibold">{match.ground}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Info */}
                                {(match.equipment || match.notes) && (
                                    <div className="mb-6 pb-6 border-b">
                                        {match.equipment && (
                                            <div className="mb-3">
                                                <p className="text-sm font-medium text-gray-700">Equipment Needed</p>
                                                <p className="text-gray-600">{match.equipment}</p>
                                            </div>
                                        )}
                                        {match.notes && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Additional Notes</p>
                                                <p className="text-gray-600">{match.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {match.entryFee > 0 && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Entry Fee:</strong> ₹{match.entryFee}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Host Info */}
                        <Card>
                            <h3 className="text-lg font-bold mb-4">Hosted By</h3>
                            <div className="flex items-center gap-4">
                                <img src={match.hostedBy.profilePicture || 'https://via.placeholder.com/60'} alt={match.hostedBy.firstName} className="w-16 h-16 rounded-full object-cover" />
                                <div className="flex-1">
                                    <p className="font-semibold text-lg">
                                        {match.hostedBy.firstName} {match.hostedBy.lastName}
                                    </p>
                                    <p className="text-gray-600 text-sm">Hosted {match.hostedBy.matchesHosted} matches</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Side - Players & Actions */}
                    <div>
                        {/* Players Card */}
                        <Card className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Players</h3>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                    {match.playersJoined.length}/{match.playersNeeded}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(match.playersJoined.length / match.playersNeeded) * 100}%` }}></div>
                            </div>

                            {/* Players List */}
                            <div className="space-y-3">
                                {match.playersJoined.map((player) => (
                                    <div key={player.player._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <img src={player.player.profilePicture || 'https://via.placeholder.com/40'} alt={player.player.firstName} className="w-10 h-10 rounded-full object-cover" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">
                                                {player.player.firstName} {player.player.lastName}
                                            </p>
                                            {player.player._id === match.hostedBy._id && <p className="text-xs text-blue-600 font-semibold">Host</p>}
                                        </div>
                                    </div>
                                ))}

                                {/* Empty Slots */}
                                {match.playersJoined.length < match.playersNeeded && (
                                    <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">{match.playersNeeded - match.playersJoined.length} slots available</div>
                                )}
                            </div>
                        </Card>

                        {/* Actions */}
                        {user && (
                            <Card>
                                {isHost ? (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600 mb-3">You are the host of this match</p>
                                        {match.status === 'upcoming' && (
                                            <>
                                                <Button onClick={handleEditClick} variant="secondary" className="w-full">
                                                    <Edit2 size={16} className="mr-2" />
                                                    Edit Match
                                                </Button>
                                                <Button variant="danger" className="w-full">
                                                    Cancel Match
                                                </Button>
                                            </>
                                        )}
                                        {match.status === 'ongoing' && isFull && (
                                            <Button onClick={() => setShowCompletionForm(true)} variant="primary" className="w-full">
                                                <CheckCircle size={16} className="mr-2" />
                                                Complete Match
                                            </Button>
                                        )}
                                        {match.status === 'completed' && (
                                            <div className="text-center py-4">
                                                <p className="text-green-600 font-semibold">✓ Match Completed</p>
                                                {match.playersWithReviews && match.playersWithReviews.length > 0 && (
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        {match.playersWithReviews.length} reviews submitted
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : isJoined ? (
                                    <>
                                        <Button onClick={handleLeaveMatch} variant="danger" className="w-full" disabled={actionLoading}>
                                            {actionLoading ? 'Leaving...' : 'Leave Match'}
                                        </Button>
                                        {match.status === 'completed' && !reviewedPlayers.includes(match.hostedBy._id) && (
                                            <Button
                                                onClick={() => setUserToReview(match.hostedBy)}
                                                variant="primary"
                                                className="w-full mt-3"
                                                disabled={actionLoading}
                                            >
                                                Review Host
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <Button onClick={handleJoinMatch} variant="primary" className="w-full" disabled={actionLoading || isFull}>
                                        {actionLoading ? 'Joining...' : isFull ? 'Match Full' : 'Join Match'}
                                    </Button>
                                )}
                            </Card>
                        )}

                        {/* Match Completion Form Modal */}
                        {showCompletionForm && (
                            <MatchCompletionForm
                                match={match}
                                onSubmit={handleCompleteMatch}
                                onClose={() => setShowCompletionForm(false)}
                            />
                        )}

                        {/* Player Review Form Modal */}
                        {userToReview && (
                            <PlayerReviewForm
                                reviewedPlayer={userToReview}
                                match={match}
                                onSubmit={handleSubmitReview}
                                onClose={() => setUserToReview(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
