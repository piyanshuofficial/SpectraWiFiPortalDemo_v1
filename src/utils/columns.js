// src/utils/columns.js

export const commonColumns = [
  { key: "id", label: "User ID", optional: false },
  { key: "firstName", label: "Name", optional: false },
  { key: "mobile", label: "Mobile", optional: false },
  { key: "email", label: "Email", optional: true },
  { key: "userPolicy", label: "User Policy", optional: true },
  { key: "devicesCount", label: "Devices", optional: true },
  { key: "status", label: "Status", optional: false },
  { key: "dataCycleType", label: "Bill Cycle", optional: true },
  { key: "dataResetDate", label: "Data Reset Date", optional: true },
  { key: "registration", label: "Registration", optional: true },
  { key: "lastOnline", label: "Last Online", optional: true },
];

export const segmentSpecificFields = {
  enterprise: [
    { key: "employeeId", label: "Employee ID", optional: true },
    { key: "department", label: "Department", optional: true },
    { key: "title", label: "Job Title", optional: true },
  ],
  office: [
    { key: "employeeId", label: "Employee ID", optional: true },
    { key: "department", label: "Department", optional: true },
    { key: "designation", label: "Designation", optional: true },
  ],
  coLiving: [
    { key: "residentType", label: "Resident Type", optional: true },
    { key: "roomNumber", label: "Room Number", optional: true },
    { key: "checkInDate", label: "Check-In Date", optional: true },
    { key: "checkInTime", label: "Check-In Time", optional: true },
    { key: "checkOutDate", label: "Check-Out Date", optional: true },
    { key: "checkOutTime", label: "Check-Out Time", optional: true },
    { key: "organization", label: "Organization", optional: true },
  ],
  coWorking: [
    { key: "residentType", label: "Member Type", optional: true },
    { key: "companyName", label: "Company Name", optional: true },
    { key: "deskNumber", label: "Desk Number", optional: true },
    { key: "moveInDate", label: "Move-In Date", optional: true },
    { key: "moveOutDate", label: "Move-Out Date", optional: true },
  ],
  hotel: [
    { key: "roomNumber", label: "Room Number", optional: true },
    { key: "floor", label: "Floor", optional: true },
    { key: "checkInDate", label: "Check-In Date", optional: true },
    { key: "checkInTime", label: "Check-In Time", optional: true },
    { key: "checkOutDate", label: "Check-Out Date", optional: true },
    { key: "checkOutTime", label: "Check-Out Time", optional: true },
    { key: "guestId", label: "Guest ID", optional: true },
  ],
  pg: [
    { key: "roomNumber", label: "Room Number", optional: true },
  ],
  miscellaneous: [
    { key: "miscellaneous", label: "Miscellaneous", optional: true },
  ],
};

export const STATUS_COLORS = {
  Active: "green",
  Suspended: "orange",
  Blocked: "red",
};
