// src/utils/accessLevels.js

export const AccessLevels = {
  SITE: "site",
  CLUSTER: "cluster",
  CITY: "city",
  COMPANY: "company",
  GROUP: "group",
};

export const Roles = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
  VIEWER: "viewer",
};

export const Permissions = {
  [AccessLevels.SITE]: {
    [Roles.ADMIN]: {
      canEditUsers: true,
      canViewReports: true,
      canManageDevices: true,
    },
    [Roles.MANAGER]: {
      canEditUsers: true,
      canViewReports: true,
      canManageDevices: false,
    },
    [Roles.USER]: {
      canEditUsers: false,
      canViewReports: true,
      canManageDevices: false,
    },
    [Roles.VIEWER]: {
      canEditUsers: false,
      canViewReports: false,
      canManageDevices: false,
    },
  },
};