import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Card, Button, Input, Select, Alert, Spinner } from '../components/UI';
import { Mail, Phone, MapPin, Trophy, Upload } from 'lucide-react';

export const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [avatarError, setAvatarError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        bio: '',
        sportPreferences: [],
        skillLevel: 'beginner',
    });

    const sports = [
        { value: 'cricket', label: '🏏 Cricket' },
        { value: 'football', label: '⚽ Football' },
        { value: 'badminton', label: '🏸 Badminton' },
        { value: 'basketball', label: '🏀 Basketball' },
        { value: 'tennis', label: '🎾 Tennis' },
        { value: 'volleyball', label: '🏐 Volleyball' },
    ];

    const skillLevels = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'professional', label: 'Professional' },
    ];

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                bio: user.bio || '',
                sportPreferences: user.sportPreferences || [],
                skillLevel: user.skillLevel || 'beginner',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSportChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            sportPreferences: checked ? [...prev.sportPreferences, value] : prev.sportPreferences.filter((s) => s !== value),
        }));
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setAvatarError('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5242880) {
            setAvatarError('Image size should not exceed 5MB');
            return;
        }

        setUploadingAvatar(true);
        setAvatarError('');

        try {
            // Convert image to base64
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const base64Image = reader.result;
                    await authAPI.uploadProfilePicture({ image: base64Image });
                    setSuccess('Profile picture updated successfully!');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } catch (err) {
                    setAvatarError(err.response?.data?.message || 'Failed to upload profile picture');
                } finally {
                    setUploadingAvatar(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setAvatarError('Error processing image');
            setUploadingAvatar(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await updateProfile(formData);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} />}
                {avatarError && <Alert type="error" message={avatarError} onClose={() => setAvatarError('')} />}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Summary */}
                    <Card className="lg:col-span-1">
                        <div className="text-center">
                            <div className="relative inline-block mb-4">
                                <img src={user.profilePicture || 'https://via.placeholder.com/150'} alt={user.firstName} className="w-32 h-32 rounded-full mx-auto border-4 border-blue-600 object-cover" />
                                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                                    <Upload size={16} />
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        disabled={uploadingAvatar}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {uploadingAvatar && <p className="text-sm text-gray-600 mb-4">Uploading...</p>}

                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                {user.firstName} {user.lastName}
                            </h1>

                            <div className="space-y-2 text-gray-600 mb-6 pb-6 border-b">
                                <div className="flex items-center justify-center gap-2">
                                    <Mail size={16} />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Phone size={16} />
                                    <span className="text-sm">{user.phone}</span>
                                </div>
                                {user.location?.city && (
                                    <div className="flex items-center justify-center gap-2">
                                        <MapPin size={16} />
                                        <span className="text-sm">{user.location.city}</span>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="space-y-2 text-sm">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-gray-600">Matches Hosted</p>
                                    <p className="text-2xl font-bold text-blue-600">{user.matchesHosted}</p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-gray-600">Matches Joined</p>
                                    <p className="text-2xl font-bold text-green-600">{user.matchesJoined}</p>
                                </div>
                                <div className="flex items-center justify-center gap-1 bg-yellow-50 p-3 rounded-lg">
                                    <span className="text-xl">⭐</span>
                                    <div>
                                        <p className="text-gray-600">Rating</p>
                                        <p className="text-2xl font-bold text-yellow-600">{user.rating.toFixed(1)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Profile Details */}
                    <Card className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'danger' : 'secondary'}>
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                    <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                </div>

                                <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Tell others about yourself..."
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <Select name="skillLevel" label="Skill Level" value={formData.skillLevel} onChange={handleChange} options={skillLevels} />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Sport Preferences</label>
                                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
                                        {sports.map((sport) => (
                                            <label key={sport.value} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    value={sport.value}
                                                    checked={formData.sportPreferences.includes(sport.value)}
                                                    onChange={handleSportChange}
                                                    className="w-4 h-4 rounded"
                                                />
                                                <span className="text-sm">{sport.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                                        {loading ? 'Saving...' : '💾 Save Changes'}
                                    </Button>
                                    <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {/* Bio */}
                                {formData.bio && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                                        <p className="text-gray-600">{formData.bio}</p>
                                    </div>
                                )}

                                {/* Skill Level */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Skill Level</h3>
                                    <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">{formData.skillLevel.charAt(0).toUpperCase() + formData.skillLevel.slice(1)}</div>
                                </div>

                                {/* Sports */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Sport Preferences</h3>
                                    {formData.sportPreferences.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.sportPreferences.map((sport) => {
                                                const sportData = sports.find((s) => s.value === sport);
                                                return (
                                                    <span key={sport} className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                                                        {sportData?.label || sport}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">No sports selected</p>
                                    )}
                                </div>

                                {/* Contact Info */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p>
                                            <strong>Email:</strong> {user.email}
                                        </p>
                                        <p>
                                            <strong>Phone:</strong> {formData.phone}
                                        </p>
                                        {user.location?.city && (
                                            <p>
                                                <strong>City:</strong> {user.location.city}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Account Info */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Information</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p>
                                            <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>Account Status:</strong> {user.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};
