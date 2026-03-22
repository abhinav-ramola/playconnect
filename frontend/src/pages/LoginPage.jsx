import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Alert } from '../components/UI';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">🎯 PlayConnect</h1>
                    <p className="text-gray-600">Connect with sports enthusiasts near you</p>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />

                    <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />

                    <Button type="submit" variant="primary" className="w-full font-semibold" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
                            Sign Up
                        </Link>
                    </p>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
                    <p>Demo credentials:</p>
                    <p>Email: test@example.com</p>
                    <p>Password: password123</p>
                </div>
            </div>
        </div>
    );
};
