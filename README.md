# Freely - Location-Based Photo Sharing 🌍📸

A stunning web application where users can share photos on an interactive map and explore pictures from around the world!

## 🌐 Live Demo

**🚀 Try it now:** [https://freely-photo-map.vercel.app](https://freely-photo-map.vercel.app)

**GitHub Repository:** [https://github.com/Kuyamarcs05/freely-photo-map](https://github.com/Kuyamarcs05/freely-photo-map)

## Features ✨

### Core Features
- **User Authentication**: Secure login/signup system with localStorage
- **User Profiles**: Each user gets a unique avatar and profile
- **Interactive Map**: Explore photos on a beautiful dark-themed map centered on the Philippines
- **Photo Sharing**: Upload and share your photos with location tagging
- **Photo Management**: View, manage, and delete your own photos
- **My Photos Gallery**: Dedicated view to see all your shared photos
- **Location Detection**: Automatically detect your current location or click on the map
- **Photo Gallery**: View photos in a stunning modal with full details
- **Real-time Stats**: Track the number of photos and locations shared
- **Sample Data**: Pre-loaded with beautiful sample photos from Philippines locations

### User Data & Privacy
- **User Ownership**: Every photo is tied to the user who uploaded it
- **Delete Rights**: Users can only delete their own photos
- **Secure Storage**: All data stored locally in browser's localStorage
  - `freely_users`: All registered user accounts
  - `freely_current_user`: Current logged-in session
  - `freely_photos`: All shared photos with ownership metadata
- **No Backend Required**: Everything runs client-side for privacy
- **Persistent Sessions**: Stay logged in across page refreshes

## Technology Stack 🛠️

- **HTML5**: Semantic structure with SEO optimization
- **CSS3**: Modern design with:
  - Dark theme with glassmorphism effects
  - Smooth animations and transitions
  - Gradient backgrounds
  - Responsive design
  - Custom scrollbars
- **JavaScript**: Vanilla JS for all functionality
- **Leaflet.js**: Interactive mapping library
- **Local Storage**: Client-side data persistence

## How to Use 🚀

### 1. Create an Account
1. Open `index.html` in your browser
2. Click the "Login" button in the header
3. Switch to the "Sign Up" tab
4. Fill in:
   - Username (minimum 3 characters)
   - Email address
   - Password (minimum 6 characters)
   - Confirm password
5. Click "Create Account"
6. You'll be automatically logged in!

### 2. Login to Existing Account
1. Click the "Login" button
2. Enter your username and password
3. Click "Login"
4. Your session persists across page refreshes

### 3. Explore Photos
- Browse the map - sample photos from Philippines are pre-loaded
- Click on map markers (purple gradient circles) to see photo popups
- Click on any photo in a popup to view it in full size
- See who posted each photo and when

### 4. Share Your Own Photos
1. Make sure you're logged in
2. Click the "Share Photo" button in the header
3. Upload your photo:
   - Click the upload area or drag & drop an image
   - Supported: PNG, JPG, GIF up to 10MB
4. Add a caption (optional but recommended)
5. Set the location:
   - **Option A**: Click "Use My Current Location" to auto-detect
   - **Option B**: Click anywhere on the map to select coordinates
   - **Option C**: Manually enter latitude and longitude
6. Enter a location name (e.g., "Cavite, Philippines")
7. Click "Share to the World"
8. Your photo appears on the map instantly!

### 5. Manage Your Photos
1. Click "My Photos" button (visible when logged in)
2. View all your uploaded photos in a grid
3. Click any photo to view it full-screen
4. Delete unwanted photos:
   - Click a photo to open it
   - Click "Delete Photo" button
   - Confirm deletion
   - Photo removed from map and your gallery

### 6. User Profile
- Your profile shows in the top-right corner when logged in
- Displays your auto-generated avatar and username
- Click the logout icon to sign out

### Sample Locations

The app comes pre-loaded with photos from:
- Manila Bay, Manila
- Tagaytay, Cavite
- White Beach, Boracay
- Banaue Rice Terraces, Ifugao
- Imus, Cavite

## Features Breakdown 🎨

### Beautiful UI/UX
- **Premium Design**: Modern gradients, smooth animations, and micro-interactions
- **Dark Theme**: Easy on the eyes with vibrant accent colors
- **Glassmorphism**: Frosted glass effects for modals and panels
- **Responsive**: Works on desktop, tablet, and mobile devices

### Interactive Map
- **Custom Markers**: Beautiful gradient markers with hover effects
- **Popups**: Rich popups with photo previews
- **Click to Select**: Click anywhere on the map to set photo location
- **Smooth Animations**: Markers and popups animate smoothly

### Smart Features
- **Geolocation**: Auto-detect user's current location
- **Image Preview**: See your photo before uploading
- **Drag & Drop**: Easy photo upload with drag and drop
- **Date Formatting**: Smart relative date display (Today, Yesterday, X days ago)
- **Notifications**: Beautiful toast notifications for user feedback
- **Data Persistence**: All photos saved to browser's local storage

## File Structure 📁

```
photo-map-app/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── app.js          # Application logic and interactivity
└── README.md       # This file
```

## Customization 🎨

### Change Map Center
Edit `app.js` line 11:
```javascript
map = L.map('map').setView([YOUR_LAT, YOUR_LNG], ZOOM_LEVEL);
```

### Change Color Scheme
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* Add your colors */
}
```

### Add More Sample Photos
Edit the `addSampleData()` function in `app.js`

## Browser Support 🌐

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Future Enhancements 💡

- User authentication
- Backend database integration
- Photo likes and comments
- Photo filters and editing
- Social sharing
- Search and filter functionality
- Clustering for large numbers of photos
- Photo albums/collections
- User profiles

## Credits 🙏

- **Maps**: [Leaflet.js](https://leafletjs.com/)
- **Map Tiles**: [CARTO](https://carto.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/)
- **Sample Images**: [Unsplash](https://unsplash.com/)

## License 📄

Free to use and modify for personal and commercial projects.

---

**Built with ❤️ for the Philippines and the world!**

Explore, Share, Connect - Freely! 🌏
