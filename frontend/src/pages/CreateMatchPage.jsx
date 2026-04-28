import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI } from '../services/api';
import MapPicker from '../components/MapPicker';
import { Card, Button, Input, Select, Alert, Spinner } from '../components/UI';
import { ArrowLeft } from 'lucide-react';

export const CreateMatchPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        sport: '',
        playersNeeded: '',
        venue: '',
        location: {
            address: '',
            city: '',
            longitude: 0,
            latitude: 0,
        },
        date: '',
        startTime: '',
        endTime: '',
        matchType: 'casual',
        skillLevel: 'beginner',
        duration: 120,
        ground: '',
        equipment: '',
        notes: '',
        entryFee: 0,
    });

    // Venue availability state
    const [availability, setAvailability] = useState(null); // null | true | false
    const [checking, setChecking] = useState(false);

    const sports = [
        { value: 'cricket', label: '🏏 Cricket' },
        { value: 'football', label: '⚽ Football' },
        { value: 'badminton', label: '🏸 Badminton' },
        { value: 'basketball', label: '🏀 Basketball' },
        { value: 'tennis', label: '🎾 Tennis' },
        { value: 'volleyball', label: '🏐 Volleyball' },
    ];

    const matchTypes = [
        { value: 'casual', label: 'Casual' },
        { value: 'competitive', label: 'Competitive' },
        { value: 'tournament', label: 'Tournament' },
    ];

    const skillLevels = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'all', label: 'All Levels' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('location.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    [field]: field === 'latitude' || field === 'longitude' ? parseFloat(value) : value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: name === 'playersNeeded' || name === 'duration' || name === 'entryFee' ? parseInt(value) || '' : value,
            }));
        }
    };

    // MapPicker handler
    const handleMapChange = ({ latitude, longitude }) => {
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                latitude,
                longitude,
            },
        }));
    };

    // Check venue availability when venue/date/startTime/endTime changes
    useEffect(() => {
        const check = async () => {
            if (!formData.venue || !formData.date || !formData.startTime || !formData.endTime) {
                setAvailability(null);
                return;
            }
            setChecking(true);
            try {
                const res = await matchAPI.checkAvailability({
                    venue: formData.venue,
                    date: formData.date,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                });
                setAvailability(res.data.available);
            } catch {
                setAvailability(null);
            }
            setChecking(false);
        };
        check();
    }, [formData.venue, formData.date, formData.startTime, formData.endTime]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.title.trim()) {
            setError('Match title is required');
            return;
        }
        if (!formData.sport) {
            setError('Please select a sport');
            return;
        }
        if (!formData.playersNeeded) {
            setError('Players needed is required');
            return;
        }
        if (!formData.venue.trim()) {
            setError('Venue is required');
            return;
        }
        if (!formData.location.address.trim()) {
            setError('Location address is required');
            return;
        }
        if (!formData.location.city.trim()) {
            setError('City is required');
            return;
        }
        if (!formData.date) {
            setError('Date is required');
            return;
        }
        if (!formData.startTime) {
            setError('Start time is required');
            return;
        }
        if (!formData.endTime) {
            setError('End time is required');
            return;
        }
        if (availability === false) {
            setError('Venue is already booked for this slot');
            return;
        }

        setLoading(true);

        try {
            const response = await matchAPI.createMatch({
                ...formData,
            });

            setSuccess('Match created successfully!');
            setTimeout(() => {
                navigate(`/matches/${response.data.data._id}`);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create match');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Back Button */}
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
                    <ArrowLeft size={20} />
                    Back to Matches
                </button>

                <Card>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">🎯 Create a New Match</h1>

                    {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                    {success && <Alert type="success" message={success} />}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Match Details</h3>

                            <Input label="Match Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Sunday Cricket Match" required />

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the match, rules, or any special requirements..."
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select name="sport" label="Sport" value={formData.sport} onChange={handleChange} options={sports} required />
                            </div>
                        </div>

                        {/* Match Type */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Match Type</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select name="matchType" label="Match Type" value={formData.matchType} onChange={handleChange} options={matchTypes} />
                                <Select name="skillLevel" label="Skill Level Required" value={formData.skillLevel} onChange={handleChange} options={skillLevels} />
                            </div>
                        </div>

                        {/* Players Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Players Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Players Needed" type="number" name="playersNeeded" value={formData.playersNeeded} onChange={handleChange} placeholder="Number of players" required />

                                <Input label="Duration (minutes)" type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="120" />
                            </div>
                        </div>

                        {/* Location & Venue */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Venue & Location Details</h3>

                            <Input label="Venue Name" name="venue" value={formData.venue} onChange={handleChange} placeholder="e.g., Central Park Ground" required />

                            <Input label="Address" name="location.address" value={formData.location.address} onChange={handleChange} placeholder="Street address" required />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="City" name="location.city" value={formData.location.city} onChange={handleChange} placeholder="City name" required />
                                <Input label="Ground (optional)" name="ground" value={formData.ground} onChange={handleChange} placeholder="e.g., Central Park" />
                            </div>

                            <div className="my-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pick Location on Map</label>
                                <MapPicker value={{ latitude: formData.location.latitude, longitude: formData.location.longitude }} onChange={handleMapChange} height={300} />
                                <div className="text-xs text-gray-500 mt-2">Latitude: {formData.location.latitude} | Longitude: {formData.location.longitude}</div>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Date & Time</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="Date" type="date" name="date" value={formData.date} onChange={handleChange} required />
                                <Input label="Start Time" type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                                <Input label="End Time" type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
                            </div>

                            {/* Venue Availability Status */}
                            <div className="mt-2">
                                {checking && <span className="text-blue-500 text-sm">Checking availability...</span>}
                                {availability === true && <span className="text-green-600 text-sm">Available ✅</span>}
                                {availability === false && <span className="text-red-600 text-sm">Booked ❌</span>}
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>

                            <Input label="Equipment Needed (optional)" name="equipment" value={formData.equipment} onChange={handleChange} placeholder="e.g., Bat, Ball, Gloves" />

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (optional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Any other information for players..."
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <Input label="Entry Fee (₹) - Optional" type="number" name="entryFee" value={formData.entryFee} onChange={handleChange} placeholder="0" />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6">
                            <Button type="submit" variant="primary" className="flex-1 font-semibold" disabled={loading || availability === false || checking}>
                                {loading ? <Spinner size="sm" /> : '🎯 Create Match'}
                            </Button>
                            <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/dashboard')}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};
