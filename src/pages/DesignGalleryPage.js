import React, { useState, useEffect, useCallback } from 'react';
import * as apiService from '../services/apiService'; // Assuming apiService is in this path

function DesignGalleryPage() {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [error, setError] = useState(null);

  const fetchDesigns = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    const dummyDesigns = [
      { id: 1, imageUrl: 'https://via.placeholder.com/150?text=Design+1', title: 'Lion Head' },
      { id: 2, imageUrl: 'https://via.placeholder.com/150?text=Design+2', title: 'Floral Arm' },
      { id: 3, imageUrl: 'https://via.placeholder.com/150?text=Design+3', title: 'Geometric Pattern' },
    ];
    setDesigns(dummyDesigns);
    setIsLoading(false);
  }, [setDesigns, setIsLoading]);

  const fetchCollections = useCallback(async () => {
    try {
      const response = await apiService.getCollections();
      setCollections(response.data);
    } catch (err) {
      setError('Failed to fetch collections.');
      console.error('Error fetching collections:', err);
    }
  }, [setCollections, setError]);

  useEffect(() => {
    fetchDesigns();
    fetchCollections();
  }, [fetchDesigns, fetchCollections]);

  const handleAddToCollectionClick = (design) => {
    setSelectedDesign(design);
    setShowAddToCollectionModal(true);
  };

  const handleAddToCollection = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let targetCollectionId = selectedCollection;

      if (selectedCollection === 'new' && newCollectionName) {
        const newCollection = await apiService.createCollection({
          name: newCollectionName,
          description: newCollectionDescription,
        });
        targetCollectionId = newCollection.data._id;
      }

      if (!targetCollectionId) {
        setError('Please select a collection or provide a new collection name.');
        return;
      }

      // Fetch the current collection to get its designs
      const collectionToUpdate = await apiService.getCollectionById(targetCollectionId);
      const currentDesigns = collectionToUpdate.data.designs.map(d => d._id);

      // Add the new design if it's not already in the collection
      if (!currentDesigns.includes(selectedDesign.id)) {
        const updatedDesigns = [...currentDesigns, selectedDesign.id];
        await apiService.updateCollection(targetCollectionId, { designs: updatedDesigns });
        alert('Design added to collection successfully!');
      } else {
        alert('Design is already in this collection.');
      }

      setShowAddToCollectionModal(false);
      setSelectedDesign(null);
      setSelectedCollection('');
      setNewCollectionName('');
      setNewCollectionDescription('');
      fetchCollections(); // Refresh collections in case a new one was created
    } catch (err) {
      setError('Failed to add design to collection.');
      console.error('Error adding design to collection:', err);
    }
  };

  const handleShare = async (design) => {
    const shareData = {
      title: design.title,
      text: `Check out this tattoo design: ${design.title}`,
      url: design.imageUrl, // Using image URL as a placeholder for a shareable link
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Design shared successfully');
      } catch (error) {
        console.error('Error sharing design:', error);
      }
    } else {
      alert(`Share this design: ${shareData.title}\nLink: ${shareData.url}`);
    }
  };
 
   return (
     <div>
       <h1>Design Gallery</h1>
      {isLoading ? (
        <p>Loading designs...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {designs.map((design) => (
            <div key={design.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
              <img src={design.imageUrl} alt={design.title} />
              <h3>{design.title}</h3>
              <button onClick={() => handleShare(design)}>Share</button>
              <button onClick={() => handleAddToCollectionClick(design)}>Add to Collection</button>
            </div>
          ))}
        </div>
      )}

      {showAddToCollectionModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowAddToCollectionModal(false)}>&times;</span>
            <h2>Add "{selectedDesign?.title}" to Collection</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleAddToCollection}>
              <div className="form-group">
                <label htmlFor="selectCollection">Select Existing Collection:</label>
                <select
                  id="selectCollection"
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                >
                  <option value="">-- Select a Collection --</option>
                  {collections.map((col) => (
                    <option key={col._id} value={col._id}>
                      {col.name}
                    </option>
                  ))}
                  <option value="new">Create New Collection</option>
                </select>
              </div>

              {selectedCollection === 'new' && (
                <>
                  <div className="form-group">
                    <label htmlFor="newCollectionName">New Collection Name:</label>
                    <input
                      type="text"
                      id="newCollectionName"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newCollectionDescription">Description (optional):</label>
                    <textarea
                      id="newCollectionDescription"
                      value={newCollectionDescription}
                      onChange={(e) => setNewCollectionDescription(e.target.value)}
                    ></textarea>
                  </div>
                </>
              )}
              <button type="submit">Add Design</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignGalleryPage;