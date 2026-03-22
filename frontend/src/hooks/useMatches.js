import { useState, useEffect } from 'react';
import { matchAPI } from '../services/api';

/**
 * Hook for fetching matches
 */
export const useMatches = (filters = {}) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                const response = await matchAPI.getAllMatches(filters);
                setMatches(response.data.data.matches);
                setPagination(response.data.data.pagination);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch matches');
                console.error('Error fetching matches:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [filters]);

    return { matches, loading, error, pagination };
};

/**
 * Hook for fetching single match
 */
export const useMatch = (matchId) => {
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!matchId) return;

        const fetchMatch = async () => {
            try {
                setLoading(true);
                const response = await matchAPI.getMatchById(matchId);
                setMatch(response.data.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch match');
                console.error('Error fetching match:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [matchId]);

    return { match, loading, error };
};

/**
 * Hook for nearby matches
 */
export const useNearbyMatches = (longitude, latitude, maxDistance = 10000) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNearbyMatches = async () => {
        if (!longitude || !latitude) return;

        try {
            setLoading(true);
            const response = await matchAPI.getNearbyMatches({
                longitude,
                latitude,
                maxDistance,
            });
            setMatches(response.data.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch nearby matches');
            console.error('Error fetching nearby matches:', err);
        } finally {
            setLoading(false);
        }
    };

    return { matches, loading, error, fetchNearbyMatches };
};
