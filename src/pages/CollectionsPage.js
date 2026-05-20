import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as apiService from '../services/apiService';
import './CollectionsPage/CollectionsPage.css'; // Assuming you'll create this CSS file

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [newCollectionDescription, setNewCollectionDescription] = useState('');

    const fetchCollections = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.getCollections();
            setCollections(response.data);
        } catch (err) {
            setError('Failed to fetch collections.');
            console.error('Error fetching collections:', err);
        } finally {
            setLoading(false);
        }
    }, [setCollections, setLoading, setError]);

    useEffect(() => {
        fetchCollections();
    }, [fetchCollections]);

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        try {
            await apiService.createCollection({
                name: newCollectionName,
                description: newCollectionDescription,
            });
            setNewCollectionName('');
            setNewCollectionDescription('');
            setShowCreateModal(false);
            fetchCollections(); // Refresh the list
        } catch (err) {
            setError('Failed to create collection.');
            console.error('Error creating collection:', err);
        }
    };

    const handleDeleteCollection = async (collectionId) => {
        if (window.confirm('Are you sure you want to delete this collection?')) {
            try {
                await apiService.deleteCollection(collectionId);
                fetchCollections(); // Refresh the list
            } catch (err) {
                setError('Failed to delete collection.');
                console.error('Error deleting collection:', err);
            }
        }
    };

    if (loading) return <div>Loading collections...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="collections-page">
            <h1>Your Collections</h1>
            <button onClick={() => setShowCreateModal(true)} className="create-collection-btn">
                Create New Collection
            </button>

            {showCreateModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setShowCreateModal(false)}>&times;</span>
                        <h2>Create New Collection</h2>
                        <form onSubmit={handleCreateCollection}>
                            <div className="form-group">
                                <label htmlFor="collectionName">Collection Name:</label>
                                <input
                                    type="text"
                                    id="collectionName"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="collectionDescription">Description (optional):</label>
                                <textarea
                                    id="collectionDescription"
                                    value={newCollectionDescription}
                                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <button type="submit">Create Collection</button>
                        </form>
                    </div>
                </div>
            )}

            {collections.length === 0 ? (
                <p>You haven't created any collections yet.</p>
            ) : (
                <div className="collections-list">
                    {collections.map((collection) => (
                        <div key={collection._id} className="collection-card">
                            <Link to={`/collections/${collection._id}`}>
                                <h3>{collection.name}</h3>
                            </Link>
                            {collection.description && <p>{collection.description}</p>}
                            <p>Designs: {collection.designs ? collection.designs.length : 0}</p>
                            <button
                                onClick={() => handleDeleteCollection(collection._id)}
                                className="delete-collection-btn"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollectionsPage;