# 🔗 Link Collector - Chrome Extension

A powerful Chrome extension that efficiently collects links from specific areas of a webpage and opens them all at once.

![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome](https://img.shields.io/badge/chrome-manifest%20v3-brightgreen)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)

---

## ✨ Key Features

### 🎯 Core Features
- **Quick Link Collection**: Press Z key (or custom hotkey) to select an area and collect all links
- **Automatic Deduplication**: Duplicate links are automatically removed
- **Real-time Link Count**: Display the number of links in the selected area in real-time
- **Visual Selection Box**: Blue-bordered box shows the selected area

### ⚙️ Advanced Features
- **Customizable Hotkey**: Change the default Z key to any key you prefer
- **Flexible Open Methods**:
  - New Tab (Focus)
  - New Tab (Background)
  - New Window
- **Max Tabs Limit**: Set a limit on maximum tabs to open at once (1~50, default: 10)
- **Color Customization**: Change the selection box color freely
- **Domain Filtering**: Option to open only links from the current domain
- **Confirmation Dialog**: Optional confirmation before opening links
- **Multi-language Support**: Korean, English, Japanese

---

## 📥 Installation

### Chrome Web Store (Recommended)
1. Visit [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "Link Collector"
3. Click "Add to Chrome"
4. Approve permissions

### Developer Mode Installation
1. Clone or download this repository
   ```bash
   git clone https://github.com/turbobit/open-new-tab-chrome-ext.git
   cd open-new-tab-chrome-ext
   ```

2. Open Chrome: `chrome://extensions/`

3. Enable **Developer Mode** (top-right toggle)

4. Click **"Load unpacked"**

5. Select the project folder

---

## 🚀 Usage

### Step 1: Open Settings
- Click the extension icon in the top-right corner
- Adjust your preferences in the popup window
- Click "Save"

### Step 2: Select Links
- Press **Z key** (or your custom hotkey) on a webpage
- **Drag your mouse** to select the area containing links
- **Real-time display** of link count in the selection area

### Step 3: Open Links
- **Release the Z key**
- Confirmation dialog appears (if enabled)
- Links open automatically using your chosen method

---

## ⚙️ Settings

| Option | Default | Description |
|--------|---------|-------------|
| **Hotkey** | `z` | Key to start area selection (1 character) |
| **Open Mode** | New Tab (Focus) | How to open links |
| **Max Tabs** | 10 | Maximum tabs to open at once (1~50) |
| **Box Color** | #007bff | Selection area box color |
| **Domain Filter** | OFF | Open only links from current domain |
| **Confirm Dialog** | OFF | Show confirmation before opening |

---

## 🛠️ Technical Specifications

### Project Structure
```
open-new-tab-chrome-ext/
├── manifest.json              # Chrome extension configuration
├── content.js                 # Web page content script
├── background.js              # Background service worker
├── popup.html                 # Settings popup UI
├── popup.js                   # Popup logic
├── icon-*.png                 # Extension icons (various sizes)
├── README.md                  # Documentation (Korean)
├── README.en.md               # Documentation (English)
├── PRIVACY_POLICY.md          # Privacy policy
├── STORE_DEPLOYMENT.md        # Deployment guide
├── CONTRIBUTING.md            # Contribution guidelines
├── .gitignore                 # Git configuration
├── _locales/                  # Multi-language support
│   ├── ko/messages.json       # Korean
│   ├── en/messages.json       # English
│   └── ja/messages.json       # Japanese
└── create-release.py          # Release package generator
```

### Technology Stack
- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No external libraries
- **Chrome Storage API** - Settings synchronization
- **Chrome Tabs API** - Tab management

### Permissions
- `tabs` - Create and manage tabs
- `storage` - Save/load user settings

### Features
- ✅ Lightweight (~8KB)
- ✅ Security-first (CSP compliant, XSS prevention)
- ✅ Performance optimized (Throttling, Set usage)
- ✅ Real-time settings update
- ✅ Multi-language support (Korean, English, Japanese)

---

## 🐛 Troubleshooting

### Q: The Z key doesn't work
**A:**
1. Verify the extension is running on the site
2. Check permissions at `chrome://extensions`
3. Look for hotkey conflicts with other extensions
4. Try changing the hotkey to a different key

### Q: Links won't open
**A:**
1. `javascript:` and `mailto:` links are excluded
2. If confirmation dialog is enabled, click "Open" button
3. Check your max tabs setting
4. Verify the selected area actually contains links

### Q: Settings aren't saving
**A:**
1. Make sure you clicked the "Save" button
2. Check for save confirmation message (displays for 2 seconds)
3. Refresh and try again
4. Check sync settings (`chrome://settings/syncSetup`)

### Q: Color icon isn't showing
**A:**
1. Reload the extension (`chrome://extensions` > Reload)
2. Clear browser cache
3. Reinstall the extension

---

## 📋 Development & Deployment

### Development Setup
```bash
# Clone repository
git clone https://github.com/turbobit/open-new-tab-chrome-ext.git
cd open-new-tab-chrome-ext

# Load in developer mode
# 1. Open chrome://extensions
# 2. Enable "Developer Mode"
# 3. Click "Load unpacked"
# 4. Select this folder
```

### Generate Release Package
```bash
# Using Python (Recommended)
python3 create-release.py

# Or PowerShell (Windows)
powershell -ExecutionPolicy Bypass -File create-release.ps1

# Or Bash (Linux/Mac)
bash create-release.sh
```

### Chrome Web Store Deployment
See [STORE_DEPLOYMENT.md](./STORE_DEPLOYMENT.md) for detailed instructions

---

## 📝 License

MIT License - Feel free to use, modify, and distribute.

```
MIT License

Copyright (c) 2024 Link Collector Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🤝 Contributing

We welcome bug reports and feature suggestions!

### Report a Bug
1. Open [GitHub Issues](https://github.com/turbobit/open-new-tab-chrome-ext/issues)
2. Provide detailed description
3. Include reproduction steps

### Suggest a Feature
1. Create an Issue or Discussion
2. Explain the feature's purpose
3. Describe expected use cases

### Submit a Pull Request
```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature

# 3. Commit changes
git commit -m "Add your feature"

# 4. Push to branch
git push origin feature/your-feature

# 5. Create a Pull Request
```

### Contribute a Translation
See [CONTRIBUTING.md](./CONTRIBUTING.md) for i18n contribution guidelines.

---

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs and request features](https://github.com/turbobit/open-new-tab-chrome-ext/issues)
- **Chrome Web Store**: [Leave a review or ask questions](https://chrome.google.com/webstore)
- **Documentation**: [STORE_DEPLOYMENT.md](./STORE_DEPLOYMENT.md), [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)

---

## 📊 Version Info

### v1.0 (Current)
- ✅ Core link collection feature
- ✅ Customizable hotkey
- ✅ Settings popup UI
- ✅ Link filtering
- ✅ Confirmation dialog
- ✅ Multi-language support

### Future Plans
- 🔄 Additional language support
- 🔄 Link preview feature
- 🔄 Link history
- 🔄 Keyboard shortcut customization UI

---

## 🙏 Acknowledgments

Thank you to all users who use this project and provide valuable feedback!

---

**Made with ❤️ for Chrome users**

Last updated: February 2026
