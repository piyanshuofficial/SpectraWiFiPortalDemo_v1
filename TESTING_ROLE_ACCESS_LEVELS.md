# Testing Role and Access Level Permissions

## Overview
This document describes how to test the newly implemented role-based and access-level permissions system.

## Test Selector Location
The Role and Access Level selector appears in the **top-right corner** of the portal (below the header bar).
- **Testing badge**: 🧪 TEST (orange badge indicating this is a testing component)
- **Role dropdown**: Switch between Admin, Manager, User, Viewer
- **Access Level dropdown**: Switch between Group (Highest), Company, City, Cluster, Site (Lowest)

## Default State
- **Role**: Admin (highest role)
- **Access Level**: Group (highest access level)
- **Result**: Maximum rights - all features enabled

---

## Test Scenarios

### 1. Test Role Permissions (with GROUP access level)

#### Admin Role (Default)
- ✅ Can edit users (Add/Edit/Delete buttons visible)
- ✅ Can view reports
- ✅ Can manage devices
- ✅ Can manage policies
- ✅ Can export data
- ✅ All features available

#### Manager Role
- ✅ Can edit users
- ✅ Can view reports
- ✅ Can manage devices
- ✅ Can manage policies
- ✅ Can export data
- ✅ Can manage segments
- ✅ Can manage billing
- ✅ Can manage roles

#### User Role
- ❌ Cannot edit users (Add/Edit/Delete buttons hidden)
- ✅ Can view reports
- ❌ Cannot manage devices
- ✅ Can view analytics
- ✅ Can export data
- ✅ Can view multiple sites

#### Viewer Role (Most Restricted)
- ❌ Cannot edit users
- ✅ Can view reports (limited)
- ❌ Cannot manage devices
- ✅ Can view analytics
- ✅ Can export data
- ✅ Can view multiple sites

---

### 2. Test Access Level Permissions (with ADMIN role)

#### SITE Level (Lowest - Most Restricted)
- ✅ Can edit users
- ✅ Can view reports
- ✅ Can manage devices
- ✅ Can manage policies
- ❌ Cannot manage segments
- ❌ Cannot view multiple sites
- ❌ Cannot manage billing
- ❌ Cannot configure system

#### CLUSTER Level
- ✅ All SITE permissions +
- ✅ Can manage segments (for ADMIN only)
- ✅ Can view multiple sites

#### CITY Level
- ✅ All CLUSTER permissions +
- ✅ Can manage billing
- ✅ Can manage roles

#### COMPANY Level
- ✅ All CITY permissions +
- ✅ Can configure system

#### GROUP Level (Highest - Maximum Rights)
- ✅ All permissions enabled
- ✅ Full system access

---

### 3. Combined Test Scenarios

#### Test Case 1: Site Admin vs Group Admin
1. **Set to**: ADMIN role + SITE access level
   - Cannot manage segments
   - Cannot view multiple sites
   - Cannot manage billing

2. **Change to**: ADMIN role + GROUP access level
   - Can manage segments
   - Can view multiple sites
   - Can manage billing

#### Test Case 2: Manager Progression
1. **SITE Manager**: Limited to single site operations
2. **CLUSTER Manager**: Can manage segments (NO - only ADMIN can), can view multiple sites
3. **CITY Manager**: + Can manage segments, still no billing
4. **COMPANY Manager**: + Can manage billing
5. **GROUP Manager**: + Can manage roles

#### Test Case 3: User Role Limitations
1. **Set to**: USER role + any access level
   - Always: Cannot edit users
   - Always: Cannot manage devices
   - Always: Cannot manage policies
   - Verify: Add/Edit/Delete buttons are hidden or disabled

#### Test Case 4: Viewer Role (Most Restrictive)
1. **Set to**: VIEWER role + SITE access level
   - Minimal permissions (analytics view only)
   - Cannot edit anything
   - Cannot export at SITE level

2. **Set to**: VIEWER role + GROUP access level
   - Still cannot edit
   - Can now export data
   - Can view multiple sites

---

## What to Check in Each Page

### User Management Page (`/users`)
- [ ] **Add User button**: Visible only if `canEditUsers === true`
- [ ] **Edit icon**: Enabled only if `canEditUsers === true`
- [ ] **Delete icon**: Enabled only if `canEditUsers === true`
- [ ] **Export button**: Enabled only if `canViewReports === true`

### Device Management Page (`/devices`)
- [ ] **Add Device button**: Visible only if `canManageDevices === true`
- [ ] **Edit/Delete icons**: Enabled only if `canManageDevices === true`

### Reports Page (`/reports`)
- [ ] **Report access**: Available only if `canViewReports === true`
- [ ] **Export buttons**: Enabled only if `canExportData === true`

### Dashboard Page (`/`)
- [ ] **Analytics widgets**: Visible only if `canViewAnalytics === true`

---

## Expected Behavior Matrix

| Role    | Access Level | Edit Users | View Reports | Manage Devices | Export Data | Manage Segments | Billing | System Config |
|---------|--------------|------------|--------------|----------------|-------------|-----------------|---------|---------------|
| Admin   | SITE         | ✅         | ✅           | ✅             | ✅          | ❌              | ❌      | ❌            |
| Admin   | CLUSTER      | ✅         | ✅           | ✅             | ✅          | ✅              | ❌      | ❌            |
| Admin   | CITY         | ✅         | ✅           | ✅             | ✅          | ✅              | ✅      | ❌            |
| Admin   | COMPANY      | ✅         | ✅           | ✅             | ✅          | ✅              | ✅      | ✅            |
| Admin   | GROUP        | ✅         | ✅           | ✅             | ✅          | ✅              | ✅      | ✅            |
| Manager | SITE         | ✅         | ✅           | ✅             | ✅          | ❌              | ❌      | ❌            |
| Manager | GROUP        | ✅         | ✅           | ✅             | ✅          | ✅              | ✅      | ❌            |
| User    | ANY          | ❌         | ✅           | ❌             | ✅*         | ❌              | ❌      | ❌            |
| Viewer  | SITE         | ❌         | ❌           | ❌             | ❌          | ❌              | ❌      | ❌            |
| Viewer  | GROUP        | ❌         | ✅           | ❌             | ✅          | ❌              | ❌      | ❌            |

*Export data enabled for USER role from CLUSTER level and above

---

## Known Limitations

1. **Testing Only**: This selector is for testing purposes and will be removed in production.
2. **No Backend Integration**: Changes are local to the browser session only.
3. **Refresh Resets**: Page refresh will reset to default (ADMIN + GROUP).

---

## Implementation Files

### Core Files
- `src/utils/accessLevels.js` - Permissions matrix definition
- `src/context/AuthContext.js` - User state management
- `src/hooks/usePermissions.js` - Permission checking hook
- `src/components/RoleAccessSelector.js` - Test selector component

### Integration Files
- `src/components/Header.js` - Selector rendered here
- `src/pages/UserManagement/UserList.js` - Uses `canEditUsers`
- `src/pages/DeviceManagement/DeviceList.js` - Uses `canManageDevices`
- `src/pages/Reports/ReportDashboard.js` - Uses `canViewReports`, `canExportData`

---

## How to Remove Testing Components (Production)

When ready for production, remove:

1. **Remove selector from Header**:
   ```javascript
   // src/components/Header.js
   // Remove this line:
   <RoleAccessSelector />
   ```

2. **Remove selector component files**:
   - Delete `src/components/RoleAccessSelector.js`
   - Delete `src/components/RoleAccessSelector.css`

3. **Update AuthContext default**:
   ```javascript
   // Set to actual user's role/access from backend
   const [currentUser, setCurrentUser] = useState({
     role: backendUser.role,
     accessLevel: backendUser.accessLevel,
     username: backendUser.username,
   });
   ```

4. **Backend Integration**:
   - Replace test selector with actual authentication
   - Fetch role/access level from backend on login
   - Store in AuthContext
   - Persist in session storage or secure cookie

---

## Troubleshooting

### Issue: Permissions not updating after changing role/access level
**Solution**: Check browser console for errors, ensure usePermissions hook is being used correctly

### Issue: Buttons still visible when they shouldn't be
**Solution**: Check component implementation - ensure conditional rendering based on permission flags

### Issue: Selector not visible
**Solution**:
- Check if Header component is rendering
- Check CSS z-index conflicts
- Verify RoleAccessSelector is imported in Header.js

---

## Console Debugging

To check current permissions in browser console:
```javascript
// In browser DevTools console
// 1. Check current user
console.log('Current User:', /* access via React DevTools */);

// 2. Check permissions
console.log('Permissions:', /* access via React DevTools */);
```

Or use React DevTools:
1. Open React DevTools
2. Find AuthContext in Components tab
3. Check currentUser state
4. Find any component using usePermissions
5. Check returned permission values
