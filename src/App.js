import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DesignGenerationPage from './pages/DesignGenerationPage';
import ImageUploadPage from './pages/ImageUploadPage';
import ImageModificationPage from './pages/ImageModificationPage';
import DesignGalleryPage from './pages/DesignGalleryPage';
import ArtistFinderPage from './pages/ArtistFinderPage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import VirtualTryOnPage from './pages/VirtualTryOnPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import PricingPage from './pages/PricingPage'; // New import
import SubscriptionManagementPage from './pages/SubscriptionManagementPage'; // New import

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/generate" element={<DesignGenerationPage />} />
          <Route path="/upload" element={<ImageUploadPage />} />
          <Route path="/modify" element={<ImageModificationPage />} />
          <Route path="/gallery" element={<DesignGalleryPage />} />
          <Route path="/artists" element={<ArtistFinderPage />} />
          <Route path="/artists/:id" element={<ArtistProfilePage />} />
          <Route path="/try-on" element={<VirtualTryOnPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} /> {/* New route */}
          <Route path="/subscription-management" element={<SubscriptionManagementPage />} /> {/* New route */}
        </Routes>
        <nav className="bg-gray-800 p-4 text-white">
          <ul className="flex justify-center space-x-4">
            <li><a href="/" className="hover:text-gray-300">Home</a></li>
            <li><a href="/generate" className="hover:text-gray-300">Generate Design</a></li>
            <li><a href="/upload" className="hover:text-gray-300">Upload Image</a></li>
            <li><a href="/modify" className="hover:text-gray-300">Modify Image</a></li>
            <li><a href="/gallery" className="hover:text-gray-300">Design Gallery</a></li>
            <li><a href="/artists" className="hover:text-gray-300">Find Artists</a></li>
            <li><a href="/try-on" className="hover:text-gray-300">Virtual Try-On</a></li>
            <li><a href="/collections" className="hover:text-gray-300">Collections</a></li>
            <li><a href="/pricing" className="hover:text-gray-300">Pricing</a></li> {/* New navigation link */}
            <li><a href="/subscription-management" className="hover:text-gray-300">My Subscription</a></li> {/* New navigation link */}
          </ul>
        </nav>
      </div>
    </BrowserRouter>
  );
}

export default App;