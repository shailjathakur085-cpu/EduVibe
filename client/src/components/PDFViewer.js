import React, { useState } from 'react';
import { FaArrowLeft, FaDownload, FaExpand, FaCompress } from 'react-icons/fa';
import './PDFViewer.css';

const PDFViewer = ({ pdfUrl, title, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if it's an uploaded PDF (localhost URL) or external URL
  const isLocalPDF = pdfUrl && pdfUrl.includes('localhost:8081');
  
  // For local PDFs, use direct embed, for external use Google Docs viewer
  const viewerUrl = isLocalPDF 
    ? pdfUrl 
    : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error('Failed to load PDF:', pdfUrl);
  };

  const handleDownload = async () => {
    if (isDownloading) return; // Prevent multiple clicks
    
    try {
      setIsDownloading(true);
      
      if (isLocalPDF) {
        // For local PDFs, fetch and create blob
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'syllabus.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // For external PDFs, open in new tab
        window.open(pdfUrl, '_blank');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Opening PDF in new tab instead.');
      // Fallback: open in new tab
      window.open(pdfUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`pdf-viewer-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="pdf-header">
        <div className="pdf-header-left">
          <button className="btn-back-pdf" onClick={onClose}>
            <FaArrowLeft /> Back
          </button>
          <span className="pdf-title">
            {title || 'PDF Viewer'}
          </span>
        </div>
        
        <div className="pdf-header-right">
          <button 
            className="btn-pdf-action" 
            onClick={handleDownload} 
            title="Download"
            disabled={isDownloading}
            style={{ opacity: isDownloading ? 0.6 : 1, cursor: isDownloading ? 'not-allowed' : 'pointer' }}
          >
            {isDownloading ? (
              <div className="download-spinner"></div>
            ) : (
              <FaDownload />
            )}
          </button>
          <button className="btn-pdf-action" onClick={toggleFullscreen} title="Toggle Fullscreen">
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      <div className="pdf-frame-wrapper">
        {isLoading && (
          <div className="pdf-loading">
            <div className="loading-spinner"></div>
            <p>Loading PDF...</p>
          </div>
        )}
        
        {hasError && (
          <div className="pdf-error">
            <h3>❌ Failed to Load PDF</h3>
            <p>The PDF file could not be found or loaded.</p>
            <p><strong>URL:</strong> {pdfUrl}</p>
            <div className="pdf-error-actions">
              <button onClick={() => window.open(pdfUrl, '_blank')} className="btn-pdf-action">
                Open in New Tab
              </button>
              <button onClick={handleDownload} className="btn-pdf-action">
                Try Download
              </button>
            </div>
          </div>
        )}
        
        {pdfUrl && !hasError ? (
          <iframe
            src={viewerUrl}
            title="PDF Viewer"
            className="pdf-frame"
            onLoad={handleLoad}
            onError={handleError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PDFViewer;
