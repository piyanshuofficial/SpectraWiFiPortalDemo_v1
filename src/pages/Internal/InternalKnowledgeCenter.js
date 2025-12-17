// src/pages/Internal/InternalKnowledgeCenter.js

import React, { useState, useMemo } from "react";
import {
  FaBookOpen,
  FaVideo,
  FaQuestionCircle,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaPlay,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";
import {
  internalKnowledgeArticles,
  internalVideoTutorials,
  internalFAQs,
  getInternalArticle,
} from "../../constants/internalKnowledgeData";
import "./InternalKnowledgeCenter.css";

// Section views
const SECTION_VIEWS = {
  HOME: "home",
  DOCUMENTATION: "documentation",
  VIDEOS: "videos",
  FAQ: "faq",
};

const InternalKnowledgeCenter = () => {
  const [currentView, setCurrentView] = useState(SECTION_VIEWS.HOME);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQs, setExpandedFAQs] = useState(new Set());
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Convert articles object to array
  const articlesArray = useMemo(() => {
    return Object.entries(internalKnowledgeArticles).map(([id, article]) => ({
      id,
      ...article,
    }));
  }, []);

  // Filter content based on search
  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articlesArray;
    const term = searchTerm.toLowerCase();
    return articlesArray.filter(
      (article) =>
        article.title.toLowerCase().includes(term) ||
        article.category.toLowerCase().includes(term)
    );
  }, [articlesArray, searchTerm]);

  const filteredVideos = useMemo(() => {
    if (!searchTerm) return internalVideoTutorials;
    const term = searchTerm.toLowerCase();
    return internalVideoTutorials.filter(
      (video) =>
        video.title.toLowerCase().includes(term) ||
        video.category.toLowerCase().includes(term) ||
        video.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredFAQs = useMemo(() => {
    if (!searchTerm) return internalFAQs;
    const term = searchTerm.toLowerCase();
    return internalFAQs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term) ||
        faq.category.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Random selection for preview
  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const previewArticles = useMemo(
    () => getRandomItems(articlesArray, 3),
    [articlesArray]
  );
  const previewVideos = useMemo(
    () => getRandomItems(internalVideoTutorials, 3),
    []
  );
  const previewFAQs = useMemo(() => getRandomItems(internalFAQs, 3), []);

  // Handle article click
  const handleArticleClick = (articleId) => {
    const article = getInternalArticle(articleId);
    if (article) {
      setSelectedArticle({ id: articleId, ...article });
    }
  };

  // Handle video click
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  // Toggle FAQ
  const toggleFAQ = (faqId) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFAQs(newExpanded);
  };

  // Navigate to section
  const handleSectionClick = (section) => {
    setCurrentView(section);
    setSearchTerm("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Back to home
  const handleBackToHome = () => {
    setCurrentView(SECTION_VIEWS.HOME);
    setSearchTerm("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render article content
  const renderArticleContent = (article) => {
    if (!article || !article.content) return null;

    return article.content.map((section, idx) => {
      switch (section.type) {
        case "intro":
          return (
            <p key={idx} className="article-intro">
              {section.text}
            </p>
          );

        case "steps":
          return (
            <div key={idx} className="article-steps">
              <h3>{section.title}</h3>
              <ol className="steps-list">
                {section.steps.map((step, stepIdx) => (
                  <li key={stepIdx} className="step-item">
                    <div className="step-number">{step.number}</div>
                    <div className="step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          );

        case "section":
          return (
            <div key={idx} className="article-section">
              <h3>{section.title}</h3>
              <div className="section-items">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="section-item">
                    <h4>{item.name}</h4>
                    <p>{item.description || item.solution}</p>
                  </div>
                ))}
              </div>
            </div>
          );

        case "tips":
          return (
            <div key={idx} className="article-tips">
              <h3>{section.title}</h3>
              <ul className="tips-list">
                {section.items.map((tip, tipIdx) => (
                  <li key={tipIdx}>{tip}</li>
                ))}
              </ul>
            </div>
          );

        case "troubleshooting":
          return (
            <div key={idx} className="article-troubleshooting">
              <h3>{section.title}</h3>
              <div className="troubleshooting-items">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="troubleshooting-item">
                    <div className="issue-label">Issue:</div>
                    <p className="issue-text">{item.issue}</p>
                    <div className="solution-label">Solution:</div>
                    <p className="solution-text">{item.solution}</p>
                  </div>
                ))}
              </div>
            </div>
          );

        default:
          return null;
      }
    });
  };

  return (
    <main className="internal-knowledge-main">
      <h1 className="internal-knowledge-title">Internal Knowledge Base</h1>

      {/* Search Row */}
      <div className="internal-search-row">
        <input
          type="text"
          className="internal-search-input"
          placeholder="Search documentation, videos, or FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="internal-search-btn">
          <FaSearch /> Search
        </button>
      </div>

      {/* Back Button */}
      {currentView !== SECTION_VIEWS.HOME && (
        <button className="internal-back-btn" onClick={handleBackToHome}>
          <FaArrowLeft /> Back to Knowledge Base
        </button>
      )}

      {/* Home View - Feature Cards */}
      {currentView === SECTION_VIEWS.HOME && (
        <div className="internal-feature-cards">
          <div
            className="internal-feature-card clickable"
            onClick={() => handleSectionClick(SECTION_VIEWS.DOCUMENTATION)}
          >
            <FaBookOpen className="feature-icon" />
            <div className="feature-title">Documentation</div>
            <div className="feature-desc">
              Technical guides, configuration manuals, and operational
              procedures
            </div>
          </div>
          <div
            className="internal-feature-card clickable"
            onClick={() => handleSectionClick(SECTION_VIEWS.VIDEOS)}
          >
            <FaVideo className="feature-icon" />
            <div className="feature-title">Video Tutorials</div>
            <div className="feature-desc">
              Step-by-step video guides for common tasks and procedures
            </div>
          </div>
          <div
            className="internal-feature-card clickable"
            onClick={() => handleSectionClick(SECTION_VIEWS.FAQ)}
          >
            <FaQuestionCircle className="feature-icon" />
            <div className="feature-title">FAQ</div>
            <div className="feature-desc">
              Quick answers to common questions and troubleshooting tips
            </div>
          </div>
        </div>
      )}

      {/* Home View - Preview Sections */}
      {currentView === SECTION_VIEWS.HOME && (
        <>
          {/* Search Results Summary */}
          {searchTerm && (
            <div className="search-results-summary">
              <p className="search-results-text">
                Found {filteredArticles.length} articles, {filteredVideos.length}{" "}
                videos, and {filteredFAQs.length} FAQs matching "{searchTerm}"
              </p>
            </div>
          )}

          {/* Documentation Preview */}
          {(searchTerm ? filteredArticles.length > 0 : true) && (
            <div className="preview-section">
              <div className="preview-section-header">
                <h2 className="preview-section-title">
                  Documentation
                  {searchTerm && ` (${filteredArticles.length})`}
                </h2>
                <button
                  className="view-all-btn"
                  onClick={() => handleSectionClick(SECTION_VIEWS.DOCUMENTATION)}
                >
                  View All →
                </button>
              </div>
              <div className="preview-cards-grid">
                {(searchTerm ? filteredArticles.slice(0, 6) : previewArticles).map(
                  (article, idx) => (
                    <div
                      key={`${article.id}-${idx}`}
                      className="preview-card clickable"
                      onClick={() => handleArticleClick(article.id)}
                    >
                      <span className="preview-card-category">
                        {article.category}
                      </span>
                      <h3 className="preview-card-title">{article.title}</h3>
                      <p className="preview-card-description">
                        {article.content[0]?.text?.substring(0, 120)}...
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Video Tutorials Preview */}
          {(searchTerm ? filteredVideos.length > 0 : true) && (
            <div className="preview-section">
              <div className="preview-section-header">
                <h2 className="preview-section-title">
                  Video Tutorials
                  {searchTerm && ` (${filteredVideos.length})`}
                </h2>
                <button
                  className="view-all-btn"
                  onClick={() => handleSectionClick(SECTION_VIEWS.VIDEOS)}
                >
                  View All →
                </button>
              </div>
              <div className="preview-cards-grid">
                {(searchTerm ? filteredVideos.slice(0, 6) : previewVideos).map(
                  (video, idx) => (
                    <div
                      key={`${video.id}-${idx}`}
                      className="preview-card video-preview clickable"
                      onClick={() => handleVideoClick(video)}
                    >
                      <div className="preview-video-thumbnail">
                        <div className="preview-video-icon">
                          <FaPlay />
                        </div>
                        <span className="preview-video-duration">
                          {video.duration}
                        </span>
                      </div>
                      <span className="preview-card-category">
                        {video.category}
                      </span>
                      <h3 className="preview-card-title">{video.title}</h3>
                      <p className="preview-card-description">
                        {video.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* FAQ Preview */}
          {(searchTerm ? filteredFAQs.length > 0 : true) && (
            <div className="preview-section">
              <div className="preview-section-header">
                <h2 className="preview-section-title">
                  Frequently Asked Questions
                  {searchTerm && ` (${filteredFAQs.length})`}
                </h2>
                <button
                  className="view-all-btn"
                  onClick={() => handleSectionClick(SECTION_VIEWS.FAQ)}
                >
                  View All →
                </button>
              </div>
              <div className="preview-faq-list">
                {(searchTerm ? filteredFAQs.slice(0, 6) : previewFAQs).map(
                  (faq, idx) => (
                    <div
                      key={`${faq.id}-${idx}`}
                      className="preview-faq-item clickable"
                      onClick={() => {
                        handleSectionClick(SECTION_VIEWS.FAQ);
                        setExpandedFAQs(new Set([faq.id]));
                      }}
                    >
                      <span className="preview-faq-category">{faq.category}</span>
                      <h3 className="preview-faq-question">{faq.question}</h3>
                      <p className="preview-faq-answer-snippet">
                        {faq.answer.substring(0, 120)}...
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* No results */}
          {searchTerm &&
            filteredArticles.length === 0 &&
            filteredVideos.length === 0 &&
            filteredFAQs.length === 0 && (
              <div className="no-search-results">
                <h3>No results found for "{searchTerm}"</h3>
                <p>Try different keywords or browse the sections above</p>
              </div>
            )}
        </>
      )}

      {/* Documentation Section View */}
      {currentView === SECTION_VIEWS.DOCUMENTATION && (
        <>
          <h2 className="section-view-title">Technical Documentation</h2>
          {searchTerm && (
            <p className="search-results-text">
              Found {filteredArticles.length} articles matching "{searchTerm}"
            </p>
          )}

          {/* Organize by category */}
          {["Site Configuration", "Operations", "Troubleshooting"].map(
            (category) => {
              const categoryArticles = filteredArticles.filter(
                (a) => a.category === category
              );
              if (categoryArticles.length === 0) return null;

              return (
                <div key={category} className="internal-block">
                  <div className="block-title">{category}</div>
                  {categoryArticles.map((article, idx) => (
                    <div
                      key={`${article.id}-${idx}`}
                      className="block-entry clickable"
                      onClick={() => handleArticleClick(article.id)}
                    >
                      <b>{article.title}</b>
                      <br />
                      {article.content[0]?.text?.substring(0, 150)}...
                    </div>
                  ))}
                </div>
              );
            }
          )}

          {filteredArticles.length === 0 && (
            <div className="no-search-results">
              <h3>No articles found</h3>
              <p>Try different keywords</p>
            </div>
          )}
        </>
      )}

      {/* Video Tutorials Section View */}
      {currentView === SECTION_VIEWS.VIDEOS && (
        <>
          <h2 className="section-view-title">Video Tutorials</h2>
          {searchTerm && (
            <p className="search-results-text">
              Found {filteredVideos.length} videos
            </p>
          )}
          <div className="video-tutorials-grid">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="video-tutorial-card"
                onClick={() => handleVideoClick(video)}
              >
                <div className="video-thumbnail">
                  <div className="video-placeholder-icon">
                    <FaPlay />
                  </div>
                  <span className="video-duration">{video.duration}</span>
                </div>
                <div className="video-content">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-category">{video.category}</p>
                  <p className="video-description">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
          {filteredVideos.length === 0 && (
            <div className="no-search-results">
              <h3>No videos found</h3>
              <p>Try different keywords</p>
            </div>
          )}
        </>
      )}

      {/* FAQ Section View */}
      {currentView === SECTION_VIEWS.FAQ && (
        <>
          <h2 className="section-view-title">Frequently Asked Questions</h2>
          {searchTerm && (
            <p className="search-results-text">
              Found {filteredFAQs.length} questions
            </p>
          )}
          <div className="faq-container">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className={`faq-item ${expandedFAQs.has(faq.id) ? "expanded" : ""}`}
              >
                <div className="faq-question" onClick={() => toggleFAQ(faq.id)}>
                  <span className="faq-category-badge">{faq.category}</span>
                  <h3>{faq.question}</h3>
                  {expandedFAQs.has(faq.id) ? (
                    <FaChevronUp className="faq-icon" />
                  ) : (
                    <FaChevronDown className="faq-icon" />
                  )}
                </div>
                {expandedFAQs.has(faq.id) && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {filteredFAQs.length === 0 && (
            <div className="no-search-results">
              <h3>No FAQs found</h3>
              <p>Try different keywords</p>
            </div>
          )}
        </>
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <div
          className="article-modal-overlay"
          onClick={() => setSelectedArticle(null)}
        >
          <div className="article-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedArticle(null)}
            >
              <FaTimes />
            </button>
            <div className="article-modal-header">
              <h2>{selectedArticle.title}</h2>
              <span className="article-modal-category">
                {selectedArticle.category}
              </span>
            </div>
            <div className="article-modal-content">
              {renderArticleContent(selectedArticle)}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="video-modal-overlay"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-modal-close"
              onClick={() => setSelectedVideo(null)}
            >
              <FaTimes />
            </button>
            <h2>{selectedVideo.title}</h2>
            <div className="video-player-placeholder">
              <FaPlay style={{ fontSize: "4rem", marginBottom: "1rem" }} />
              <p>Video: {selectedVideo.title}</p>
              <p className="video-note">Duration: {selectedVideo.duration}</p>
            </div>
            <div className="video-modal-info">
              <p>
                <strong>Category:</strong> {selectedVideo.category}
              </p>
              <p>
                <strong>Duration:</strong> {selectedVideo.duration}
              </p>
              <p>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default InternalKnowledgeCenter;
