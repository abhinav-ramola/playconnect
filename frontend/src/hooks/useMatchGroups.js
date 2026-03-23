import { useState, useEffect } from 'react';
import { matchAPI } from '../services/api';

/**
 * Hook for fetching and grouping matches by status
 */
export const useMatchGroups = (filters = {}) => {
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [ongoingMatches, setOngoingMatches] = useState([]);
    const [completedMatches, setCompletedMatches] = useState([]);
    const [cancelledMatches, setCancelledMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllMatches = async () => {
            try {
                setLoading(true);

                // Fetch all statuses in parallel
                const [upcomingRes, ongoingRes, completedRes, cancelledRes] = await Promise.all([
                    matchAPI.getAllMatches({ ...filters, status: 'upcoming' }),
                    matchAPI.getAllMatches({ ...filters, status: 'ongoing' }),
                    matchAPI.getAllMatches({ ...filters, status: 'completed' }),
                    matchAPI.getAllMatches({ ...filters, status: 'cancelled' }),
                ]);

                setUpcomingMatches(upcomingRes.data.data.matches || []);
                setOngoingMatches(ongoingRes.data.data.matches || []);
                setCompletedMatches(completedRes.data.data.matches || []);
                setCancelledMatches(cancelledRes.data.data.matches || []);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch matches');
                console.error('Error fetching grouped matches:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllMatches();
    }, [JSON.stringify(filters)]);

    return {
        upcomingMatches,
        ongoingMatches,
        completedMatches,
        cancelledMatches,
        loading,
        error,
        allMatches: [...upcomingMatches, ...ongoingMatches, ...completedMatches, ...cancelledMatches],
    };
};
