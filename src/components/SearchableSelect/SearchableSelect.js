// src/components/SearchableSelect/SearchableSelect.js

/**
 * SearchableSelect Component
 * A searchable dropdown with filtering capability for large datasets
 * Supports custom rendering, icons, and keyboard navigation
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { FaSearch, FaTimes, FaChevronDown } from 'react-icons/fa';
import './SearchableSelect.css';

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  icon: Icon,
  label,
  disabled = false,
  required = false,
  renderOption,
  getOptionLabel = (opt) => opt?.label || opt?.name || String(opt),
  getOptionValue = (opt) => opt?.value || opt?.id || opt,
  allowClear = true,
  size = 'medium', // 'small', 'medium', 'large'
  className = '',
  dropdownPosition = 'bottom', // 'bottom', 'top', 'auto'
  maxDropdownHeight = 280,
  noResultsText = 'No results found',
  loadingText = 'Loading...',
  isLoading = false,
  groupBy, // Function to group options: (option) => groupKey
  emptyOption, // { label: 'All', value: '' } - optional empty/default option
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef(null);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    let filtered = options;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = options.filter(option => {
        const label = getOptionLabel(option).toLowerCase();
        return label.includes(query);
      });
    }

    return filtered;
  }, [options, searchQuery, getOptionLabel]);

  // Group options if groupBy is provided
  const groupedOptions = useMemo(() => {
    if (!groupBy) return null;

    const groups = {};
    filteredOptions.forEach(option => {
      const groupKey = groupBy(option) || 'Other';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(option);
    });

    return groups;
  }, [filteredOptions, groupBy]);

  // Get flat list of options for keyboard navigation
  const flatOptions = useMemo(() => {
    if (emptyOption) {
      return [emptyOption, ...filteredOptions];
    }
    return filteredOptions;
  }, [filteredOptions, emptyOption]);

  // Get selected option
  const selectedOption = useMemo(() => {
    if (emptyOption && value === emptyOption.value) {
      return emptyOption;
    }
    return options.find(opt => getOptionValue(opt) === value);
  }, [options, value, getOptionValue, emptyOption]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current) {
      const optionElements = optionsRef.current.querySelectorAll('.searchable-select-option');
      if (optionElements[highlightedIndex]) {
        optionElements[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = useCallback((option) => {
    const optValue = option === emptyOption ? emptyOption.value : getOptionValue(option);
    onChange(optValue);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  }, [onChange, getOptionValue, emptyOption]);

  const handleClear = useCallback((e) => {
    e.stopPropagation();
    onChange(emptyOption?.value || '');
    setSearchQuery('');
  }, [onChange, emptyOption]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < flatOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : flatOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && flatOptions[highlightedIndex]) {
          handleSelect(flatOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchQuery('');
        break;
      default:
        break;
    }
  }, [isOpen, highlightedIndex, flatOptions, handleSelect]);

  const toggleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
      if (!isOpen) {
        setHighlightedIndex(-1);
      }
    }
  }, [disabled, isOpen]);

  const renderOptionItem = (option, index, isEmptyOpt = false) => {
    const optValue = isEmptyOpt ? option.value : getOptionValue(option);
    const isSelected = optValue === value;
    const isHighlighted = index === highlightedIndex;

    return (
      <div
        key={optValue || 'empty'}
        className={`searchable-select-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
        onClick={() => handleSelect(option)}
        onMouseEnter={() => setHighlightedIndex(index)}
        role="option"
        aria-selected={isSelected}
      >
        {isEmptyOpt ? (
          <span className="empty-option-label">{option.label}</span>
        ) : renderOption ? (
          renderOption(option)
        ) : (
          getOptionLabel(option)
        )}
      </div>
    );
  };

  const sizeClass = `size-${size}`;

  return (
    <div
      className={`searchable-select ${sizeClass} ${className} ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label className="searchable-select-label">
          {Icon && <Icon className="label-icon" />}
          <span>{label}</span>
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <div
        className={`searchable-select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={toggleOpen}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="searchable-select-listbox"
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <span className={`searchable-select-value ${!selectedOption ? 'placeholder' : ''}`}>
          {selectedOption ? (
            selectedOption === emptyOption ? emptyOption.label : getOptionLabel(selectedOption)
          ) : placeholder}
        </span>
        <div className="searchable-select-icons">
          {allowClear && selectedOption && !disabled && value !== emptyOption?.value && (
            <button
              className="searchable-select-clear"
              onClick={handleClear}
              type="button"
              aria-label="Clear selection"
              tabIndex={-1}
            >
              <FaTimes />
            </button>
          )}
          <FaChevronDown className={`searchable-select-arrow ${isOpen ? 'open' : ''}`} />
        </div>
      </div>

      {isOpen && !disabled && (
        <div
          className={`searchable-select-dropdown position-${dropdownPosition}`}
          style={{ maxHeight: maxDropdownHeight + 60 }} // Extra space for search
        >
          <div className="searchable-select-search">
            <FaSearch className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHighlightedIndex(emptyOption ? 0 : -1);
              }}
              onClick={(e) => e.stopPropagation()}
              aria-label="Search options"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                  inputRef.current?.focus();
                }}
                type="button"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div
            className="searchable-select-options"
            ref={optionsRef}
            role="listbox"
            id="searchable-select-listbox"
            style={{ maxHeight: maxDropdownHeight }}
          >
            {isLoading ? (
              <div className="searchable-select-loading">
                {loadingText}
              </div>
            ) : flatOptions.length === 0 ? (
              <div className="searchable-select-no-results">
                {noResultsText}
              </div>
            ) : groupedOptions ? (
              // Render grouped options
              Object.entries(groupedOptions).map(([groupKey, groupOptions]) => (
                <div key={groupKey} className="searchable-select-group">
                  <div className="searchable-select-group-label">{groupKey}</div>
                  {groupOptions.map((option, idx) => {
                    const globalIndex = flatOptions.findIndex(o => getOptionValue(o) === getOptionValue(option));
                    return renderOptionItem(option, globalIndex);
                  })}
                </div>
              ))
            ) : (
              // Render flat options
              <>
                {emptyOption && renderOptionItem(emptyOption, 0, true)}
                {filteredOptions.map((option, idx) =>
                  renderOptionItem(option, emptyOption ? idx + 1 : idx)
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
