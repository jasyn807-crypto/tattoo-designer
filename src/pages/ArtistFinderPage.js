import React, { useState, useEffect, useCallback } from 'react';
import * as apiService from '../services/apiService'; // Assuming apiService will have this function
import { Link } from 'react-router-dom';

const ArtistFinderPage = () => {
    const [artists, setArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [specialties, setSpecialties] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = useCallback(async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (searchTerm) params.searchTerm = searchTerm;
            if (location) params.location = location;
            if (specialties) params.specialties = specialties;
            const response = await apiService.fetchArtists(params);
            setArtists(response.data);
        } catch (err) {
            setError('Failed to fetch artists.');
            console.error('Error fetching artists:', err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, location, specialties, setArtists, setLoading, setError]);

    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Find Your Tattoo Artist</h1>

            <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="searchTerm" className="block text-gray-700 text-sm font-bold mb-2">
                            Search Term (Name, Style)
                        </label>
                        <input
                            type="text"
                            id="searchTerm"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="e.g., John Doe, Traditional"
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                            Location (City, State)
                        </label>
                        <input
                            type="text"
                            id="location"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., New York, NY"
                        />
                    </div>
                    <div>
                        <label htmlFor="specialties" className="block text-gray-700 text-sm font-bold mb-2">
                            Specialties (comma-separated)
                        </label>
                        <input
                            type="text"
                            id="specialties"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={specialties}
                            onChange={(e) => setSpecialties(e.target.value)}
                            placeholder="e.g., Traditional, Realism"
                        />
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search Artists'}
                    </button>
                </div>
            </form>

            {loading && <p className="text-center text-blue-500">Loading artists...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.length > 0 ? (
                    artists.map((artist) => (
                        <div key={artist._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <Link to={`/artists/${artist._id}`}>
                                <img
                                    src={artist.portfolioImages[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                                    alt={artist.name}
                                    className="w-full h-48 object-cover"
                                />
                            </Link>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">
                                    <Link to={`/artists/${artist._id}`} className="text-blue-600 hover:underline">
                                        {artist.name}
                                    </Link>
                                </h2>
                                <p className="text-gray-600 mb-1">{artist.location}</p>
                                <p className="text-gray-500 text-sm">
                                    Specialties: {artist.specialties.join(', ') || 'N/A'}
                                </p>
                                {artist.averageRating > 0 && (
                                    <p className="text-yellow-500 text-sm mt-2">
                                        Rating: {artist.averageRating.toFixed(1)} / 5
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && <p className="text-center text-gray-500 col-span-full">No artists found. Try a different search!</p>
                )}
            </div>
        </div>
    );
};

export default ArtistFinderPage;