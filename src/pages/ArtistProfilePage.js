import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as apiService from '../services/apiService'; // Assuming apiService will have this function

const ArtistProfilePage = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getArtist = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.fetchArtistById(id);
            setArtist(response.data);
        } catch (err) {
            setError('Failed to fetch artist details.');
            console.error('Error fetching artist details:', err);
        } finally {
            setLoading(false);
        }
    }, [id, setArtist, setLoading, setError]);

    useEffect(() => {
        getArtist();
    }, [getArtist]);

    if (loading) return <div>Loading artist profile...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!artist) return <div>Artist not found.</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold mb-4">{artist.name}</h1>
                <p className="text-gray-700 mb-2"><strong>Location:</strong> {artist.location}</p>
                <p className="text-gray-700 mb-2"><strong>Specialties:</strong> {artist.specialties.join(', ')}</p>
                {artist.bio && <p className="text-gray-700 mb-4"><strong>Bio:</strong> {artist.bio}</p>}
                {artist.averageRating > 0 && (
                    <p className="text-yellow-500 text-lg mb-4">
                        Rating: {artist.averageRating.toFixed(1)} / 5 ({artist.reviewCount} reviews)
                    </p>
                )}

                <h2 className="text-2xl font-semibold mb-3">Portfolio</h2>
                {artist.portfolioImages && artist.portfolioImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {artist.portfolioImages.map((image, index) => (
                            <div key={index} className="overflow-hidden rounded-lg">
                                <img
                                    src={image}
                                    alt=""
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No portfolio images available.</p>
                )}

                <h2 className="text-2xl font-semibold mt-6 mb-3">Contact</h2>
                <p className="text-gray-700">
                    <strong>Email:</strong> <a href={`mailto:${artist.email}`} className="text-blue-600 hover:underline">{artist.email}</a>
                </p>
                {artist.phone && (
                    <p className="text-gray-700">
                        <strong>Phone:</strong> {artist.phone}
                    </p>
                )}
                {artist.website && (
                    <p className="text-gray-700">
                        <strong>Website:</strong> <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{artist.website}</a>
                    </p>
                )}
            </div>
            <Link to="/artists" className="text-blue-600 hover:underline mt-4 block text-center">Back to Artist Finder</Link>
        </div>
    );
};

export default ArtistProfilePage;