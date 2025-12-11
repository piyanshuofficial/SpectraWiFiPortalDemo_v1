// src/context/ScheduledTasksContext.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import notifications from '../utils/notifications';

/**
 * Scheduled Task Types
 */
export const ScheduledTaskTypes = {
  // Bulk operations
  BULK_USER_REGISTRATION: 'bulk_user_registration',
  BULK_DEVICE_REGISTRATION: 'bulk_device_registration',
  BULK_ACTIVATION: 'bulk_activation',
  BULK_SUSPENSION: 'bulk_suspension',
  BULK_BLOCKING: 'bulk_blocking',
  BULK_POLICY_CHANGE: 'bulk_policy_change',
  BULK_DEVICE_RENAME: 'bulk_device_rename',
  BULK_RESEND_PASSWORD: 'bulk_resend_password',
  // Single user operations
  SINGLE_ACTIVATION: 'single_activation',
  SINGLE_SUSPENSION: 'single_suspension',
  SINGLE_BLOCKING: 'single_blocking',
  SINGLE_POLICY_CHANGE: 'single_policy_change',
  SINGLE_RESEND_PASSWORD: 'single_resend_password',
};

/**
 * Task Status
 */
export const TaskStatus = {
  PENDING: 'pending',
  EXECUTING: 'executing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

/**
 * Generate unique ID for tasks
 */
const generateTaskId = () => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get human-readable task type label
 */
export const getTaskTypeLabel = (type) => {
  const labels = {
    [ScheduledTaskTypes.BULK_USER_REGISTRATION]: 'Bulk User Registration',
    [ScheduledTaskTypes.BULK_DEVICE_REGISTRATION]: 'Bulk Device Registration',
    [ScheduledTaskTypes.BULK_ACTIVATION]: 'Bulk User Activation',
    [ScheduledTaskTypes.BULK_SUSPENSION]: 'Bulk User Suspension',
    [ScheduledTaskTypes.BULK_BLOCKING]: 'Bulk User Blocking',
    [ScheduledTaskTypes.BULK_POLICY_CHANGE]: 'Bulk Policy Change',
    [ScheduledTaskTypes.BULK_DEVICE_RENAME]: 'Bulk Device Rename',
    [ScheduledTaskTypes.BULK_RESEND_PASSWORD]: 'Bulk Resend Password',
    [ScheduledTaskTypes.SINGLE_ACTIVATION]: 'User Activation',
    [ScheduledTaskTypes.SINGLE_SUSPENSION]: 'User Suspension',
    [ScheduledTaskTypes.SINGLE_BLOCKING]: 'User Blocking',
    [ScheduledTaskTypes.SINGLE_POLICY_CHANGE]: 'Policy Change',
    [ScheduledTaskTypes.SINGLE_RESEND_PASSWORD]: 'Resend Password',
  };
  return labels[type] || type;
};

/**
 * Get status badge variant
 */
export const getStatusVariant = (status) => {
  const variants = {
    [TaskStatus.PENDING]: 'info',
    [TaskStatus.EXECUTING]: 'warning',
    [TaskStatus.COMPLETED]: 'active',
    [TaskStatus.FAILED]: 'blocked',
    [TaskStatus.CANCELLED]: 'inactive',
  };
  return variants[status] || 'default';
};

const ScheduledTasksContext = createContext();

const STORAGE_KEY = 'portal_scheduled_tasks';

export const ScheduledTasksProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const tasks = parsed.map(task => ({
          ...task,
          scheduledFor: new Date(task.scheduledFor),
          createdAt: new Date(task.createdAt),
          executedAt: task.executedAt ? new Date(task.executedAt) : null,
        }));
        setScheduledTasks(tasks);
      }
    } catch (error) {
      console.error('Failed to load scheduled tasks from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist tasks to localStorage on change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduledTasks));
      } catch (error) {
        console.error('Failed to save scheduled tasks to storage:', error);
      }
    }
  }, [scheduledTasks, isLoading]);

  // Check for due tasks and execute them (runs every minute)
  useEffect(() => {
    const checkDueTasks = () => {
      const now = new Date();
      setScheduledTasks(prevTasks => {
        let hasChanges = false;
        const updatedTasks = prevTasks.map(task => {
          if (task.status === TaskStatus.PENDING && task.scheduledFor <= now) {
            hasChanges = true;
            // Execute the task (in a real app, this would call the backend)
            console.log(`Executing scheduled task: ${task.id}`, task);

            // TODO: Backend integration
            // In production, this would:
            // 1. Call the appropriate API endpoint
            // 2. Wait for response
            // 3. Update status based on result

            // For demo, mark as completed immediately
            notifications.showSuccess(`Scheduled task executed: ${getTaskTypeLabel(task.type)}`);

            return {
              ...task,
              status: TaskStatus.COMPLETED,
              executedAt: now,
              result: { success: true, message: 'Task executed successfully (demo)' },
            };
          }
          return task;
        });

        return hasChanges ? updatedTasks : prevTasks;
      });
    };

    // Initial check
    checkDueTasks();

    // Set up interval to check every minute
    const interval = setInterval(checkDueTasks, 60000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Add a new scheduled task
   */
  const addScheduledTask = useCallback((taskData) => {
    const newTask = {
      id: generateTaskId(),
      type: taskData.type,
      targetType: taskData.targetType || 'user',
      targetIds: taskData.targetIds || [],
      targetCount: taskData.targetCount || taskData.targetIds?.length || 0,
      targetDetails: taskData.targetDetails || null, // Additional target info for display
      scheduledFor: new Date(taskData.scheduledFor),
      parameters: taskData.parameters || {},
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      createdBy: currentUser?.email || currentUser?.username || 'Unknown',
      createdByName: currentUser?.displayName || 'Unknown User',
      executedAt: null,
      result: null,
    };

    setScheduledTasks(prev => [...prev, newTask]);

    notifications.showSuccess(`Task scheduled for ${newTask.scheduledFor.toLocaleString()}`);

    return newTask;
  }, [currentUser]);

  /**
   * Cancel a scheduled task
   */
  const cancelScheduledTask = useCallback((taskId) => {
    setScheduledTasks(prev =>
      prev.map(task => {
        if (task.id === taskId && task.status === TaskStatus.PENDING) {
          notifications.showInfo('Scheduled task cancelled');
          return {
            ...task,
            status: TaskStatus.CANCELLED,
            executedAt: new Date(),
            result: { success: false, message: 'Cancelled by user' },
          };
        }
        return task;
      })
    );
  }, []);

  /**
   * Delete a task from history
   */
  const deleteScheduledTask = useCallback((taskId) => {
    setScheduledTasks(prev => prev.filter(task => task.id !== taskId));
    notifications.showInfo('Task removed from history');
  }, []);

  /**
   * Clear all completed/cancelled tasks
   */
  const clearCompletedTasks = useCallback(() => {
    setScheduledTasks(prev =>
      prev.filter(task => task.status === TaskStatus.PENDING || task.status === TaskStatus.EXECUTING)
    );
    notifications.showInfo('Completed tasks cleared');
  }, []);

  /**
   * Get pending tasks
   */
  const pendingTasks = scheduledTasks.filter(t => t.status === TaskStatus.PENDING);

  /**
   * Get completed tasks
   */
  const completedTasks = scheduledTasks.filter(
    t => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.FAILED || t.status === TaskStatus.CANCELLED
  );

  /**
   * Get tasks by type
   */
  const getTasksByType = useCallback((type) => {
    return scheduledTasks.filter(t => t.type === type);
  }, [scheduledTasks]);

  /**
   * Get tasks by status
   */
  const getTasksByStatus = useCallback((status) => {
    return scheduledTasks.filter(t => t.status === status);
  }, [scheduledTasks]);

  const value = {
    scheduledTasks,
    pendingTasks,
    completedTasks,
    isLoading,
    addScheduledTask,
    cancelScheduledTask,
    deleteScheduledTask,
    clearCompletedTasks,
    getTasksByType,
    getTasksByStatus,
    // Constants for convenience
    TaskTypes: ScheduledTaskTypes,
    TaskStatus,
    getTaskTypeLabel,
    getStatusVariant,
  };

  return (
    <ScheduledTasksContext.Provider value={value}>
      {children}
    </ScheduledTasksContext.Provider>
  );
};

/**
 * Hook to use scheduled tasks context
 */
export const useScheduledTasks = () => {
  const context = useContext(ScheduledTasksContext);
  if (!context) {
    throw new Error('useScheduledTasks must be used within a ScheduledTasksProvider');
  }
  return context;
};

export default ScheduledTasksContext;
