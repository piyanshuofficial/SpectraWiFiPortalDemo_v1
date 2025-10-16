// src/constants/userFieldConfig.js

export const SEGMENT_USER_FIELDS = {
  enterprise: [
    { name: "mobile", label: "Mobile Number", required: false, type: "text", disabled: false },
    { name: "email", label: "Email", required: false, type: "email", disabled: false },
    { name: "guestId", label: "Guest ID", required: false, type: "text", disabled: false },
    { name: "userPolicy", label: "User Policy", required: true },
    { name: "status", label: "User Status", required: true },
  ],
  coliving: [
    { name: "mobile", label: "Mobile Number", required: true, type: "text", disabled: false },
    { name: "email", label: "Email", required: true, type: "email", disabled: false },
    { name: "guestId", label: "Guest ID", required: true, type: "text", disabled: false },
    { name: "userPolicy", label: "User Policy", required: true },
    { name: "status", label: "User Status", required: true },
  ],
  coworking: [
    { name: "mobile", label: "Mobile Number", required: true, type: "text", disabled: false },
    { name: "email", label: "Email", required: true, type: "email", disabled: false },
    { name: "guestId", label: "Guest ID", required: true, type: "text", disabled: false },
    { name: "userPolicy", label: "User Policy", required: true },
    { name: "status", label: "User Status", required: true },
  ],
  hotel: [
    { name: "mobile", label: "Mobile Number", required: true, type: "text", disabled: false },
    { name: "email", label: "Email", required: true, type: "email", disabled: false },
    { name: "guestId", label: "Guest ID", required: true, type: "text", disabled: false },
    { name: "checkOutTime", label: "Check-out Time", required: true, type: "datetime-local", disabled: false },
    { name: "userPolicy", label: "User Policy", required: true },
    { name: "status", label: "User Status", required: true },
  ],
  pg: [
    { name: "mobile", label: "Mobile Number", required: true, type: "text", disabled: false },
    { name: "email", label: "Email", required: true, type: "email", disabled: false },
    { name: "guestId", label: "Guest ID", required: true, type: "text", disabled: false },
    { name: "userPolicy", label: "User Policy", required: true },
    { name: "status", label: "User Status", required: true },
  ],
  default: [
    { name: "mobile", label: "Mobile Number", required: true, type: "text", disabled: false },
    { name: "email", label: "Email", required: true, type: "email", disabled: false },
    { name: "guestId", label: "Guest ID", required: false, type: "text", disabled: false },
    { name: "userPolicy", label: "User Policy", required: true },
    { name: "status", label: "User Status", required: true },
  ],
};

export const USER_POLICY_OPTIONS = {
  enterprise: {
    speed: ["Upto 10 Mbps", "Upto 25 Mbps", "Upto 50 Mbps", "Unlimited"],
    dataVolume: ["10 GB", "50 GB", "100 GB", "Unlimited"],
    deviceLimit: ["1", "2", "3", "5"],
    cycleTypeSelect: false,
    cycleTypeDefault: "Monthly",
  },
  coliving: {
    speed: ["Upto 10 Mbps", "Upto 25 Mbps", "Upto 50 Mbps", "Unlimited"],
    dataVolume: ["10 GB", "50 GB", "Unlimited"],
    deviceLimit: ["1", "2", "3", "5"],
    cycleTypeSelect: true,
    allowedCycleTypes: ["Daily", "Monthly"],
  },
  coworking: {
    speed: ["Upto 10 Mbps", "Upto 25 Mbps", "Unlimited"],
    dataVolume: ["10 GB", "Unlimited"],
    deviceLimit: ["1", "2", "3", "5", "10"],
    cycleTypeSelect: true,
    allowedCycleTypes: ["Monthly"],
    cycleTypeDefault: "Monthly",
  },
  hotel: {
    speed: ["Upto 10 Mbps", "Upto 25 Mbps", "Unlimited"],
    dataVolume: ["5 GB", "10 GB", "Unlimited"],
    deviceLimit: ["1", "2"],
    cycleTypeSelect: true,
    allowedCycleTypes: ["Daily"],
    cycleTypeDefault: "Daily",
  },
  pg: {
    speed: ["Upto 5 Mbps", "Upto 10 Mbps", "Unlimited"],
    dataVolume: ["5 GB", "10 GB", "Unlimited"],
    deviceLimit: ["1", "2", "3"],
    cycleTypeSelect: false,
    cycleTypeDefault: "Monthly",
  },
  default: {
    speed: ["Upto 10 Mbps", "Upto 25 Mbps", "Unlimited"],
    dataVolume: ["10 GB", "50 GB", "Unlimited"],
    deviceLimit: ["1", "2", "3"],
    cycleTypeSelect: false,
    cycleTypeDefault: "Monthly",
  },
};

export const USER_TABLE_COLUMNS = (segmentFields) => [
  { name: "id", label: "User ID" },
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  ...segmentFields.map((field) => ({ name: field.name, label: field.label })),
];
