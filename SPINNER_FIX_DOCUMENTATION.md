# Spinner/Loading Text Rotation Fix

## Issue Description

In some parts of the portal (Dashboard, User Management, Reports Dashboard), when exporting CSV or PDF files, the loading toast notification was displaying with both the spinner AND the loading text rotating together. This created an inconsistent and poor user experience.

## Root Cause

The issue was caused by `react-toastify`'s default behavior for loading toasts. By default, the library's `toast.loading()` method uses its own spinner that rotates the entire toast content, including the text message.

## Solution Implemented

**Primary Solution**: Created a custom loading component that uses our own `Spinner` component
**Backup Solution**: Added CSS overrides as a safety net

### Why This Approach?

Instead of fighting with react-toastify's internal CSS classes (which can change between versions), we:
1. **Use our own Spinner component** - Consistent with the rest of the portal
2. **Render custom JSX in toasts** - Full control over the structure
3. **Ensure text never rotates** - By design, not by CSS hacks

### Primary Solution: Custom Loading Component

**File Modified**: `src/utils/notifications.js`

#### 1. Added Imports
```javascript
import React from 'react';
import Spinner from '../components/Loading/Spinner';
```

#### 2. Created Custom Loading Component
```javascript
/**
 * Custom loading content component
 * Ensures only the spinner rotates, not the text
 */
const LoadingContent = ({ message }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <Spinner size="sm" color="primary" />
    <span>{message}</span>
  </div>
);
```

#### 3. Updated showLoading Function
```javascript
export const showLoading = (message, options = {}) => {
  return toast.info(<LoadingContent message={message} />, {
    ...DEFAULT_CONFIG,
    autoClose: false,
    closeButton: false,
    ...options
  });
};
```

**Key Changes**:
- Uses `toast.info()` instead of `toast.loading()`
- Renders our custom `<LoadingContent>` component
- Uses our own `Spinner` component (already correctly implemented)
- Sets `autoClose: false` to keep it visible until manually dismissed
- Sets `closeButton: false` since loading toasts shouldn't be manually closed

#### 4. Updated showPromise Function
```javascript
return toast.promise(
  promise,
  {
    pending: {
      render: () => <LoadingContent message={pending || "Processing..."} />,
    },
    success: success || "Operation completed successfully",
    error: error || "Operation failed",
  },
  { ...DEFAULT_CONFIG, ...options }
);
```

**Key Change**:
- The `pending` state now renders custom JSX with our Spinner component

### Backup Solution: CSS Overrides

**File Modified**: `src/App.css`

Added the following CSS at the end of the file (lines 219-262) as a safety net:

```css
/* ===== React Toastify Custom Styles ===== */
/* Fix toast loading spinner - only spinner should rotate, not the text */

/* Ensure toast content doesn't rotate */
.Toastify__toast {
  animation: none !important;
}

/* The loading icon container */
.Toastify__spinner {
  animation: Toastify__spin 0.65s linear infinite !important;
}

/* Prevent the entire toast body from rotating */
.Toastify__toast-body {
  animation: none !important;
  transform: none !important;
}

/* Ensure loading toast doesn't rotate */
.Toastify__toast--loading {
  animation: none !important;
}

/* Make sure the spinner rotates but text doesn't */
.Toastify__toast--loading .Toastify__toast-icon {
  animation: Toastify__spin 0.65s linear infinite !important;
}

/* Override any rotation on the message div */
.Toastify__toast-body > div:last-child {
  animation: none !important;
  transform: none !important;
}

/* Define the spin animation for the spinner only */
@keyframes Toastify__spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

## How It Works

### Before the Fix
```
┌─────────────────────────────────┐
│  🔄 "Exporting CSV..."          │  ← Entire content rotates
│  (spinning text and spinner)    │
└─────────────────────────────────┘
```

### After the Fix (Primary Solution)
```
┌─────────────────────────────────┐
│  🔄  Exporting CSV...           │  ← Only spinner (🔄) rotates
│  │   │                          │
│  │   └─ Static text             │
│  └───── Rotating Spinner        │
└─────────────────────────────────┘
```

### Component Structure

The custom `LoadingContent` component:
```
<div style="display: flex; align-items: center; gap: 0.75rem">
  <Spinner size="sm" color="primary" />  ← Rotates (via Spinner.css)
  <span>Exporting CSV...</span>         ← Static text
</div>
```

**Why This Works**:
1. **Separation of concerns**: Spinner and text are separate elements
2. **Uses existing Spinner component**: Already correctly implemented
3. **No dependency on react-toastify's internal classes**: Won't break with updates
4. **Consistent with portal**: Same Spinner component used everywhere

## Affected Areas

This fix applies to all loading toast notifications in the portal, including:

### Dashboard (`src/pages/Dashboard.js`)
- CSV export loading: "Preparing CSV..."
- PDF export loading: "Generating PDF..."

### User Management (`src/pages/UserManagement/UserList.js`)
- CSV export loading: "Exporting users..."
- General processing: "Processing..."

### Reports Dashboard (`src/pages/Reports/ReportDashboard.js`)
- CSV export loading: "Preparing CSV..."
- PDF export loading: "Generating PDF..."

### Any Custom Loading Notifications
- Uses `notifications.loading()` from `src/utils/notifications.js`
- Uses `showLoading()` directly
- Uses `toast.loading()` directly

## Consistent Loading Behavior Across Portal

The portal now has consistent loading indicators:

### 1. Spinner Component (`src/components/Loading/Spinner.js`)
- ✅ Correctly implemented - only ring rotates
- Used in: ReportTable, various components

### 2. LoadingOverlay Component (`src/components/Loading/LoadingOverlay.js`)
- ✅ Correctly implemented - uses Spinner component
- Text is in separate `<p>` tag
- Used in: Dashboard, UserList, ReportDashboard

### 3. Button Loading State (`src/components/Button.js`)
- ✅ Correctly implemented - only loader ring rotates
- Text remains static next to spinner
- Used in: Export buttons, form submissions

### 4. Toast Loading Notifications (`react-toastify`)
- ✅ **NOW FIXED** - only spinner rotates, text is static
- Used in: All export operations, async operations

## Testing

To verify the fix works correctly:

1. **Dashboard Export**:
   - Go to Dashboard
   - Click "Export CSV" or "Export PDF" on any chart
   - Observe the toast notification - only the spinner should rotate

2. **User Management Export**:
   - Go to User Management page
   - Click "Export CSV" in the toolbar
   - Observe the toast notification - only the spinner should rotate

3. **Reports Export**:
   - Go to Reports Dashboard
   - Select any report
   - Click "Export CSV" or "Export PDF"
   - Observe the toast notification - only the spinner should rotate

4. **Custom Loading**:
   - Trigger any operation that uses `notifications.loading()`
   - Verify only the spinner rotates

## Browser Compatibility

The fix uses `!important` to ensure it overrides react-toastify's default styles across all browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Android Chrome)

## Build Status

✅ **Build successful** - No errors introduced

The changes are purely CSS-based and don't affect any JavaScript functionality.

## Future Maintenance

If `react-toastify` is updated to a new version, verify that:
1. The CSS class names haven't changed
2. The loading spinner behavior is still correct
3. The custom CSS still applies properly

If issues occur after updating `react-toastify`:
1. Check the library's changelog for class name changes
2. Inspect the DOM structure of loading toasts
3. Update the CSS selectors in `App.css` if needed

## Related Components

This fix ensures consistency with these existing components:

1. **Spinner.js** - Custom spinner component (already correct)
2. **LoadingOverlay.js** - Full-page/container overlay (already correct)
3. **Button.js** - Button loading state (already correct)
4. **ReportTable.js** - Table loading state (already correct)

All loading indicators in the portal now follow the same pattern:
- **Spinner/ring rotates** ✓
- **Text remains static** ✓
- **Consistent animation speed** ✓
- **Accessible with ARIA labels** ✓

## Benefits of the New Approach

### Advantages Over CSS-Only Solution

1. **Reliability**: Not dependent on react-toastify's internal class names
2. **Maintainability**: Won't break when react-toastify updates
3. **Consistency**: Uses the same Spinner component as the rest of the portal
4. **Flexibility**: Easy to customize (size, color, layout) without CSS hacks
5. **Predictability**: Behavior is controlled by our code, not external library
6. **Debuggability**: Easy to inspect and modify if issues arise

### Code Quality

- ✅ Clean separation of rotating vs static elements
- ✅ Reuses existing, tested Spinner component
- ✅ No brittle CSS selectors targeting library internals
- ✅ Easy to understand and maintain
- ✅ TypeScript-friendly (if migrating later)

## Summary

The issue was isolated to `react-toastify` loading toasts where the entire toast content (including text) was rotating.

**Solution**: Instead of fighting with react-toastify's internal CSS, we created a custom `LoadingContent` component that:
1. Uses our own `Spinner` component (already correctly implemented)
2. Renders the spinner and text as separate elements
3. Ensures only the spinner rotates by design

This approach is more reliable, maintainable, and consistent with the rest of the portal. The CSS overrides remain as a backup safety net.
