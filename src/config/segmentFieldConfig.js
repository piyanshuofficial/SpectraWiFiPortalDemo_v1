// src/config/segmentFieldConfig.js

export const segmentFieldConfig = {
  enterprise: [
    { name: "employeeId", label: "Employee ID", type: "text", required: false },
    { name: "department", label: "Department", type: "text", required: false },
    { name: "title", label: "Job Title", type: "text", required: false },
  ],
  office: [
    { name: "employeeId", label: "Employee ID", type: "text", required: false },
    { name: "department", label: "Department", type: "text", required: false },
    { name: "designation", label: "Designation", type: "text", required: false },
  ],
  coLiving: [
  //  { name: "residentType", label: "Resident Type", type: "select", required: true, options: ["Long-Term", "Short-Term"] },
    { name: "roomNumber", label: "Room Number", type: "text", required: false },
 // { name: "checkInDate", label: "Check-In Date", type: "date", required: false },
 // { name: "checkInTime", label: "Check-In Time", type: "time", required: false },
  //{ name: "checkOutDate", label: "Check-Out Date", type: "date", required: false },
 // { name: "checkOutTime", label: "Check-Out Time", type: "time", required: false },
    { name: "orgaization", label: "Organization", type: "text", required: false },
  ],
  coWorking: [
    //{ name: "memberType", label: "Member Type", type: "select", required: true, options: ["Permanent", "Temporary"] },
    { name: "companyName", label: "Company Name", type: "text", required: false },
    { name: "deskNumber", label: "Desk Number", type: "text", required: false },
  //  { name: "moveInDate", label: "Move-In Date", type: "date", required: false },
   // { name: "moveOutDate", label: "Move-Out Date", type: "date", required: false },
  ],
  hotel: [
    { name: "roomNumber", label: "Room Number", type: "text", required: true },
    { name: "floor", label: "Floor", type: "text", required: false },
  //{ name: "checkInDate", label: "Check-In Date", type: "date", required: true },
  //{ name: "checkInTime", label: "Check-In Time", type: "time", required: true },
  //{ name: "checkOutDate", label: "Check-Out Date", type: "date", required: true },
  //{ name: "checkOutTime", label: "Check-Out Time", type: "time", required: true },
        { name: "guestId", label: "Guest ID", type: "text", required: false },
  ],
  pg: [ 
    { name: "roomNumber", label: "Room Number", type: "text", required: false },
  ],
  miscellaneous: [
    { name: "miscellaneous", label: "Miscellaneous", type: "text", required: false },
  ],
};
