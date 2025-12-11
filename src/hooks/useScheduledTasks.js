// src/hooks/useScheduledTasks.js

/**
 * Re-export useScheduledTasks hook from context for convenience
 * This allows importing from either location:
 * - import { useScheduledTasks } from '../context/ScheduledTasksContext'
 * - import { useScheduledTasks } from '../hooks/useScheduledTasks'
 */

export {
  useScheduledTasks,
  ScheduledTaskTypes,
  TaskStatus,
  getTaskTypeLabel,
  getStatusVariant,
} from '../context/ScheduledTasksContext';
