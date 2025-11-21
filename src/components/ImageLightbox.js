// src/components/ImageLightbox.js

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes, FaSearchPlus } from 'react-icons/fa';
import './ImageLightbox.css';

const ImageLightbox = ({ imageSrc, imageAlt, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const lightboxContent = (
    <div className="image-lightbox-overlay" onClick={handleBackdropClick}>
      <button
        className="lightbox-close-btn"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <FaTimes />
      </button>

      <div className="lightbox-content">
        <div className="lightbox-image-container">
          <img
            src={imageSrc}
            alt={imageAlt || 'Screenshot'}
            className="lightbox-image"
          />
        </div>

        <div className="lightbox-caption">
          <FaSearchPlus className="caption-icon" />
          <span>{imageAlt || 'Screenshot Preview'}</span>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    lightboxContent,
    document.body
  );
};

export default ImageLightbox;
