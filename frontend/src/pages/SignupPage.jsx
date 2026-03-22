import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Select, Alert } from '../components/UI';

export const SignupPage = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        city: '',
        state: '',
        address: '',
        sportPreferences: [],
    });

    const sports = [
        { value: 'cricket', label: 'Cricket' },
        { value: 'football', label: 'Football' },
        { value: 'badminton', label: 'Badminton' },
        { value: 'basketball', label: 'Basketball' },
        { value: 'tennis', label: 'Tennis' },
        { value: 'volleyball', label: 'Volleyball' },
    ];

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await signup({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                city: formData.city,
                state: formData.state,
                address: formData.address,
                sportPreferences: formData.sportPreferences,
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error?.email || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-8">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">🎯 PlayConnect</h1>
                    <p className="text-gray-600">Join the sports community</p>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required />
                        <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
                    </div>

                    <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />

                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" required />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="New York" required />
                        <Input label="State" name="state" value={formData.state} onChange={handleChange} placeholder="NY" />
                    </div>

                    <Input label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St" />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sport Preferences</label>
                        <div className="grid grid-cols-2 gap-3">
                            {sports.map((sport) => (
                                <label key={sport.value} className="flex items-center gap-2">
                                    <input type="checkbox" value={sport.value} onChange={handleSportChange} className="w-4 h-4" />
                                    <span>{sport.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" required />
                        <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required />
                    </div>

                    <Button type="submit" variant="primary" className="w-full font-semibold" disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
