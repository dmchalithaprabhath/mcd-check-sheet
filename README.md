# MCD Check sheet

A Progressive Web App (PWA) for managing daily checklists for McDonald's with offline functionality, PDF export, and sharing capabilities. The app uses the McDonald's logo and branding.

## Features

### 📋 Core Functionality
- **Add/Delete checklist items** - Easily manage your daily tasks
- **Mark items as complete/incomplete** - Track your progress with visual checkboxes
- **Display completion percentage** - Real-time progress tracking with animated progress bar
- **Add notes to each item** - Add detailed notes and comments to any checklist item

### 🕓 Data Management
- **Automatic daily history** - Each day's checklist is automatically saved and preserved
- **Offline functionality** - Works completely offline using service worker caching
- **Local storage** - All data is stored locally on your device

### 📄 Export & Sharing
- **PDF generation** - Generate professional PDF reports with clear visual distinction between completed and pending items
- **Email sharing** - Share PDF reports directly via email with attachment support
- **WhatsApp sharing** - Share PDF reports via WhatsApp with attachment support
- **Download PDF** - Save PDF reports to your device
- **Visual PDF design** - Completed items shown with green backgrounds, pending items with red backgrounds

### 📱 PWA Features
- **Install on Android** - Install as a native app through Chrome
- **Offline access** - Works without internet connection
- **App-like experience** - Full-screen, standalone app experience
- **Responsive design** - Optimized for mobile and desktop

## Installation

### For Android Users (Chrome)

1. **Open the app** in Chrome browser on your Android device
2. **Look for the install prompt** - Chrome will show an "Add to Home Screen" prompt
3. **Tap "Install"** - The app will be installed on your device
4. **Access from home screen** - The app will appear like a native app

### Manual Installation

If the install prompt doesn't appear:

1. Open Chrome and navigate to the app
2. Tap the three-dot menu (⋮) in the top-right corner
3. Select "Add to Home Screen" or "Install App"
4. Follow the prompts to complete installation

### For Desktop Users

1. Open the app in Chrome browser
2. Click the install icon in the address bar (if available)
3. Or use the three-dot menu → "Install Daily Checklist App"

## Usage

### Getting Started

1. **Open the app** - The app loads with your predefined checklist items
2. **Check off items** - Tap the checkbox next to any item to mark it complete
3. **Add notes** - Tap the edit button to add notes to any item
4. **Track progress** - Watch the progress bar update in real-time

### Adding New Items

1. Tap the **"Add Item"** button in the header
2. Enter the item title (required)
3. Add optional notes
4. Tap **"Add Item"** to save

### Editing Items

1. Tap the **edit button** (pencil icon) next to any item
2. Modify the title or notes
3. Tap **"Save Changes"** to update

### Exporting & Sharing

1. Tap the **"Export PDF"** button in the header
2. Choose your sharing method:
   - **Email** - Opens your default email app with the report
   - **WhatsApp** - Opens WhatsApp with a summary
   - **Download** - Saves the PDF to your device

## Default Checklist Items

The app comes pre-loaded with these daily checklist items:

- Close Manager sign
- Crew information
- Timeline check - Ebis
- Next day documents
- Digital PMC
- Daily
- Monthly
- BIB
- Ice Maker Switch
- Green file
- Office Air conditioner off
- Office lights off
- Window blinders
- Coupon stand, toys, fan
- TV, Radio
- Counter Air conditioners
- Gas Valve x 3
- Marinatior, 4 Switches
- Grill, Steamer, Toasters, monitors
- Utility data – if Sunday
- Door lock checks x2
- POS key keeping
- Continuations
- 2 heater lights
- Outside banner lights
- Shelf-life check sheet
- Cycle cut paper, soft machine oil check sheet
- De frosting Edamame, Macaron, Whip cream
- Sink close (Drier, Tempering, Auto sink, Buns, Hot water, valves)
- Hand washing sheet
- Daily close x 2 Papers
- Duct off
- Secom on

## Technical Details

### PWA Features
- **Service Worker** - Enables offline functionality and caching
- **Web App Manifest** - Allows installation as a native app
- **Local Storage** - Stores all data locally on the device
- **Responsive Design** - Works on all screen sizes

### Browser Support
- **Chrome** (recommended for Android installation)
- **Firefox**
- **Safari**
- **Edge**

### Offline Capabilities
- Works completely offline after first load
- Automatically caches all resources
- Syncs data when connection is restored

## Development

### File Structure
```
Daily Checklist App/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js              # Main JavaScript application
├── sw.js               # Service Worker
├── manifest.json       # PWA manifest
├── icons/              # App icons (various sizes)
└── README.md           # This file
```

### Local Development

1. **Clone or download** the project files
2. **Open index.html** in a web browser
3. **For PWA testing** - Use a local server (e.g., `python -m http.server 8000`)

### Customization

- **Modify default items** - Edit the `createDefaultChecklist()` function in `app.js`
- **Change styling** - Modify `styles.css` for custom colors and layout
- **Add features** - Extend the `DailyChecklistApp` class in `app.js`

## Privacy & Security

- **No data collection** - All data stays on your device
- **No tracking** - No analytics or tracking scripts
- **Local storage only** - Data is never sent to external servers
- **Offline-first** - Designed to work without internet connection

## Support

For issues or questions:
1. Check that you're using a supported browser
2. Ensure JavaScript is enabled
3. Try clearing browser cache if experiencing issues
4. For PWA installation issues, ensure you're using Chrome on Android

## License

This project is open source and available under the MIT License. 