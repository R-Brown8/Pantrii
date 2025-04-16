# FlavorMind MVP 3 Debugging Features

This document outlines the debugging features added to the FlavorMind MVP 3 application to help diagnose and fix issues, particularly with the expiring soon tab/filter not updating properly.

## Overview of the Issue

The main issue was that when adding items that are expired or expiring soon, the respective tabs/filters were not always updating to show these new items. This was likely due to a few potential issues:

1. Timing issues between state updates
2. Reference equality checks preventing re-renders
3. Date calculation inconsistencies
4. Filter logic not being triggered after item addition

## Added Debugging Features

### 1. Debug Logger System

A centralized logging system (`src/utils/debug/logger.js`) was added to provide consistent, categorized logging throughout the app. Key features:

- Categorized logs (state, filters, dates, UI, storage, lifecycle)
- Enable/disable specific categories
- Master switch to enable/disable all debugging
- Easy-to-use logging functions

### 2. Debug Configuration

A central debug configuration file (`src/constants/debug.js`) was added to control debugging features:

- Master debug switch
- Individual feature toggles
- Specific debugging flags
- Configurable limits

### 3. Debug Controller Component

A visual debug controller component (`src/components/debug/DebugController.js`) was added to:

- Monitor expiring and expired items
- Check for date parsing issues
- Enable/disable debug features at runtime
- View detailed information about items in each category

### 4. ExpiryRefresher Component

A utility component (`src/components/pantry/ExpiryRefresher.js`) that specifically tracks expiry status changes and forces updates when needed.

### 5. Enhanced Logging

Extensive logging was added throughout the application:

- **AppContext.js**: Logs state changes, item additions/removals, and expiry calculations
- **PantryScreen.js**: Logs filter changes, UI interactions, and component lifecycle
- **PantryItemForm.js**: Logs form submissions and expiry date changes
- **DateUtils.js**: Logs date calculations and comparisons

### 6. Force Refresh Mechanism

A force refresh mechanism was added to ensure UI updates after state changes:

- `forceExpiryRefresh()` function in AppContext.js
- Delayed refresh after item actions (add/update/remove)
- New array references to trigger React's change detection

## How to Use

### Debug Controller

The debug controller appears as a bug icon in the top-right corner of the app. Tap it to:

1. View current statistics (Status tab)
2. See detailed information about expiring/expired items (Expiring tab)
3. Configure debug settings (Settings tab)

### Console Logs

Check the console logs for detailed information about app operations. Logs are prefixed with their category:

- `[STATE]` - State management logs
- `[FILTERS]` - Filter-related logs
- `[DATES]` - Date calculation logs
- `[UI]` - UI component logs
- `[STORAGE]` - AsyncStorage operations
- `[LIFECYCLE]` - Component lifecycle logs

### Disable Debugging

To disable debugging in production:

1. Open `src/constants/debug.js`
2. Set `ENABLE_DEBUG` to `false`

## Key Files Modified

1. `src/utils/debug/logger.js` - New file for logging functions
2. `src/constants/debug.js` - New file for debug configuration
3. `src/components/debug/DebugController.js` - New file for debug UI
4. `src/components/pantry/ExpiryRefresher.js` - New file for tracking expiry changes
5. `src/context/AppContext.js` - Added logging and refresh mechanisms
6. `src/screens/PantryScreen.js` - Added debug button and logging
7. `src/components/pantry/PantryItemForm.js` - Added form validation logging
8. `src/utils/dateUtils.js` - Added date calculation logging
9. `App.js` - Added debug controller component

## Potential Fixes

The main issue with expiring items not showing up in the appropriate tab is likely addressed by:

1. The forced refresh after item operations
2. The ExpiryRefresher component that tracks changes
3. Detailed logging to trace the flow of data

When adding a new expired item, the system now:

1. Logs the addition
2. Updates the state
3. Forces a refresh after a short delay
4. Logs whether the item should appear in the current filter

This multiple-layered approach should ensure that the UI stays in sync with the data state, particularly for expiring and expired items.