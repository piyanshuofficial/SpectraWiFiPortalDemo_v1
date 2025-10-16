// src/utils/userActions.js

import { toast } from "react-toastify";

/**
 * Placeholder function to resend password to a user.
 * Currently just shows a success toast notification.
 *
 * @param {string} userId - Unique identifier of the user
 */
export function resendPassword(user) {
  // TODO: Integrate actual backend API call here later

  // Simulated success message 
  toast.success(`Password reset link sent successfully to user ${user.userId}.`);
}

export function editUser(user) {
  toast.info(`Edit action for user: ${user.firstName}`);
}

export function suspendUser(user) {
  toast.warn(`Suspend action for user: ${user.firstName}`);
}

export function blockUser(user) {
  toast.error(`Block action for user: ${user.firstName}`);
}

export function activateUser(user) {
  toast.success(`Activate action for user: ${user.firstName}`);
}

export function closeModal() {
  toast.info("Closed user details modal");
}
