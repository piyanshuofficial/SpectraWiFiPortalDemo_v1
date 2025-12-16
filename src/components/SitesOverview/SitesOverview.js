// src/components/SitesOverview/SitesOverview.js

import React, { useState, useMemo } from 'react';
import { FaMapMarkerAlt, FaUsers, FaLaptop, FaExclamationTriangle, FaSearch, FaSort, FaSortUp, FaSortDown, FaChevronRight } from 'react-icons/fa';
import { useSegmentSites } from '../../hooks/useSegmentCompanyData';
import { useAccessLevelView } from '../../context/AccessLevelViewContext';
import Pagination from '../Pagination';
import './SitesOverview.css';

const SITES_PER_PAGE = 10;
const CARD_VIEW_THRESHOLD = 10;

const SitesOverview = () => {
  const { drillDownToSite } = useAccessLevelView();
  const { sites: segmentSites } = useSegmentSites();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('siteName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort sites - Now using segment-specific sites
  const filteredSites = useMemo(() => {
    let sites = [...segmentSites];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      sites = sites.filter(
        site =>
          site.siteName.toLowerCase().includes(term) ||
          site.city.toLowerCase().includes(term) ||
          site.siteId.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      sites = sites.filter(site => site.status === statusFilter);
    }

    // Apply sorting
    sites.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return sites;
  }, [segmentSites, searchTerm, sortField, sortDirection, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredSites.length / SITES_PER_PAGE);
  const paginatedSites = filteredSites.slice(
    (currentPage - 1) * SITES_PER_PAGE,
    currentPage * SITES_PER_PAGE
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const handleSiteClick = (site) => {
    drillDownToSite(site.siteId, site.siteName);
  };

  // Determine if we should show cards or list view
  const showCardsView = segmentSites.length <= CARD_VIEW_THRESHOLD;

  // Card View Component
  const SiteCard = ({ site }) => (
    <div
      className="site-card"
      onClick={() => handleSiteClick(site)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleSiteClick(site)}
      aria-label={`View ${site.siteName} details`}
    >
      <div className="site-card-header">
        <h3 className="site-card-name">{site.siteName}</h3>
        <span className={`site-status-badge ${site.status}`}>{site.status}</span>
      </div>
      <div className="site-card-location">
        <FaMapMarkerAlt />
        <span>{site.city}, {site.state}</span>
      </div>
      <div className="site-card-stats">
        <div className="site-stat">
          <FaUsers />
          <span className="stat-value">{site.totalUsers}</span>
          <span className="stat-label">Users</span>
        </div>
        <div className="site-stat">
          <FaLaptop />
          <span className="stat-value">{site.totalDevices}</span>
          <span className="stat-label">Devices</span>
        </div>
        <div className="site-stat">
          <span className="stat-value">{site.bandwidthUsage}%</span>
          <span className="stat-label">Bandwidth</span>
        </div>
      </div>
      {site.alerts > 0 && (
        <div className="site-card-alerts">
          <FaExclamationTriangle className={site.criticalAlerts > 0 ? 'critical' : 'warning'} />
          <span>{site.alerts} alert{site.alerts !== 1 ? 's' : ''}</span>
          {site.criticalAlerts > 0 && (
            <span className="critical-count">({site.criticalAlerts} critical)</span>
          )}
        </div>
      )}
      <div className="site-card-footer">
        <span className="site-card-last-activity">Last activity: {site.lastActivity}</span>
        <FaChevronRight className="site-card-arrow" />
      </div>
    </div>
  );

  // List View Component
  const SitesList = () => (
    <div className="sites-list-container">
      <div className="sites-list-toolbar">
        <div className="sites-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search sites"
          />
        </div>
        <div className="sites-filter">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="sites-table-wrapper">
        <table className="sites-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('siteName')} className="sortable">
                Site Name {getSortIcon('siteName')}
              </th>
              <th onClick={() => handleSort('city')} className="sortable">
                Location {getSortIcon('city')}
              </th>
              <th onClick={() => handleSort('totalUsers')} className="sortable">
                Users {getSortIcon('totalUsers')}
              </th>
              <th onClick={() => handleSort('totalDevices')} className="sortable">
                Devices {getSortIcon('totalDevices')}
              </th>
              <th onClick={() => handleSort('bandwidthUsage')} className="sortable">
                Bandwidth {getSortIcon('bandwidthUsage')}
              </th>
              <th onClick={() => handleSort('alerts')} className="sortable">
                Alerts {getSortIcon('alerts')}
              </th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSites.map((site) => (
              <tr
                key={site.siteId}
                onClick={() => handleSiteClick(site)}
                className="site-row"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleSiteClick(site)}
              >
                <td className="site-name-cell">
                  <strong>{site.siteName}</strong>
                  <span className="site-id">{site.siteId}</span>
                </td>
                <td>
                  <div className="location-cell">
                    <FaMapMarkerAlt />
                    <span>{site.city}, {site.state}</span>
                  </div>
                </td>
                <td>
                  <span className="users-count">{site.activeUsers}/{site.totalUsers}</span>
                </td>
                <td>
                  <span className="devices-count">{site.activeDevices}/{site.totalDevices}</span>
                </td>
                <td>
                  <div className="bandwidth-cell">
                    <div className="bandwidth-bar">
                      <div
                        className="bandwidth-fill"
                        style={{ width: `${site.bandwidthUsage}%` }}
                      />
                    </div>
                    <span>{site.bandwidthUsage}%</span>
                  </div>
                </td>
                <td>
                  {site.alerts > 0 ? (
                    <span className={`alerts-badge ${site.criticalAlerts > 0 ? 'critical' : 'warning'}`}>
                      {site.alerts}
                    </span>
                  ) : (
                    <span className="no-alerts">-</span>
                  )}
                </td>
                <td>
                  <span className={`site-status-badge ${site.status}`}>{site.status}</span>
                </td>
                <td>
                  <button
                    className="view-site-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSiteClick(site);
                    }}
                  >
                    View <FaChevronRight />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredSites.length}
          itemsPerPage={SITES_PER_PAGE}
          showItemsPerPage={false}
        />
      )}
    </div>
  );

  return (
    <div className="sites-overview">
      <div className="sites-overview-header">
        <h2>Your Sites</h2>
        <p className="sites-count">{segmentSites.length} sites in your organization</p>
      </div>

      {showCardsView ? (
        <div className="sites-cards-grid">
          {segmentSites.map((site) => (
            <SiteCard key={site.siteId} site={site} />
          ))}
        </div>
      ) : (
        <SitesList />
      )}
    </div>
  );
};

export default SitesOverview;
