// ===== Application State =====
let map;
let markers = [];
let photos = [];
let currentUser = null;
let currentPhotoId = null;

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    checkAuth();
    loadPhotos();
    setupEventListeners();
    addSampleData();
});

// ===== Authentication =====
function checkAuth() {
    const savedUser = localStorage.getItem('freely_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('userProfile').style.display = 'flex';
    document.getElementById('myPhotosBtn').style.display = 'flex';

    // Set user info
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userAvatar').src = currentUser.avatar || generateAvatar(currentUser.username);
}

function updateUIForLoggedOutUser() {
    document.getElementById('loginBtn').style.display = 'flex';
    document.getElementById('userProfile').style.display = 'none';
    document.getElementById('myPhotosBtn').style.display = 'none';
    currentUser = null;
}

function generateAvatar(username) {
    // Generate a colorful avatar based on username
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const index = username.charCodeAt(0) % colors.length;
    const initial = username.charAt(0).toUpperCase();

    const svg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='${colors[index]}'/%3E%3Ctext x='50' y='50' font-size='50' text-anchor='middle' dy='0.35em' fill='white' font-family='Arial'%3E${initial}%3C/text%3E%3C/svg%3E`;

    return svg;
}

// ===== Map Initialization =====
function initializeMap() {
    // Initialize map centered on Philippines
    map = L.map('map').setView([12.8797, 121.7740], 6);

    // Add dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Add click event to map for location selection
    map.on('click', (e) => {
        const uploadPanel = document.getElementById('uploadPanel');
        if (uploadPanel.classList.contains('active')) {
            document.getElementById('photoLat').value = e.latlng.lat.toFixed(6);
            document.getElementById('photoLng').value = e.latlng.lng.toFixed(6);
        }
    });
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('uploadBtn').addEventListener('click', () => {
        if (!currentUser) {
            showNotification('Please login first to share photos', 'error');
            openAuthModal();
            return;
        }
        document.getElementById('uploadPanel').classList.add('active');
        document.getElementById('myPhotosPanel').classList.remove('active');
        document.getElementById('uploadBtn').classList.add('active');
        document.getElementById('exploreBtn').classList.remove('active');
        document.getElementById('myPhotosBtn').classList.remove('active');
    });

    document.getElementById('exploreBtn').addEventListener('click', () => {
        document.getElementById('uploadPanel').classList.remove('active');
        document.getElementById('myPhotosPanel').classList.remove('active');
        document.getElementById('exploreBtn').classList.add('active');
        document.getElementById('uploadBtn').classList.remove('active');
        document.getElementById('myPhotosBtn').classList.remove('active');
    });

    document.getElementById('myPhotosBtn').addEventListener('click', () => {
        loadMyPhotos();
        document.getElementById('myPhotosPanel').classList.add('active');
        document.getElementById('uploadPanel').classList.remove('active');
        document.getElementById('myPhotosBtn').classList.add('active');
        document.getElementById('exploreBtn').classList.remove('active');
        document.getElementById('uploadBtn').classList.remove('active');
    });

    document.getElementById('closeUploadBtn').addEventListener('click', () => {
        document.getElementById('uploadPanel').classList.remove('active');
        document.getElementById('exploreBtn').classList.add('active');
        document.getElementById('uploadBtn').classList.remove('active');
    });

    document.getElementById('closeMyPhotosBtn').addEventListener('click', () => {
        document.getElementById('myPhotosPanel').classList.remove('active');
        document.getElementById('exploreBtn').classList.add('active');
        document.getElementById('myPhotosBtn').classList.remove('active');
    });

    // Authentication
    document.getElementById('loginBtn').addEventListener('click', openAuthModal);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('authModalClose').addEventListener('click', closeAuthModal);
    document.getElementById('authModalOverlay').addEventListener('click', closeAuthModal);

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tabName === 'login') {
                document.getElementById('loginForm').style.display = 'block';
                document.getElementById('signupForm').style.display = 'none';
            } else {
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('signupForm').style.display = 'block';
            }
        });
    });

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);

    // File upload
    const uploadArea = document.getElementById('uploadArea');
    const photoUpload = document.getElementById('photoUpload');
    const previewImage = document.getElementById('previewImage');

    uploadArea.addEventListener('click', () => photoUpload.click());

    photoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.classList.add('active');
                uploadArea.classList.add('has-image');
                document.querySelector('.upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.classList.add('active');
                uploadArea.classList.add('has-image');
                document.querySelector('.upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Use current location
    document.getElementById('useCurrentLocation').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    document.getElementById('photoLat').value = position.coords.latitude.toFixed(6);
                    document.getElementById('photoLng').value = position.coords.longitude.toFixed(6);
                    map.setView([position.coords.latitude, position.coords.longitude], 13);
                    showNotification('Location detected!', 'success');
                },
                (error) => {
                    showNotification('Could not get your location. Please enter manually.', 'error');
                }
            );
        } else {
            showNotification('Geolocation is not supported by your browser.', 'error');
        }
    });

    // Form submission
    document.getElementById('uploadForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handlePhotoUpload();
    });

    // Modal
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', closeModal);

    // Delete photo
    document.getElementById('deletePhotoBtn').addEventListener('click', handleDeletePhoto);
}

// ===== Authentication Handlers =====
function openAuthModal() {
    document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
    // Reset forms
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
}

function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('freely_users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = { ...user };
        delete currentUser.password; // Don't store password in current session
        localStorage.setItem('freely_current_user', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        closeAuthModal();
        showNotification(`Welcome back, ${username}!`, 'success');
    } else {
        showNotification('Invalid username or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('freely_users') || '[]');

    // Check if username exists
    if (users.some(u => u.username === username)) {
        showNotification('Username already exists', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        avatar: generateAvatar(username),
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('freely_users', JSON.stringify(users));

    // Auto login
    currentUser = { ...newUser };
    delete currentUser.password;
    localStorage.setItem('freely_current_user', JSON.stringify(currentUser));
    updateUIForLoggedInUser();
    closeAuthModal();
    showNotification(`Welcome to Freely, ${username}!`, 'success');
}

function logout() {
    localStorage.removeItem('freely_current_user');
    updateUIForLoggedOutUser();
    showNotification('Logged out successfully', 'success');

    // Close panels
    document.getElementById('uploadPanel').classList.remove('active');
    document.getElementById('myPhotosPanel').classList.remove('active');
    document.getElementById('exploreBtn').classList.add('active');
    document.getElementById('uploadBtn').classList.remove('active');
}

// ===== Photo Upload Handler =====
function handlePhotoUpload() {
    if (!currentUser) {
        showNotification('Please login first', 'error');
        return;
    }

    const previewImage = document.getElementById('previewImage');
    const caption = document.getElementById('photoCaption').value;
    const location = document.getElementById('photoLocation').value;
    const lat = parseFloat(document.getElementById('photoLat').value);
    const lng = parseFloat(document.getElementById('photoLng').value);

    if (!previewImage.src || previewImage.src === window.location.href) {
        showNotification('Please select a photo to upload', 'error');
        return;
    }

    if (!location || isNaN(lat) || isNaN(lng)) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const photo = {
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        image: previewImage.src,
        caption: caption || 'No caption provided',
        location: location,
        lat: lat,
        lng: lng,
        date: new Date().toISOString()
    };

    photos.push(photo);
    savePhotos();
    addMarker(photo);
    updateStats();
    resetForm();

    showNotification('Photo shared successfully!', 'success');

    // Close upload panel
    document.getElementById('uploadPanel').classList.remove('active');
    document.getElementById('exploreBtn').classList.add('active');
    document.getElementById('uploadBtn').classList.remove('active');

    // Zoom to new photo
    map.setView([lat, lng], 13);
}

// ===== My Photos =====
function loadMyPhotos() {
    const myPhotos = photos.filter(p => p.userId === currentUser.id);
    const grid = document.getElementById('myPhotosGrid');
    const emptyState = document.getElementById('emptyPhotosState');

    grid.innerHTML = '';

    if (myPhotos.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        myPhotos.reverse().forEach(photo => {
            const card = document.createElement('div');
            card.className = 'photo-card';
            card.innerHTML = `
                <img src="${photo.image}" alt="${photo.location}">
                <div class="photo-card-info">
                    <div class="photo-card-location">${photo.location}</div>
                    <div class="photo-card-date">${formatDate(photo.date)}</div>
                </div>
            `;
            card.addEventListener('click', () => openModal(photo.id));
            grid.appendChild(card);
        });
    }
}

// ===== Marker Management =====
function addMarker(photo) {
    // Create custom icon
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: transform 0.3s ease;
            ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const marker = L.marker([photo.lat, photo.lng], { icon: customIcon }).addTo(map);

    // Create popup content
    const popupContent = `
        <div class="popup-content">
            <img src="${photo.image}" alt="${photo.location}" class="popup-image" onclick="openModal(${photo.id})">
            <div class="popup-location">${photo.location}</div>
            <div class="popup-caption">${photo.caption}</div>
            <div class="popup-date">by ${photo.username} • ${formatDate(photo.date)}</div>
        </div>
    `;

    marker.bindPopup(popupContent, {
        maxWidth: 220,
        className: 'custom-popup'
    });

    markers.push({ id: photo.id, marker: marker });

    // Add hover effect
    marker.on('mouseover', function () {
        this._icon.querySelector('div').style.transform = 'scale(1.2)';
    });

    marker.on('mouseout', function () {
        this._icon.querySelector('div').style.transform = 'scale(1)';
    });
}

// ===== Modal Functions =====
function openModal(photoId) {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    currentPhotoId = photoId;

    document.getElementById('modalImage').src = photo.image;
    document.getElementById('modalLocation').textContent = photo.location;
    document.getElementById('modalCaption').textContent = photo.caption;
    document.getElementById('modalDate').textContent = formatDate(photo.date);
    document.getElementById('modalUser').textContent = `by ${photo.username}`;

    // Show delete button if it's the user's own photo
    const modalActions = document.getElementById('modalActions');
    if (currentUser && photo.userId === currentUser.id) {
        modalActions.style.display = 'block';
    } else {
        modalActions.style.display = 'none';
    }

    document.getElementById('photoModal').classList.add('active');
}

function closeModal() {
    document.getElementById('photoModal').classList.remove('active');
    currentPhotoId = null;
}

// ===== Delete Photo =====
function handleDeletePhoto() {
    if (!currentPhotoId || !currentUser) return;

    const photo = photos.find(p => p.id === currentPhotoId);
    if (!photo || photo.userId !== currentUser.id) {
        showNotification('You can only delete your own photos', 'error');
        return;
    }

    if (confirm('Are you sure you want to delete this photo?')) {
        // Remove from array
        photos = photos.filter(p => p.id !== currentPhotoId);
        savePhotos();

        // Remove marker
        const markerObj = markers.find(m => m.id === currentPhotoId);
        if (markerObj) {
            map.removeLayer(markerObj.marker);
            markers = markers.filter(m => m.id !== currentPhotoId);
        }

        updateStats();
        closeModal();
        showNotification('Photo deleted successfully', 'success');

        // Refresh my photos if panel is open
        if (document.getElementById('myPhotosPanel').classList.contains('active')) {
            loadMyPhotos();
        }
    }
}

// ===== Local Storage =====
function savePhotos() {
    localStorage.setItem('freely_photos', JSON.stringify(photos));
}

function loadPhotos() {
    const saved = localStorage.getItem('freely_photos');
    if (saved) {
        photos = JSON.parse(saved);
        photos.forEach(photo => addMarker(photo));
        updateStats();
    }
}

// ===== Helper Functions =====
function resetForm() {
    document.getElementById('uploadForm').reset();
    document.getElementById('previewImage').classList.remove('active');
    document.getElementById('previewImage').src = '';
    document.getElementById('uploadArea').classList.remove('has-image');
    document.querySelector('.upload-placeholder').style.display = 'block';
}

function updateStats() {
    document.getElementById('photoCount').textContent = photos.length;

    // Count unique locations
    const uniqueLocations = new Set(photos.map(p => `${p.lat},${p.lng}`));
    document.getElementById('locationCount').textContent = uniqueLocations.size;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        font-weight: 500;
        animation: slideInRight 0.4s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ===== Sample Data =====
function addSampleData() {
    // Only add if no photos exist
    if (photos.length > 0) return;

    // Create a sample user for demo photos
    const demoUser = {
        id: 0,
        username: 'FreelySamples',
        avatar: generateAvatar('FreelySamples')
    };

    const samplePhotos = [
        {
            id: 1,
            userId: 0,
            username: 'FreelySamples',
            userAvatar: demoUser.avatar,
            image: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800&q=80',
            caption: 'Beautiful sunset over Manila Bay 🌅',
            location: 'Manila Bay, Manila',
            lat: 14.5547,
            lng: 120.9774,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 2,
            userId: 0,
            username: 'FreelySamples',
            userAvatar: demoUser.avatar,
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
            caption: 'Amazing view from Tagaytay! The weather is perfect today 🌤️',
            location: 'Tagaytay, Cavite',
            lat: 14.1040,
            lng: 120.9605,
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 3,
            userId: 0,
            username: 'FreelySamples',
            userAvatar: demoUser.avatar,
            image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&q=80',
            caption: 'Beach paradise in Boracay! Crystal clear waters 🏖️',
            location: 'White Beach, Boracay',
            lat: 11.9674,
            lng: 121.9248,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 4,
            userId: 0,
            username: 'FreelySamples',
            userAvatar: demoUser.avatar,
            image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
            caption: 'Rice terraces are breathtaking! 🌾',
            location: 'Banaue Rice Terraces, Ifugao',
            lat: 16.9267,
            lng: 121.0533,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 5,
            userId: 0,
            username: 'FreelySamples',
            userAvatar: demoUser.avatar,
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
            caption: 'Coffee shop vibes in Cavite ☕',
            location: 'Imus, Cavite',
            lat: 14.4297,
            lng: 120.9367,
            date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
    ];

    photos = samplePhotos;
    savePhotos();
    photos.forEach(photo => addMarker(photo));
    updateStats();
}

// ===== Animation Styles (added dynamically) =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
