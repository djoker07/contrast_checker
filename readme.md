# Color Contrast Checker Extension

## Overview
The **Color Contrast Checker** is a simple Chrome extension that helps users open a tool for checking color contrast accessibility. This extension is designed to make it quick and easy to ensure that your designs meet accessibility standards.

## Features
- Opens a tab for checking color contrast.
- Lightweight and easy to use.
- Perfect for web designers and developers focused on accessibility.

## Installation
1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click on **Load unpacked** and select the directory containing this extension's files.

## Usage
1. After installing the extension, a new icon will appear in the Chrome toolbar.
2. Click on the icon to open the color contrast checker tool in a new tab.

## File Structure
```
|-- manifest.json
|-- index.html
|-- style.css
|-- scripts/
    |-- content.js
|-- icons/
    |-- contrast.svg
    |-- icon16.png
    |-- icon32.png
    |-- icon48.png
    |-- icon128.png
```

- **manifest.json**: Defines the extension's metadata and functionality.
- **content.js**: Contains the logic for background tasks.
- **index.html**: Provides a simple user interface for the extension.
- **style.css**: General styles for the extension.
- **icons/**: Includes icons used for the extension.

## Customization
You can customize the color contrast tool URL by editing the `content.js` or `index.html` file to point to a different resource.

## License
This project is licensed under the MIT License. Feel free to use, modify, and distribute it.

