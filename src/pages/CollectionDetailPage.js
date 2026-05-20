import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as apiService from '../services/apiService';
import './CollectionDetailPage/CollectionDetailPage.css'; // Assuming you'll create this CSS file

const CollectionDetailPage = () => {
    const { id } = useParams();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCollectionDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.getCollectionById(id);
            setCollection(response.data);
        } catch (err) {
            setError('Failed to fetch collection details.');
            console.error('Error fetching collection details:', err);
        } finally {
            setLoading(false);
        }
    }, [id, setCollection, setLoading, setError]);

    useEffect(() => {
        fetchCollectionDetails();
    }, [fetchCollectionDetails]);

    const handleRemoveDesign = async (designId) => {
        if (window.confirm('Are you sure you want to remove this design from the collection?')) {
            try {
                const updatedDesigns = collection.designs
                    .filter(design => design._id !== designId)
                    .map(design => design._id); // Send only IDs back to the backend

                await apiService.updateCollection(id, { designs: updatedDesigns });
                fetchCollectionDetails(); // Refresh collection details
            } catch (err) {
                setError('Failed to remove design from collection.');
                console.error('Error removing design from collection:', err);
            }
        }
    };

    if (loading) return <div>Loading collection details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!collection) return <div>Collection not found.</div>;

    return (
        <div className="collection-detail-page">
            <h1>{collection.name}</h1>
            {collection.description && <p>{collection.description}</p>}

            <h2>Designs in this Collection</h2>
            {collection.designs && collection.designs.length > 0 ? (
                <div className="designs-grid">
                    {collection.designs.map((design) => (
                        <div key={design._id} className="design-card">
                            <Link to={`/designs/${design._id}`}> {/* Assuming a design detail page route */}
                                <img src={design.imageUrl} alt={design.title} />
                                <h3>{design.title}</h3>
                            </Link>
                            <button onClick={() => handleRemoveDesign(design._id)}>Remove from Collection</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No designs in this collection yet.</p>
            )}
            <Link to="/collections" className="back-to-collections">Back to Collections</Link>
        </div>
    );
};

export default CollectionDetailPage;