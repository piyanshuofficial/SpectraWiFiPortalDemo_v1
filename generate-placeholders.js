// generate-placeholders.js
const fs = require('fs');
const path = require('path');

const placeholders = [
  { name: "sidebar-users-menu", label: "Sidebar with Users menu highlighted" },
  { name: "add-user-button", label: "Add User button highlighted" },
  { name: "add-user-form", label: "Add User form with fields highlighted" },
  { name: "policy-selection-dropdown", label: "Policy selection dropdown" },
  { name: "date-picker-fields", label: "Date picker fields" },
  { name: "success-notification", label: "Success notification" },
  { name: "user-form-modal", label: "User form modal" },
  { name: "policy-dropdowns", label: "Policy dropdowns" },
  { name: "policy-summary", label: "Policy summary" },
  { name: "device-management-page", label: "Device Management page" },
  { name: "register-device-button", label: "Register Device button" },
  { name: "mac-address-field", label: "MAC address field" },
  { name: "device-type-dropdown", label: "Device type dropdown" },
  { name: "registration-mode-selection", label: "Registration mode selection" },
  { name: "device-name-field", label: "Device name field" },
  { name: "success-confirmation", label: "Success confirmation" },
  { name: "reports-navigation", label: "Reports navigation" },
  { name: "report-categories", label: "Report categories" },
  { name: "report-card", label: "Report card" },
  { name: "criteria-form", label: "Criteria form" },
  { name: "report-preview", label: "Report preview" },
  { name: "export-buttons", label: "Export buttons" },
  { name: "user-status-badge", label: "User status badge" },
  { name: "user-policy-details", label: "User policy details" },
  { name: "device-list", label: "Device list" },
  { name: "license-ring", label: "License ring" },
  { name: "reset-password-button", label: "Reset password button" },
  { name: "download-template-button", label: "Download Template button in toolbar" },
  { name: "sample-csv-file", label: "Sample CSV file with data" },
  { name: "import-users-dialog", label: "Import Users dialog with file selector" },
  { name: "validation-results", label: "Validation results showing success/error counts" },
  { name: "import-confirmation-dialog", label: "Import confirmation dialog with user count" },
  { name: "user-search-bar", label: "User search bar with filters" },
  { name: "user-row-actions-menu", label: "User row with actions menu highlighted" },
  { name: "actions-dropdown-menu", label: "Actions dropdown menu" },
  { name: "confirmation-dialog-status", label: "Confirmation dialog for status change" },
  { name: "user-list-updated-status", label: "User list showing updated status badge" },
  { name: "user-row-actions", label: "User row with actions menu" },
  { name: "reset-password-option", label: "Reset Password option highlighted" },
  { name: "password-reset-method", label: "Password reset method selection" },
  { name: "password-reset-success", label: "Password reset success message" },
  { name: "sidebar-configuration-menu", label: "Sidebar with Configuration menu expanded" },
  { name: "create-policy-button", label: "Create New Policy button highlighted" },
  { name: "policy-name-input", label: "Policy name input field" },
  { name: "speed-limit-dropdown", label: "Speed limit dropdown" },
  { name: "data-volume-selector", label: "Data volume selector" },
  { name: "device-limit-slider", label: "Device limit slider" },
  { name: "data-cycle-type-options", label: "Data cycle type options" },
  { name: "network-settings-page", label: "Network Settings page" },
  { name: "device-restriction-settings", label: "Device restriction settings" },
  { name: "license-capacity-config", label: "License capacity configuration" },
  { name: "access-control-panel", label: "Access control panel" },
  { name: "performance-settings-panel", label: "Performance settings panel" },
  { name: "save-confirmation-dialog", label: "Save confirmation dialog" }
];

const generateSVG = (label, width = 800, height = 500) => {
  const lines = label.match(/.{1,35}/g) || [label];
  const totalHeight = lines.length * 24;
  const startY = (height - totalHeight) / 2 + 30;

  const textElements = lines.map((line, i) =>
    `<text x="50%" y="${startY + (i * 24)}" text-anchor="middle" font-size="18" font-weight="500" fill="#4a5568">${line}</text>`
  ).join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e8f0fe;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d4e4f7;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#grad)" />

  <!-- Border -->
  <rect x="10" y="10" width="${width - 20}" height="${height - 20}"
        fill="none" stroke="#204094" stroke-width="2" stroke-dasharray="10,5" rx="8" />

  <!-- Icon -->
  <g transform="translate(${width / 2 - 40}, ${height / 2 - 80})">
    <circle cx="40" cy="40" r="35" fill="#204094" opacity="0.1" />
    <path d="M 25 30 L 55 30 L 55 50 L 25 50 Z" fill="none" stroke="#204094" stroke-width="2" />
    <circle cx="35" cy="40" r="4" fill="#204094" />
    <polyline points="25,50 30,45 40,50 50,40 55,45" fill="none" stroke="#204094" stroke-width="2" stroke-linejoin="round" />
  </g>

  <!-- Text -->
  <g>
    ${textElements}
  </g>

  <!-- Footer -->
  <text x="50%" y="${height - 20}" text-anchor="middle" font-size="12" fill="#718096" font-style="italic">
    Screenshot Placeholder - Replace with actual image
  </text>
</svg>`;
};

const outputDir = path.join(__dirname, 'src', 'assets', 'images', 'knowledge-center');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate all placeholder images
let count = 0;
placeholders.forEach(placeholder => {
  const svg = generateSVG(placeholder.label);
  const filename = `${placeholder.name}.svg`;
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, svg, 'utf8');
  count++;
  console.log(`✓ Created: ${filename}`);
});

console.log(`\n✓ Successfully generated ${count} placeholder images in ${outputDir}`);
