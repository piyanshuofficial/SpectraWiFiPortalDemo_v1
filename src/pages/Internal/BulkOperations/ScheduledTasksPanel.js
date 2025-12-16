// src/pages/Internal/BulkOperations/ScheduledTasksPanel.js

import React, { useState } from 'react';
import {
  FaClock,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaUsers,
  FaWifi,
  FaInfoCircle,
  FaTimes,
  FaCheckCircle,
  FaHourglassHalf,
  FaExclamationCircle,
  FaBan,
} from 'react-icons/fa';
import Button from '@components/Button';
import Badge from '@components/Badge';
import {
  useScheduledTasks,
  getTaskTypeLabel,
  getStatusVariant,
  TaskStatus,
} from '@hooks/useScheduledTasks';
import './ScheduledTasksPanel.css';

/**
 * ScheduledTasksPanel - View and manage scheduled bulk operations
 */
const ScheduledTasksPanel = () => {
  const {
    scheduledTasks,
    cancelScheduledTask,
    deleteScheduledTask,
    clearCompletedTasks,
  } = useScheduledTasks();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Filter tasks
  const filteredTasks = scheduledTasks.filter((task) => {
    const matchesSearch =
      getTaskTypeLabel(task.type).toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group tasks by status
  const pendingTasks = filteredTasks.filter((t) => t.status === TaskStatus.PENDING);
  const executingTasks = filteredTasks.filter((t) => t.status === TaskStatus.EXECUTING);
  const completedTasks = filteredTasks.filter(
    (t) => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.FAILED || t.status === TaskStatus.CANCELLED
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case TaskStatus.PENDING:
        return <FaHourglassHalf className="status-icon pending" />;
      case TaskStatus.EXECUTING:
        return <FaClock className="status-icon executing" />;
      case TaskStatus.COMPLETED:
        return <FaCheckCircle className="status-icon completed" />;
      case TaskStatus.FAILED:
        return <FaExclamationCircle className="status-icon failed" />;
      case TaskStatus.CANCELLED:
        return <FaBan className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  const getTargetIcon = (targetType) => {
    switch (targetType) {
      case 'user':
        return <FaUser />;
      case 'users':
        return <FaUsers />;
      case 'device':
      case 'devices':
        return <FaWifi />;
      default:
        return <FaUsers />;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeRemaining = (scheduledFor) => {
    const now = new Date();
    const scheduled = new Date(scheduledFor);
    const diff = scheduled - now;

    if (diff < 0) return 'Overdue';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleCancel = (taskId) => {
    cancelScheduledTask(taskId);
    setConfirmDelete(null);
  };

  const handleDelete = (taskId) => {
    deleteScheduledTask(taskId);
    setConfirmDelete(null);
  };

  const renderTaskCard = (task) => (
    <div key={task.id} className="scheduled-task-card">
      <div className="task-card-header">
        <div className="task-type-info">
          {getStatusIcon(task.status)}
          <span className="task-type-label">{getTaskTypeLabel(task.type)}</span>
        </div>
        <Badge variant={getStatusVariant(task.status)} size="small">
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </Badge>
      </div>

      <div className="task-card-body">
        <div className="task-detail">
          <span className="task-detail-label">
            {getTargetIcon(task.targetType)} Target:
          </span>
          <span className="task-detail-value">
            {task.targetCount} {task.targetType}(s)
          </span>
        </div>

        <div className="task-detail">
          <span className="task-detail-label">
            <FaCalendarAlt /> Scheduled:
          </span>
          <span className="task-detail-value">{formatDateTime(task.scheduledFor)}</span>
        </div>

        {task.status === TaskStatus.PENDING && (
          <div className="task-countdown">
            <FaClock />
            <span>Executes in: {getTimeRemaining(task.scheduledFor)}</span>
          </div>
        )}

        {task.executedAt && (
          <div className="task-detail">
            <span className="task-detail-label">Executed:</span>
            <span className="task-detail-value">{formatDateTime(task.executedAt)}</span>
          </div>
        )}

        {task.result && (
          <div className="task-result">
            <FaInfoCircle />
            <span>{task.result}</span>
          </div>
        )}
      </div>

      <div className="task-card-footer">
        <span className="task-created">Created: {formatDateTime(task.createdAt)}</span>

        {task.status === TaskStatus.PENDING && (
          <div className="task-actions">
            {confirmDelete === task.id ? (
              <div className="confirm-actions">
                <span>Cancel task?</span>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleCancel(task.id)}
                >
                  Yes
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setConfirmDelete(null)}
                >
                  No
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                size="small"
                onClick={() => setConfirmDelete(task.id)}
              >
                <FaTimes /> Cancel
              </Button>
            )}
          </div>
        )}

        {(task.status === TaskStatus.COMPLETED ||
          task.status === TaskStatus.FAILED ||
          task.status === TaskStatus.CANCELLED) && (
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleDelete(task.id)}
          >
            <FaTrash /> Remove
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="scheduled-tasks-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <h2 className="panel-title">
          <FaClock /> Scheduled Tasks
        </h2>
        <p className="panel-desc">
          View and manage your scheduled bulk operations
        </p>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <div className="search-row">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks by type or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-btn"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value={TaskStatus.PENDING}>Pending</option>
              <option value={TaskStatus.EXECUTING}>Executing</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
              <option value={TaskStatus.FAILED}>Failed</option>
              <option value={TaskStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>

          {completedTasks.length > 0 && (
            <Button
              variant="secondary"
              size="small"
              onClick={clearCompletedTasks}
            >
              <FaTrash style={{ marginRight: 6 }} /> Clear Completed
            </Button>
          )}

          {(searchTerm || statusFilter !== 'all') && (
            <button
              className="btn-text"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="results-info">
          <span className="results-count">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Task Lists */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <FaClock className="empty-icon" />
          <h3>No Scheduled Tasks</h3>
          <p>
            {searchTerm || statusFilter !== 'all'
              ? 'No tasks match your filters.'
              : 'Schedule bulk operations to see them here.'}
          </p>
        </div>
      ) : (
        <div className="tasks-container">
          {/* Executing Tasks */}
          {executingTasks.length > 0 && (
            <div className="task-group">
              <h3 className="task-group-title">
                <FaClock className="executing" /> Currently Executing
                <Badge variant="warning" size="small">
                  {executingTasks.length}
                </Badge>
              </h3>
              <div className="task-grid">
                {executingTasks.map(renderTaskCard)}
              </div>
            </div>
          )}

          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="task-group">
              <h3 className="task-group-title">
                <FaHourglassHalf className="pending" /> Pending
                <Badge variant="info" size="small">
                  {pendingTasks.length}
                </Badge>
              </h3>
              <div className="task-grid">
                {pendingTasks.map(renderTaskCard)}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="task-group">
              <h3 className="task-group-title">
                <FaCheckCircle className="completed" /> History
                <Badge variant="secondary" size="small">
                  {completedTasks.length}
                </Badge>
              </h3>
              <div className="task-grid">
                {completedTasks.map(renderTaskCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduledTasksPanel;
