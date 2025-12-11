// src/pages/Internal/BulkOperations/BulkDeviceRename.js

import React, { useState, useEffect, useMemo } from 'react';
import {
  FaTimes,
  FaEdit,
  FaSearch,
  FaCheckCircle,
  FaInfoCircle,
} from 'react-icons/fa';
import Button from '@components/Button';
import Badge from '@components/Badge';
import './BulkOperationModals.css';

// Sample device data
const sampleDevices = [
  { id: 'DEV001', name: 'Johns-Laptop', mac: 'AA:BB:CC:DD:EE:01', userId: 'USER001', category: 'Human' },
  { id: 'DEV002', name: 'Smart-TV', mac: 'AA:BB:CC:DD:EE:02', userId: 'USER001', category: 'Other' },
  { id: 'DEV003', name: 'Mobile-Phone', mac: 'AA:BB:CC:DD:EE:03', userId: 'USER002', category: 'Human' },
  { id: 'DEV004', name: 'IP-Camera', mac: 'AA:BB:CC:DD:EE:04', userId: 'USER003', category: 'Other' },
  { id: 'DEV005', name: 'Work-Desktop', mac: 'AA:BB:CC:DD:EE:05', userId: 'USER004', category: 'Human' },
  { id: 'DEV006', name: 'Printer', mac: 'AA:BB:CC:DD:EE:06', userId: 'USER004', category: 'Other' },
];

/**
 * BulkDeviceRename - Modal for bulk device renaming with patterns
 */
const BulkDeviceRename = ({ isOpen, onClose }) => {
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [namingPattern, setNamingPattern] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter devices based on search
  const filteredDevices = useMemo(() => {
    if (!searchTerm) return sampleDevices;
    const term = searchTerm.toLowerCase();
    return sampleDevices.filter(
      (device) =>
        device.name?.toLowerCase().includes(term) ||
        device.id?.toLowerCase().includes(term) ||
        device.mac?.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedDevices([]);
      setSearchTerm('');
      setNamingPattern('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const toggleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map((d) => d.id));
    }
  };

  const toggleDevice = (deviceId) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  // Generate preview of renamed devices
  const getPreviewName = (device, index) => {
    if (!namingPattern) return device.name;
    return namingPattern
      .replace('{n}', String(index + 1).padStart(2, '0'))
      .replace('{id}', device.id)
      .replace('{category}', device.category)
      .replace('{userId}', device.userId);
  };

  const handleExecute = async () => {
    if (selectedDevices.length === 0 || !namingPattern) return;

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const renamedDevices = selectedDevices.map((id, idx) => {
        const device = sampleDevices.find((d) => d.id === id);
        return { id, newName: getPreviewName(device, idx) };
      });
      console.log('Renaming devices:', renamedDevices);
      onClose();
    } catch (err) {
      console.error('Operation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bulk-modal-overlay" onClick={onClose}>
      <div
        className="bulk-modal-content bulk-modal-content--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bulk-modal-header bulk-modal-header--info">
          <h2 className="bulk-modal-title">
            <FaEdit /> Bulk Device Rename
          </h2>
          <button className="bulk-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="bulk-modal-body">
          {/* Naming Pattern */}
          <div className="bulk-pattern-section">
            <label htmlFor="namingPattern">Naming Pattern *</label>
            <input
              type="text"
              id="namingPattern"
              value={namingPattern}
              onChange={(e) => setNamingPattern(e.target.value)}
              placeholder="e.g., Floor1-{category}-{n}"
              className="pattern-input"
            />
            <div className="pattern-help">
              <FaInfoCircle />
              <span>
                Variables: <code>{'{n}'}</code> (sequential number),{' '}
                <code>{'{id}'}</code> (device ID), <code>{'{category}'}</code>,{' '}
                <code>{'{userId}'}</code>
              </span>
            </div>
          </div>

          {/* Search and Selection */}
          <div className="bulk-search-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="selection-info">
              <span>{selectedDevices.length} selected</span>
              <Button
                variant="secondary"
                size="small"
                onClick={toggleSelectAll}
              >
                {selectedDevices.length === filteredDevices.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
            </div>
          </div>

          {/* Device List */}
          <div className="bulk-device-list">
            {filteredDevices.map((device, index) => {
              const isSelected = selectedDevices.includes(device.id);
              const selectedIndex = selectedDevices.indexOf(device.id);
              const previewName =
                isSelected && namingPattern
                  ? getPreviewName(device, selectedIndex)
                  : null;

              return (
                <div
                  key={device.id}
                  className={`device-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleDevice(device.id)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleDevice(device.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="device-info">
                    <span className="device-name">
                      {device.name}
                      {previewName && previewName !== device.name && (
                        <span className="rename-preview"> → {previewName}</span>
                      )}
                    </span>
                    <span className="device-mac">{device.mac}</span>
                  </div>
                  <Badge
                    variant={device.category === 'Human' ? 'primary' : 'secondary'}
                    size="small"
                  >
                    {device.category}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bulk-modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExecute}
            disabled={selectedDevices.length === 0 || !namingPattern || isProcessing}
            loading={isProcessing}
          >
            <FaCheckCircle /> Rename {selectedDevices.length} Devices
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkDeviceRename;
