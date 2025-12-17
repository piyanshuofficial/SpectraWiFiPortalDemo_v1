// src/components/KnowledgeArticleModal.js

import React, { useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import ImageLightbox from './ImageLightbox';
import { FaTimes, FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaBook, FaFilePdf, FaChevronLeft, FaChevronRight, FaList, FaArrowLeft } from 'react-icons/fa';
import './KnowledgeArticleModal.css';

const KnowledgeArticleModal = ({ article, onClose }) => {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isStepByStepMode, setIsStepByStepMode] = useState(false);

  // Extract all steps from article content for step-by-step navigation
  const allSteps = useMemo(() => {
    if (!article || !article.content) return [];
    const stepsSection = article.content.find(c => c.type === 'steps');
    return stepsSection?.steps || [];
  }, [article]);

  // Navigation handlers for step-by-step mode
  const goToNextStep = useCallback(() => {
    if (currentStepIndex < allSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, allSteps.length]);

  const goToPrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const enterStepByStepMode = useCallback((startIndex = 0) => {
    setCurrentStepIndex(startIndex);
    setIsStepByStepMode(true);
  }, []);

  const exitStepByStepMode = useCallback(() => {
    setIsStepByStepMode(false);
    setCurrentStepIndex(0);
  }, []);

  // Keyboard navigation for step-by-step mode
  React.useEffect(() => {
    if (!isStepByStepMode) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextStep();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevStep();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        exitStepByStepMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStepByStepMode, goToNextStep, goToPrevStep, exitStepByStepMode]);

  if (!article) return null;

  // Map screenshot text to image filename
  const getScreenshotImage = (screenshotText) => {
    const mapping = {
      "Sidebar with Users menu highlighted": "sidebar-users-menu.svg",
      "Add User button highlighted": "add-user-button.svg",
      "Add User form with fields highlighted": "add-user-form.svg",
      "Policy selection dropdown": "policy-selection-dropdown.svg",
      "Date picker fields": "date-picker-fields.svg",
      "Success notification": "success-notification.svg",
      "User form modal": "user-form-modal.svg",
      "Policy dropdowns": "policy-dropdowns.svg",
      "Policy summary": "policy-summary.svg",
      "Device Management page": "device-management-page.svg",
      "Register Device button": "register-device-button.svg",
      "MAC address field": "mac-address-field.svg",
      "Device type dropdown": "device-type-dropdown.svg",
      "Registration mode selection": "registration-mode-selection.svg",
      "Device name field": "device-name-field.svg",
      "Success confirmation": "success-confirmation.svg",
      "Reports navigation": "reports-navigation.svg",
      "Report categories": "report-categories.svg",
      "Report card": "report-card.svg",
      "Criteria form": "criteria-form.svg",
      "Report preview": "report-preview.svg",
      "Export buttons": "export-buttons.svg",
      "User status badge": "user-status-badge.svg",
      "User policy details": "user-policy-details.svg",
      "Device list": "device-list.svg",
      "License ring": "license-ring.svg",
      "Reset password button": "reset-password-button.svg",
      "Download Template button in toolbar": "download-template-button.svg",
      "Sample CSV file with data": "sample-csv-file.svg",
      "Import Users dialog with file selector": "import-users-dialog.svg",
      "Validation results showing success/error counts": "validation-results.svg",
      "Import confirmation dialog with user count": "import-confirmation-dialog.svg",
      "User search bar with filters": "user-search-bar.svg",
      "User row with actions menu highlighted": "user-row-actions-menu.svg",
      "Actions dropdown menu": "actions-dropdown-menu.svg",
      "Confirmation dialog for status change": "confirmation-dialog-status.svg",
      "User list showing updated status badge": "user-list-updated-status.svg",
      "User row with actions menu": "user-row-actions.svg",
      "Reset Password option highlighted": "reset-password-option.svg",
      "Password reset method selection": "password-reset-method.svg",
      "Password reset success message": "password-reset-success.svg",
      "Sidebar with Configuration menu expanded": "sidebar-configuration-menu.svg",
      "Create New Policy button highlighted": "create-policy-button.svg",
      "Policy name input field": "policy-name-input.svg",
      "Speed limit dropdown": "speed-limit-dropdown.svg",
      "Data volume selector": "data-volume-selector.svg",
      "Device limit slider": "device-limit-slider.svg",
      "Data cycle type options": "data-cycle-type-options.svg",
      "Network Settings page": "network-settings-page.svg",
      "Device restriction settings": "device-restriction-settings.svg",
      "License capacity configuration": "license-capacity-config.svg",
      "Access control panel": "access-control-panel.svg",
      "Performance settings panel": "performance-settings-panel.svg",
      "Save confirmation dialog": "save-confirmation-dialog.svg"
    };

    return mapping[screenshotText] || null;
  };

  const handleScreenshotClick = (screenshot) => {
    const cleanText = screenshot.replace(/^\[Screenshot:\s*/, '').replace(/\]$/, '');
    const imageName = getScreenshotImage(cleanText);

    if (imageName) {
      const imagePath = require(`@assets/images/knowledge-center/${imageName}`);
      setLightboxImage({
        src: imagePath,
        alt: cleanText
      });
    }
  };

  const handleCloseLightbox = () => {
    setLightboxImage(null);
  };

  const generatePDFContent = () => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${article.title} - WiFi Portal Knowledge Center</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(135deg, #204094 0%, #3a5bb8 100%);
            color: white;
            padding: 30px;
            margin: -40px -40px 30px -40px;
            border-radius: 0;
          }
          .header-meta {
            font-size: 12px;
            opacity: 0.9;
            margin-bottom: 15px;
          }
          .header-category {
            display: inline-block;
            background: rgba(255, 255, 255, 0.25);
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
          }
          .header-title {
            font-size: 28px;
            font-weight: 700;
            margin: 10px 0 0 0;
          }
          .intro-section {
            background: #f8faff;
            border-left: 4px solid #204094;
            padding: 20px;
            margin: 25px 0;
            border-radius: 6px;
          }
          .section-heading {
            font-size: 20px;
            font-weight: 700;
            color: #1a2942;
            margin: 30px 0 15px 0;
            border-bottom: 2px solid #e8eef5;
            padding-bottom: 8px;
          }
          .step-item {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #e8eef5;
            border-radius: 8px;
            page-break-inside: avoid;
          }
          .step-number {
            width: 35px;
            height: 35px;
            background: #204094;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            flex-shrink: 0;
          }
          .step-content {
            flex: 1;
          }
          .step-title {
            font-weight: 700;
            font-size: 16px;
            margin-bottom: 8px;
            color: #1a2942;
          }
          .step-description {
            font-size: 14px;
            color: #4a5568;
            line-height: 1.6;
            white-space: pre-line;
          }
          .screenshot-note {
            margin-top: 10px;
            padding: 10px;
            background: #f8faff;
            border: 1px dashed #cbd5e0;
            border-radius: 6px;
            font-size: 12px;
            color: #718096;
            font-style: italic;
          }
          .tip-item {
            background: #f0fdf4;
            border-left: 3px solid #22c55e;
            padding: 12px 15px;
            margin-bottom: 10px;
            border-radius: 5px;
            font-size: 14px;
            color: #166534;
            page-break-inside: avoid;
          }
          .tip-item::before {
            content: "✓ ";
            font-weight: 700;
            color: #22c55e;
          }
          .troubleshooting-item {
            background: #fffbeb;
            border-left: 3px solid #f59e0b;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 6px;
            page-break-inside: avoid;
          }
          .issue-label {
            background: #f59e0b;
            color: white;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            display: inline-block;
            margin-bottom: 8px;
          }
          .issue-text {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 10px;
          }
          .solution-label {
            font-weight: 700;
            color: #92400e;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .solution-text {
            color: #78350f;
            font-size: 14px;
            white-space: pre-line;
          }
          .section-item {
            padding: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            margin-bottom: 12px;
            page-break-inside: avoid;
          }
          .item-name {
            font-weight: 700;
            font-size: 15px;
            color: #1a2942;
            margin-bottom: 8px;
          }
          .item-description {
            font-size: 14px;
            color: #4a5568;
            white-space: pre-line;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e8eef5;
            font-size: 11px;
            color: #666;
          }
          .disclaimer {
            background: #f8faff;
            padding: 15px;
            border-radius: 6px;
            margin-top: 15px;
            font-style: italic;
            line-height: 1.6;
          }
          @media print {
            body { padding: 20px; }
            .header { margin: -20px -20px 20px -20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-meta">WiFi Management Portal - Knowledge Center</div>
          <div class="header-category">${article.category}</div>
          <div class="header-title">${article.title}</div>
        </div>
    `;

    // Add content
    article.content.forEach(item => {
      if (item.type === 'intro') {
        htmlContent += `
          <div class="intro-section">
            ${item.text}
          </div>
        `;
      } else if (item.type === 'steps') {
        htmlContent += `<h2 class="section-heading">${item.title}</h2>`;
        item.steps.forEach(step => {
          htmlContent += `
            <div class="step-item">
              <div class="step-number">${step.number}</div>
              <div class="step-content">
                <div class="step-title">${step.title}</div>
                <div class="step-description">${step.description}</div>
                ${step.screenshot ? `<div class="screenshot-note">${step.screenshot}</div>` : ''}
              </div>
            </div>
          `;
        });
      } else if (item.type === 'tips') {
        htmlContent += `<h2 class="section-heading">${item.title}</h2>`;
        item.items.forEach(tip => {
          htmlContent += `<div class="tip-item">${tip}</div>`;
        });
      } else if (item.type === 'troubleshooting') {
        htmlContent += `<h2 class="section-heading">${item.title}</h2>`;
        item.items.forEach(issue => {
          htmlContent += `
            <div class="troubleshooting-item">
              <div class="issue-label">Issue</div>
              <div class="issue-text">${issue.issue}</div>
              <div class="solution-label">Solution</div>
              <div class="solution-text">${issue.solution}</div>
            </div>
          `;
        });
      } else if (item.type === 'section') {
        htmlContent += `<h2 class="section-heading">${item.title}</h2>`;
        item.items.forEach(sectionItem => {
          htmlContent += `
            <div class="section-item">
              <div class="item-name">${sectionItem.name}</div>
              <div class="item-description">${sectionItem.description || sectionItem.solution || ''}</div>
            </div>
          `;
        });
      }
    });

    // Add footer
    htmlContent += `
        <div class="footer">
          <div><strong>Document Information</strong></div>
          <div>Generated: ${currentDate}</div>
          <div>Category: ${article.category}</div>
          <div>Article: ${article.title}</div>

          <div class="disclaimer">
            <strong>Disclaimer:</strong> This document is for internal use only. The information contained herein is proprietary
            and confidential. Unauthorized distribution is prohibited. All procedures described should be performed
            by authorized personnel only. For technical support or clarification, contact your system administrator.
          </div>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  };

  const handleExportPDF = () => {
    const htmlContent = generatePDFContent();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Open in new window for printing to PDF
    const printWindow = window.open(url, '_blank');

    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 100);
        }, 250);
      };
    }
  };

  const renderContent = (contentItem, index) => {
    switch (contentItem.type) {
      case 'intro':
        return (
          <div key={index} className="article-intro">
            <FaBook className="intro-icon" />
            <p>{contentItem.text}</p>
          </div>
        );

      case 'steps':
        return (
          <div key={index} className="article-steps">
            <div className="section-heading-row">
              <h3 className="section-heading">{contentItem.title}</h3>
              {contentItem.steps.length > 0 && (
                <button
                  className="step-by-step-btn"
                  onClick={() => enterStepByStepMode(0)}
                  title="View step-by-step with larger screenshots"
                >
                  <FaChevronRight className="step-btn-icon" />
                  Step-by-Step View
                </button>
              )}
            </div>
            <div className="steps-container">
              {contentItem.steps.map((step, stepIdx) => (
                <div
                  key={step.number}
                  className="step-item clickable-step"
                  onClick={() => enterStepByStepMode(stepIdx)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && enterStepByStepMode(stepIdx)}
                >
                  <div className="step-number">{step.number}</div>
                  <div className="step-content">
                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-description">{step.description}</p>
                    {step.screenshot && (() => {
                      const cleanText = step.screenshot.replace(/^\[Screenshot:\s*/, '').replace(/\]$/, '');
                      const imageName = getScreenshotImage(cleanText);
                      let imageSrc = null;

                      try {
                        if (imageName) {
                          imageSrc = require(`@assets/images/knowledge-center/${imageName}`);
                        }
                      } catch (e) {
                        // Image not found, will show text placeholder
                      }

                      return (
                        <div
                          className="screenshot-placeholder clickable"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScreenshotClick(step.screenshot);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => {
                            e.stopPropagation();
                            e.key === 'Enter' && handleScreenshotClick(step.screenshot);
                          }}
                          aria-label="Click to view screenshot"
                        >
                          {imageSrc ? (
                            <img src={imageSrc} alt={cleanText} className="screenshot-thumbnail" />
                          ) : (
                            <>
                              <span className="screenshot-icon">📷</span>
                              <span className="screenshot-text">{step.screenshot}</span>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="step-expand-hint">
                    <FaChevronRight />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tips':
        return (
          <div key={index} className="article-tips">
            <h3 className="section-heading">
              <FaLightbulb className="section-icon" />
              {contentItem.title}
            </h3>
            <ul className="tips-list">
              {contentItem.items.map((tip, i) => (
                <li key={i} className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'troubleshooting':
        return (
          <div key={index} className="article-troubleshooting">
            <h3 className="section-heading">
              <FaExclamationTriangle className="section-icon" />
              {contentItem.title}
            </h3>
            <div className="troubleshooting-list">
              {contentItem.items.map((item, i) => (
                <div key={i} className="troubleshooting-item">
                  <div className="issue-header">
                    <span className="issue-label">Issue:</span>
                    <span className="issue-text">{item.issue}</span>
                  </div>
                  <div className="solution-content">
                    <span className="solution-label">Solution:</span>
                    <span className="solution-text">{item.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'section':
        return (
          <div key={index} className="article-section">
            <h3 className="section-heading">{contentItem.title}</h3>
            <div className="section-items">
              {contentItem.items.map((item, i) => (
                <div key={i} className="section-item">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-description" style={{ whiteSpace: 'pre-line' }}>
                    {item.description || item.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render step-by-step fullscreen mode using React Portal for proper z-index
  const renderStepByStepMode = () => {
    if (!allSteps.length) return null;
    const currentStep = allSteps[currentStepIndex];
    const cleanText = currentStep.screenshot?.replace(/^\[Screenshot:\s*/, '').replace(/\]$/, '') || '';
    const imageName = getScreenshotImage(cleanText);
    let imageSrc = null;

    try {
      if (imageName) {
        imageSrc = require(`@assets/images/knowledge-center/${imageName}`);
      }
    } catch (e) {
      // Image not found
    }

    // Use React Portal to render at document body level, bypassing all stacking contexts
    return ReactDOM.createPortal(
      <div className="step-by-step-overlay" onClick={exitStepByStepMode}>
        <div className="step-by-step-container" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="step-by-step-header">
            <div className="step-by-step-header-left">
              <button
                className="step-back-to-overview"
                onClick={exitStepByStepMode}
                title="Back to overview"
              >
                <FaList />
                <span>Overview</span>
              </button>
              <span className="step-by-step-title">{article.title}</span>
            </div>
            <div className="step-by-step-header-right">
              <span className="step-counter">
                Step {currentStepIndex + 1} of {allSteps.length}
              </span>
              <button
                className="step-close-btn"
                onClick={exitStepByStepMode}
                aria-label="Exit step-by-step mode"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="step-by-step-content">
            {/* Left Navigation Arrow */}
            <button
              className={`step-nav-arrow step-nav-prev ${currentStepIndex === 0 ? 'disabled' : ''}`}
              onClick={goToPrevStep}
              disabled={currentStepIndex === 0}
              aria-label="Previous step"
            >
              <FaChevronLeft />
            </button>

            {/* Step Content */}
            <div className="step-by-step-main">
              {/* Step Info */}
              <div className="step-by-step-info">
                <div className="step-by-step-number">{currentStep.number}</div>
                <div className="step-by-step-text">
                  <h2 className="step-by-step-step-title">{currentStep.title}</h2>
                  <p className="step-by-step-description">{currentStep.description}</p>
                </div>
              </div>

              {/* Large Screenshot Area */}
              <div className="step-by-step-screenshot">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={cleanText}
                    className="step-by-step-image"
                    onClick={() => handleScreenshotClick(currentStep.screenshot)}
                  />
                ) : currentStep.screenshot ? (
                  <div className="step-by-step-placeholder">
                    <span className="placeholder-icon">📷</span>
                    <span className="placeholder-text">{currentStep.screenshot}</span>
                    <span className="placeholder-hint">Screenshot placeholder</span>
                  </div>
                ) : (
                  <div className="step-by-step-no-image">
                    <span>No screenshot for this step</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Navigation Arrow */}
            <button
              className={`step-nav-arrow step-nav-next ${currentStepIndex === allSteps.length - 1 ? 'disabled' : ''}`}
              onClick={goToNextStep}
              disabled={currentStepIndex === allSteps.length - 1}
              aria-label="Next step"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="step-by-step-progress">
            {allSteps.map((_, idx) => (
              <button
                key={idx}
                className={`progress-dot ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'completed' : ''}`}
                onClick={() => setCurrentStepIndex(idx)}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="step-by-step-footer">
            <span className="step-keyboard-hint">
              Use ← → arrow keys to navigate • Press ESC to exit
            </span>
            {currentStepIndex === allSteps.length - 1 && (
              <button className="step-finish-btn" onClick={exitStepByStepMode}>
                <FaCheckCircle />
                <span>Done</span>
              </button>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
    {isStepByStepMode && allSteps.length > 0 ? (
      renderStepByStepMode()
    ) : (
    <Modal onClose={onClose}>
      <div className="knowledge-article-modal">
        <div className="article-header">
          <button
            className="article-back-btn"
            onClick={onClose}
            aria-label="Back to Knowledge Center"
            title="Back to Knowledge Center"
          >
            <FaArrowLeft />
          </button>
          <div className="article-header-content">
            <span className="article-category">{article.category}</span>
            <h2 className="article-title">{article.title}</h2>
          </div>
          <button
            className="article-close-btn"
            onClick={onClose}
            aria-label="Close article"
          >
            <FaTimes />
          </button>
        </div>

        <div className="article-body">
          {article.content.map((contentItem, index) => renderContent(contentItem, index))}
        </div>

        <div className="article-footer">
          <button className="article-footer-btn secondary" onClick={handleExportPDF}>
            <FaFilePdf style={{ marginRight: '6px' }} />
            Export to PDF
          </button>
          <button className="article-footer-btn primary" onClick={onClose}>
            <FaCheckCircle style={{ marginRight: '6px' }} />
            Got it!
          </button>
        </div>
      </div>

    </Modal>
    )}
    {lightboxImage && (
      <ImageLightbox
        imageSrc={lightboxImage.src}
        imageAlt={lightboxImage.alt}
        onClose={handleCloseLightbox}
      />
    )}
    </>
  );
};

export default KnowledgeArticleModal;
