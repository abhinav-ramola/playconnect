import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { Card, Button, Spinner, Badge } from '../components/UI';
import { MapPin, Users, Calendar } from 'lucide-react';

export const HomePage = () => {
    const [filters, setFilters] = useState({
        sport: '',
        city: '',
        status: 'upcoming',
        page: 1,
        limit: 10,
    });

    const { matches, loading, pagination } = useMatches(filters);

    const sports = ['cricket', 'football', 'badminton', 'basketball', 'tennis', 'volleyball'];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1, // Reset to first page when filter changes
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                            <select name="sport" value={filters.sport} onChange={handleFilterChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                            <input type="text" name="city" value={filters.city} onChange={handleFilterChange} placeholder="Enter city" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

                {/* Matches List */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner size="lg" />
                    </div>
                ) : matches.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className="text-gray-600 mb-4">No matches found</p>
                        <Link to="/create-match">
                            <Button variant="primary">Create the first match</Button>
                        </Link>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {matches.map((match) => (
                                <Link key={match._id} to={`/matches/${match._id}`}>
                                    <Card className="h-full hover:shadow-lg transition cursor-pointer">
                                        {/* Header */}
                                        <div className="mb-3 flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-1">{match.title}</h3>
                                                <Badge variant="primary">{match.sport}</Badge>
                                            </div>
                                            <Badge variant={match.status === 'upcoming' ? 'success' : 'warning'}>{match.status}</Badge>
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
                                            <p className="text-sm text-gray-600">
                                                Hosted by <span className="font-medium">{match.hostedBy.firstName} {match.hostedBy.lastName}</span>
                                            </p>
                                        </div>

                                        {/* Action Button */}
                                        <Button variant="primary" className="w-full text-sm">
                                            View Details
                                        </Button>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center gap-2">
                                <Button onClick={() => handlePageChange(filters.page - 1)} disabled={filters.page === 1} variant="secondary">
                                    Previous
                                </Button>
                                <span className="px-4 py-2 text-gray-700">
                                    Page {filters.page} of {pagination.pages}
                                </span>
                                <Button onClick={() => handlePageChange(filters.page + 1)} disabled={filters.page === pagination.pages} variant="secondary">
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
