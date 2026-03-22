import { useState } from 'react';
import { Button, Alert, Modal } from './UI';
import { Star, CheckCircle, XCircle } from 'lucide-react';

export const MatchCompletionForm = ({ match, onSubmit, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        result: 'Draw',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err.message || 'Failed to complete match');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Complete Match">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Match Result
                    </label>
                    <select
                        name="result"
                        value={formData.result}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    >
                        <option value="Draw">Draw</option>
                        <option value="Team A Won">Team A Won</option>
                        <option value="Team B Won">Team B Won</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Add details about the match..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                        rows="4"
                    />
                </div>

                <div className="flex gap-3">
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        disabled={loading}
                    >
                        {loading ? 'Completing...' : 'Complete Match'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export const PlayerReviewForm = ({ reviewedPlayer, match, onSubmit, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        rating: 5,
        categories: {
            teamwork: 4,
            communication: 4,
            sportsmanship: 4,
            skillLevel: 4,
        },
        comment: '',
        performance: 'good',
        wouldPlayAgain: true,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === 'true' ? true : value === 'false' ? false : value,
        }));
    };

    const handleCategoryChange = (category, value) => {
        setFormData(prev => ({
            ...prev,
            categories: {
                ...prev.categories,
                [category]: parseInt(value),
            },
        }));
        // Update overall rating as average of categories
        const categories = {
            ...formData.categories,
            [category]: parseInt(value),
        };
        const avgRating = Math.round(
            (categories.teamwork + categories.communication + categories.sportsmanship + categories.skillLevel) / 4
        );
        setFormData(prev => ({
            ...prev,
            rating: avgRating,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Review ${reviewedPlayer.firstName}`}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                {/* Overall Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overall Rating: {formData.rating} / 5
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                className={`${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'} transition`}
                            >
                                <Star size={28} fill="currentColor" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Ratings */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Rate by Category</label>
                    {['teamwork', 'communication', 'sportsmanship', 'skillLevel'].map(category => (
                        <div key={category}>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-medium text-gray-600 capitalize">
                                    {category.replace(/([A-Z])/g, ' $1')}
                                </label>
                                <span className="text-xs font-semibold text-blue-600">
                                    {formData.categories[category]} / 5
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={formData.categories[category]}
                                onChange={(e) => handleCategoryChange(category, e.target.value)}
                                className="w-full"
                            />
                        </div>
                    ))}
                </div>

                {/* Performance */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Performance</label>
                    <select
                        name="performance"
                        value={formData.performance}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    >
                        <option value="outstanding">Outstanding</option>
                        <option value="good">Good</option>
                        <option value="average">Average</option>
                        <option value="below_average">Below Average</option>
                    </select>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment (Optional)
                    </label>
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Share your experience..."
                        maxLength={500}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                        rows="3"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.comment.length}/500</p>
                </div>

                {/* Would Play Again */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="wouldPlayAgain"
                        checked={formData.wouldPlayAgain}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            wouldPlayAgain: e.target.checked,
                        }))}
                    />
                    <label htmlFor="wouldPlayAgain" className="text-sm text-gray-700">
                        I would play with this person again
                    </label>
                </div>

                <div className="flex gap-3">
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Skip
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
