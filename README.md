# EruFlow

A beautiful and modern calendar application with advanced task management features that can be installed on Windows as both a Progressive Web App (PWA) and a native desktop application using Electron.

## ✨ Features

### 📅 Calendar View
- Monthly calendar display with smooth navigation
- Visual indicators for days with tasks
- Click on any date to add tasks
- Today highlighting with special styling
- Task count indicators on calendar days
- Support for repeated tasks with individual completion tracking

### ✅ Advanced Task Management
- Create, edit, and delete tasks with rich details
- Set task priorities (Low, Medium, High)
- Categorize tasks (Work, Personal, Health, Shopping, Other)
- Add descriptions and time to tasks
- **Task Repetition**: Daily, Weekly, Monthly, and Yearly repeating tasks
- **Smart Completion Tracking**: Mark repeated tasks as completed for specific dates
- Filter tasks by status (All, Pending, Completed)
- Priority-based sorting in Today's view

### 🔄 Task Repetition System
- **Daily**: Repeats every day
- **Weekly**: Repeats on the same day of the week
- **Monthly**: Repeats on the same date each month
- **Yearly**: Repeats on the same date each year
- **Monthly by Weekday**: Repeats on specific weekdays of the month (e.g., "1st Monday")
- Individual completion tracking for each occurrence of repeated tasks

### 🎯 Today's View
- Quick access to today's tasks
- Priority-based sorting
- Clean, focused interface
- Shows both one-time and repeated tasks due today

### 🎨 Modern UI
- Glassmorphism design with backdrop blur effects
- Smooth animations and transitions
- Responsive design for all screen sizes
- Beautiful gradient backgrounds
- Modern typography and spacing
- Intuitive task modal with dynamic form fields

### 📱 Multiple Installation Options
- **Progressive Web App (PWA)**: Installable on Windows as a desktop app
- **Electron Desktop App**: Native desktop application
- Offline functionality with service worker
- Background sync capabilities
- App shortcuts for quick actions
- Native-like experience on both platforms

## 🚀 Quick Start

### Method 1: Electron Desktop App (Recommended)

1. **Prerequisites**
   - Node.js installed on your system
   - npm or yarn package manager

2. **Install and Run**
   ```bash
   # Install dependencies
   npm install
   
   # Start the application
   npm start
   ```

3. **Build for Distribution**
   ```bash
   # Build the desktop app
   npm run build
   ```
   The built application will be available in the `dist` folder.

### Method 2: Progressive Web App (PWA)

1. **Open the application in Microsoft Edge or Chrome**
   - Navigate to the application URL
   - Or open `index.html` in your browser

2. **Install as PWA**
   - Look for the install prompt in the bottom-right corner
   - Click "Install" to add to your desktop
   - Or use the browser's install button in the address bar

3. **Launch from Desktop**
   - The app will appear in your Start Menu
   - You can pin it to your taskbar
   - Launch it like any other Windows application

## 📖 Usage Guide

### Adding Tasks
1. Click the "Add Task" button in the sidebar
2. Fill in the task details:
   - **Title** (required)
   - **Description** (optional)
   - **Date** (required)
   - **Time** (optional)
   - **Priority** (Low/Medium/High)
   - **Category** (Work/Personal/Health/Shopping/Other)
   - **Repeat** (None/Daily/Weekly/Monthly/Yearly)
3. For monthly repetition, you can specify:
   - Week of month (1st, 2nd, 3rd, 4th, or Last)
   - Day of week (Sunday through Saturday)
4. Click "Save Task"

### Managing Tasks
- **Complete a task**: Click the checkmark icon
  - For repeated tasks, this marks completion for the current date only
- **Edit a task**: Click the edit icon
- **Delete a task**: Click the trash icon
- **Filter tasks**: Use the filter buttons in the Tasks view

### Calendar Navigation
- **Previous/Next Month**: Use the arrow buttons
- **Go to Today**: Click the "Today" button
- **Add task to specific date**: Click on any date in the calendar
- **View tasks for a date**: Click on dates with task indicators

### Views
- **Calendar**: Monthly view with task indicators and counts
- **Tasks**: List of all tasks with filtering and sorting
- **Today**: Focused view of today's tasks with priority sorting

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox, Grid, and CSS Variables
- **JavaScript (ES6+)**: Application logic and interactivity
- **Electron**: Desktop application framework
- **Progressive Web App (PWA)**: Service worker, manifest, and offline capabilities
- **Font Awesome**: Icons
- **Local Storage**: Data persistence with JSON serialization

### Browser Support
- Chrome 67+
- Edge 79+
- Firefox 67+
- Safari 11.1+

### PWA Features
- **Service Worker**: Offline caching and background sync
- **Web App Manifest**: Installation and app-like experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Local Storage**: Data persistence without server
- **App Shortcuts**: Quick access to common actions

### Electron Features
- **Native Desktop App**: Runs as a standalone application
- **Cross-platform**: Works on Windows, macOS, and Linux
- **System Integration**: Native notifications and system tray
- **No default menu bar**: Cleaner UI with the top menu bar removed

## 📁 File Structure

```
eruflow/
├── index.html              # Main HTML file
├── styles.css              # CSS styles with modern design
├── app.js                  # JavaScript application logic
├── main.js                 # Electron main process
├── package.json            # Node.js dependencies and scripts
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── icons/                  # App icons (various sizes)
├── generate-icons.html     # Icon generation utility
├── create-icons.html       # Icon creation tool
├── launcher.html           # App launcher page
└── README.md              # This file
```

## 🎨 Customization

### Colors and Theme
The app uses a purple gradient theme. You can customize colors by editing the CSS variables in `styles.css`:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}
```

### Adding Categories
To add new task categories, edit the select options in `index.html` and update the CSS styles accordingly.

### Modifying Icons
Replace the icon files in the `icons/` directory with your own designs. Make sure to maintain the same file names and sizes. Use the included icon generation tools for creating new icon sets.

### Electron Configuration
Modify `package.json` to customize the Electron build:
- Change app name and description
- Adjust window size and properties
- Configure build targets and options
- **Menu Bar**: The default menu bar is removed for a cleaner look. To restore it, remove or comment out `mainWindow.removeMenu();` in `main.js`.

## 🔧 Development

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. For PWA testing, serve files with a local server

### Building
- **Electron**: `npm run build`
- **PWA**: Deploy files to a web server
- **Icons**: Use the included icon generation tools

### Build Output
After successful build, you'll find:
- **Directory**: `dist/EruFlow-win32-x64/` (folder with executable)
- **Unpacked**: `dist/win-unpacked/` (development version)

### Debugging
- Electron: Use `mainWindow.webContents.openDevTools()` in `main.js`
- PWA: Use browser developer tools
- Check browser console for error messages

## 🚨 Troubleshooting

### Common Issues

#### Installation Issues
- **Electron app not starting**: Ensure Node.js is installed and dependencies are installed
- **PWA install button not appearing**: Make sure you're using a supported browser (Chrome/Edge)
- **App not installing**: Check that the manifest.json file is accessible
- **Offline not working**: Ensure the service worker is properly registered

#### Build Issues
- **Permission denied**: Run as Administrator or use portable build
- **Missing author field**: Ensure package.json has an author field
- **Cache corruption**: Clear electron-builder cache manually
- **Build fails**: Try clean reinstall

#### Data Issues
- **Tasks not saving**: Check that localStorage is enabled in your browser
- **Data lost**: Tasks are stored locally in the browser's localStorage
- **Repeated tasks not showing**: Verify the repetition logic and date calculations

#### Performance Issues
- **Slow loading**: Clear browser cache and reload
- **Animations lagging**: Check your device's performance settings
- **Electron app slow**: Check system resources and close unnecessary applications

### Quick Fixes

#### Windows Build Issues
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
npm run build
```

#### Cache Issues
```powershell
# Clear electron-builder cache
Remove-Item -Recurse -Force "$env:USERPROFILE\AppData\Local\electron-builder\Cache" -ErrorAction SilentlyContinue
npm run build
```

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs or issues
- Suggesting new features
- Improving documentation
- Submitting pull requests
- Testing on different platforms

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For support or questions:
- Check the troubleshooting section above
- Review the browser console for error messages
- Ensure all files are present and accessible
- Test with different browsers and platforms
- Check the Electron and PWA documentation for advanced issues

---

**Enjoy your enhanced calendar and task management experience!** 🎉 