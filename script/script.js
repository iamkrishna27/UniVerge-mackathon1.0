// script.js

// --- Global UI Elements ---
const messageArea = document.getElementById('message-area');
const navAuthButton = document.getElementById('nav-auth');
const navLogoutButton = document.getElementById('nav-logout');
const navDashboardButton = document.getElementById('nav-dashboard');
const navProfileButton = document.getElementById('nav-profile');
const navStoryboardButton = document.getElementById('nav-storyboard');
const navImpactTrackerButton = document.getElementById('nav-impact-tracker');
const navQuickConnectButton = document.getElementById('nav-quick-connect');
const navResourceBankButton = document.getElementById('nav-resource-bank');
const navConfidenceCornerButton = document.getElementById('nav-confidence-corner');

// NEW: Dropdown elements
const navMoreDropdownButton = document.getElementById('nav-more-dropdown');
const moreDropdownMenu = document.getElementById('more-dropdown-menu');


// Pages
const landingPage = document.getElementById('landing-page');
const authPage = document.getElementById('auth-page');
const dashboardPage = document.getElementById('dashboard-page');
const profilePage = document.getElementById('profile-page');
const storyboardPage = document.getElementById('storyboard-page');
const impactTrackerPage = document.getElementById('impact-tracker-page');
const quickConnectPage = document.getElementById('quick-connect-page');
const resourceBankPage = document.getElementById('resource-bank-page');
const confidenceCornerPage = document.getElementById('confidence-corner-page');

// Auth elements
const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authName = document.getElementById('auth-name');
const authUserType = document.getElementById('auth-userType'); // CORRECTED: Was 'authUserType'
const authHometown = document.getElementById('auth-hometown');
const authLanguage = document.getElementById('auth-language');
const registerFields = document.getElementById('register-fields');
const toggleAuthModeButton = document.getElementById('toggle-auth-mode');
const authSubmitBtn = document.getElementById('auth-submit-btn');

let isRegisterMode = false; // To toggle between login and register forms

// Profile elements
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileType = document.getElementById('profile-type');
const editHometown = document.getElementById('edit-hometown');
const editLanguage = document.getElementById('edit-language');
const editProfession = document.getElementById('edit-profession');
const editProfessionRow = document.getElementById('edit-profession-row');
const profileEditForm = document.getElementById('profile-edit-form');

// Dashboard elements
const dashboardWelcome = document.getElementById('dashboard-welcome');
const studentMatchingSection = document.getElementById('student-matching-section');
const matchingResult = document.getElementById('matching-result');
const matchDetails = document.getElementById('match-details');
const connectMatchBtn = document.getElementById('connect-match-btn');
const studentCareerPathSection = document.getElementById('student-career-path-section');

// Storyboard elements
const storyboardsContainer = document.getElementById('storyboards-container');
const shareJourneySection = document.getElementById('share-journey-section');
const shareJourneyForm = document.getElementById('share-journey-form');
const storyTitleInput = document.getElementById('story-title');
const storyDescriptionInput = document.getElementById('story-description');
const storyImageUrlInput = document.getElementById('story-image-url');

// Quick Connect Elements
const alumniSlotsSection = document.getElementById('alumni-slots-section');
const createSlotForm = document.getElementById('create-slot-form');
const slotDateInput = document.getElementById('slot-date');
const slotTimeInput = document.getElementById('slot-time');
const slotDurationSelect = document.getElementById('slot-duration');
const mySlotsSection = document.getElementById('my-slots-section');
const mySlotsList = document.getElementById('my-slots-list');
const availableSlotsSection = document.getElementById('available-slots-section');
const availableSlotsList = document.getElementById('available-slots-list');

// Resource Bank Elements
const alumniResourceUploadSection = document.getElementById('alumni-resource-upload-section');
const uploadResourceForm = document.getElementById('upload-resource-form');
const resourceTitleInput = document.getElementById('resource-title');
const resourceUrlInput = document.getElementById('resource-url');
const resourceCategorySelect = document.getElementById('resource-category');
const resourceDescriptionInput = document.getElementById('resource-description');
const resourcesContainer = document.getElementById('resources-container');

// Cultural Confidence Corner Elements
const confidencePostForm = document.getElementById('confidence-post-form');
const postContentInput = document.getElementById('post-content');
const confidencePostsContainer = document.getElementById('confidence-posts-container');


// --- Helper Functions ---

/**
 * Displays a message to the user.
 * @param {string} message - The message content.
 * @param {'success'|'error'|'info'} type - The type of message.
 */
function showMessage(message, type = 'info') {
    messageArea.innerHTML = ''; // Clear previous messages
    const alertDiv = document.createElement('div');
    alertDiv.className = `p-4 mb-4 rounded-lg shadow-md animate-pop-in`;

    if (type === 'success') {
        alertDiv.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-200');
    } else if (type === 'error') {
        alertDiv.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-200');
    } else { // info
        alertDiv.classList.add('bg-blue-100', 'text-blue-800', 'border', 'border-blue-200');
    }

    alertDiv.textContent = message;
    messageArea.appendChild(alertDiv);

    // Automatically remove message after 5 seconds
    setTimeout(() => {
        alertDiv.classList.add('opacity-0', 'scale-95'); // Fade out and shrink
        alertDiv.addEventListener('transitionend', () => alertDiv.remove()); // Remove after animation
    }, 5000);
}

/**
 * Shows the requested page and hides others.
 * Adds a subtle animation for page transitions.
 * @param {string} pageId - The ID of the page to show (e.g., 'landing', 'dashboard').
 * @param {boolean} requireAuth - True if the page requires a logged-in user.
 */
function showPage(pageId, requireAuth = true) {
    const pages = [landingPage, authPage, dashboardPage, profilePage, storyboardPage, impactTrackerPage, quickConnectPage, resourceBankPage, confidenceCornerPage];
    const targetPage = document.getElementById(`${pageId}-page`);

    // Close dropdown if open
    if (moreDropdownMenu) { // Check if dropdown exists before trying to close
        moreDropdownMenu.classList.remove('show');
    }

    if (requireAuth && !localStorage.getItem('user')) {
        showMessage("Please login or register to access this page.", "info");
        showPage('auth', false); // Redirect to auth if not logged in
        return;
    }

    pages.forEach(page => {
        if (page) {
            page.classList.remove('active-page');
            page.classList.add('hidden'); // Ensure it's truly hidden for layout
            page.classList.remove('animate-pop-in'); // Reset animation
        }
    });

    if (targetPage) {
        targetPage.classList.remove('hidden'); // Show page first
        // Trigger reflow to restart animation
        void targetPage.offsetWidth; 
        targetPage.classList.add('active-page', 'animate-pop-in');
        
        // Specific logic for each page
        if (pageId === 'dashboard') {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                dashboardWelcome.textContent = `Welcome, ${user.name}!`;
                if (user.type === 'student') {
                    studentMatchingSection.classList.remove('hidden');
                    studentCareerPathSection.classList.remove('hidden');
                } else {
                    studentMatchingSection.classList.add('hidden');
                    studentCareerPathSection.classList.add('hidden');
                }
            }
        } else if (pageId === 'profile') {
            loadUserProfile();
        } else if (pageId === 'storyboard') {
            loadStoryboards();
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.type === 'alumni') {
                shareJourneySection.classList.remove('hidden');
            } else {
                shareJourneySection.classList.add('hidden');
            }
        } else if (pageId === 'impact-tracker') {
            loadImpactTrackerPage();
        } else if (pageId === 'quick-connect') {
            loadQuickConnectPage();
        } else if (pageId === 'resource-bank') {
            loadResourceBankPage();
        } else if (pageId === 'confidence-corner') {
            loadConfidencePosts();
        }
    }
    messageArea.innerHTML = ''; // Clear messages on page change
}

/**
 * Toggles between login and register modes on the auth page.
 */
function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    if (isRegisterMode) {
        authTitle.textContent = 'Register for UniVerge';
        authSubmitBtn.textContent = 'Register';
        toggleAuthModeButton.textContent = 'Already have an account? Login';
        registerFields.classList.remove('hidden');
        authName.setAttribute('required', 'true');
        authUserType.setAttribute('required', 'true');
        authHometown.setAttribute('required', 'true');
        authLanguage.setAttribute('required', 'true');
    } else {
        authTitle.textContent = 'Login to UniVerge';
        authSubmitBtn.textContent = 'Login';
        toggleAuthModeButton.textContent = 'Need an account? Register';
        registerFields.classList.add('hidden');
        authName.removeAttribute('required');
        authUserType.removeAttribute('required');
        authHometown.removeAttribute('required');
        authLanguage.removeAttribute('required');
    }
}

/**
 * Handles form submission for both login and registration.
 * @param {Event} event - The form submit event.
 */
async function handleAuthSubmit(event) {
    event.preventDefault();
    messageArea.innerHTML = ''; // Clear messages

    const email = authEmail.value;
    const password = authPassword.value;
    const name = authName.value;
    const userType = authUserType.value;
    const hometown = authHometown.value;
    const language = authLanguage.value;

    let url = isRegisterMode ? '/api/register' : '/api/login';
    let method = 'POST';
    let body = { email, password };

    if (isRegisterMode) {
        body = { ...body, name, type: userType, hometown, language };
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
            updateNavUI(data.user);
            showMessage(data.message, 'success');
            showPage('dashboard'); // Redirect to dashboard on success
            authForm.reset(); // Clear form
            if (isRegisterMode) toggleAuthMode(); // Switch back to login view after registration
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

/**
 * Handles user logout.
 */
async function handleLogout() {
    try {
        const response = await fetch('/api/logout', { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            localStorage.removeItem('user'); // Clear user data
            updateNavUI(null);
            showMessage(data.message, 'success');
            showPage('landing', false); // Go back to landing page
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('An error occurred during logout.', 'error');
    }
}

/**
 * Updates the navigation bar based on user login status.
 * @param {Object|null} user - The user object or null if logged out.
 */
function updateNavUI(user) {
    // Hide all nav items first
    navAuthButton.classList.add('hidden');
    navLogoutButton.classList.add('hidden');
    navDashboardButton.classList.add('hidden');
    navProfileButton.classList.add('hidden');
    navStoryboardButton.classList.add('hidden');
    navImpactTrackerButton.classList.add('hidden');
    navQuickConnectButton.classList.add('hidden');
    navResourceBankButton.classList.add('hidden');
    navConfidenceCornerButton.classList.add('hidden');
    
    // Check if navMoreDropdownButton exists before trying to manipulate it
    if (navMoreDropdownButton) {
        navMoreDropdownButton.classList.add('hidden'); // Hide the More button initially
    }


    if (user) {
        navLogoutButton.classList.remove('hidden');
        navDashboardButton.classList.remove('hidden');
        navProfileButton.classList.remove('hidden');
        navStoryboardButton.classList.remove('hidden');
        navQuickConnectButton.classList.remove('hidden'); // Keep Quick Connect directly visible

        // Show More dropdown button and its items if they exist
        if (navMoreDropdownButton) {
            navMoreDropdownButton.classList.remove('hidden');
        }
        if (document.getElementById('nav-impact-tracker')) {
            document.getElementById('nav-impact-tracker').classList.remove('hidden');
        }
        if (document.getElementById('nav-resource-bank')) {
            document.getElementById('nav-resource-bank').classList.remove('hidden');
        }
        if (document.getElementById('nav-confidence-corner')) {
            document.getElementById('nav-confidence-corner').classList.remove('hidden');
        }

    } else {
        navAuthButton.classList.remove('hidden');
    }
}

/**
 * Fetches the currently logged-in user's data from the backend
 * and updates the UI accordingly.
 */
async function getLoggedInUser() {
    try {
        const response = await fetch('/api/current_user');
        const data = await response.json();
        if (data.success && data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            updateNavUI(data.user);
            showPage('dashboard'); // Automatically go to dashboard if logged in
        } else {
            localStorage.removeItem('user'); // Clear stale user data
            updateNavUI(null);
            showPage('landing', false); // Show landing page if not logged in
        }
    } catch (error) {
        console.error('Error fetching current user:', error);
        localStorage.removeItem('user');
        updateNavUI(null);
        showPage('landing', false);
    }
}

/**
 * Loads the current user's profile data into the profile form.
 */
function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        profileName.textContent = user.name || 'N/A';
        profileEmail.textContent = user.email || 'N/A';
        profileType.textContent = user.type || 'N/A';
        editHometown.value = user.hometown || '';
        editLanguage.value = user.language || '';

        if (user.type === 'alumni') {
            editProfessionRow.classList.remove('hidden');
            editProfession.value = user.profession || '';
        } else {
            editProfessionRow.classList.add('hidden');
            editProfession.value = ''; // Clear value for non-alumni
        }
    } else {
        showMessage("No user logged in to display profile.", "error");
        showPage('auth');
    }
}

/**
 * Handles saving profile changes.
 * @param {Event} event - The form submit event.
 */
async function saveProfileChanges(event) {
    event.preventDefault();
    messageArea.innerHTML = '';

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showMessage("Please log in to save your profile.", "error");
        showPage('auth');
        return;
    }

    const updatedData = {
        hometown: editHometown.value,
        language: editLanguage.value,
    };

    if (user.type === 'alumni') {
        updatedData.profession = editProfession.value;
    }

    try {
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user)); // Update local storage
            loadUserProfile(); // Refresh UI with new data
            showMessage(data.message, 'success');
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        showMessage('An error occurred while saving your profile. Please try again.', 'error');
    }
}

/**
 * Simulates an alumni match for the current student.
 */
async function simulateMatch() {
    messageArea.innerHTML = '';
    matchingResult.classList.add('hidden'); // Hide previous result
    connectMatchBtn.classList.add('hidden');

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.type !== 'student') {
        showMessage("You must be logged in as a student to simulate a match.", "error");
        return;
    }

    showMessage("Searching for a perfect match...", "info");

    try {
        const response = await fetch('/api/simulate_match', { method: 'POST' });
        const data = await response.json();

        if (data.success && data.match) {
            const matchedAlumni = data.match;
            matchDetails.innerHTML = `
                <p><span class="font-semibold">${matchedAlumni.name}</span> (${matchedAlumni.type}, ${matchedAlumni.profession || 'Alumni'})</p>
                <p>Hometown: ${matchedAlumni.hometown}</p>
                <p>Language: ${matchedAlumni.language}</p>
                <p class="mt-2 text-sm italic">"${matchedAlumni.story_title || 'No story title'}"</p>
            `;
            matchingResult.classList.remove('hidden');
            matchingResult.classList.add('animate-pop-in'); // Add animation
            connectMatchBtn.classList.remove('hidden');
            showMessage("Simulated match found!", "success");
        } else {
            matchDetails.textContent = data.message;
            matchingResult.classList.remove('hidden');
            matchingResult.classList.add('animate-pop-in');
            showMessage(data.message, "info");
        }
    } catch (error) {
        console.error('Error simulating match:', error);
        showMessage('An error occurred during match simulation. Please try again.', 'error');
    }
}

/**
 * Loads and displays alumni storyboards.
 */
async function loadStoryboards() {
    storyboardsContainer.innerHTML = '<p class="text-center text-gray-600 text-base">Loading inspiring journeys...</p>';
    try {
        const response = await fetch('/api/storyboards');
        const data = await response.json();

        if (data.success && data.storyboards.length > 0) {
            storyboardsContainer.innerHTML = ''; // Clear loading message
            data.storyboards.forEach(story => {
                const storyCard = document.createElement('div');
                storyCard.className = 'card p-6 flex flex-col items-center text-center animate-pop-in'; // Added text-center
                storyCard.innerHTML = `
                    ${story.image_url ? `<img src="${story.image_url}" alt="${story.name}'s photo" class="w-20 h-20 rounded-full object-cover mb-4 border-3 border-indigo-400 shadow-sm">` : `<div class="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-4xl font-bold mb-4"><i class="fas fa-user-circle"></i></div>`}
                    <h3 class="text-xl font-bold text-gray-900 mb-1">${story.name}</h3>
                    <p class="text-indigo-600 font-medium text-sm mb-2">${story.profession}</p>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">${story.story_title || 'Alumni Journey'}</h4>
                    <p class="text-gray-700 leading-relaxed text-sm mb-3">${story.story}</p>
                    <p class="text-gray-500 text-xs">Hometown: ${story.hometown}</p>
                `;
                storyboardsContainer.appendChild(storyCard);
            });
        } else {
            storyboardsContainer.innerHTML = '<p class="text-center text-gray-600 text-base">No inspiring alumni journeys to display yet. Be the first to share!</p>';
        }
    } catch (error) {
        console.error('Error loading storyboards:', error);
        storyboardsContainer.innerHTML = '<p class="text-center text-red-600 text-base">Failed to load storyboards. Please try again later.</p>';
    }
}

/**
 * Handles the submission of an alumni journey.
 * @param {Event} event - The form submit event.
 */
async function handleShareJourneySubmit(event) {
    event.preventDefault();
    messageArea.innerHTML = '';

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.type !== 'alumni') {
        showMessage("Only alumni can share their journeys.", "error");
        return;
    }

    const title = storyTitleInput.value;
    const description = storyDescriptionInput.value;
    const imageUrl = storyImageUrlInput.value;

    if (!title || !description) {
        showMessage("Please provide a title and your journey description.", "error");
        return;
    }

    try {
        const response = await fetch('/api/storyboards/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, image_url: imageUrl }),
        });

        const data = await response.json();

        if (data.success) {
            showMessage(data.message, 'success');
            shareJourneyForm.reset(); // Clear the form
            loadStoryboards(); // Refresh the list of storyboards
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error sharing journey:', error);
        showMessage('An error occurred while sharing your journey. Please try again.', 'error');
    }
}

/**
 * Fetches and loads the content of the dummy Impact Tracker page.
 */
async function loadImpactTrackerPage() {
    try {
        const response = await fetch('/impact-tracker-dummy-content'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        impactTrackerPage.innerHTML = htmlContent;
    } catch (error) {
        console.error('Error loading Impact Tracker page content:', error);
        impactTrackerPage.innerHTML = '<p class="text-center text-red-600 text-lg">Failed to load Impact Tracker content. Please try again later.</p>';
    }
}

// Quick Connect Page Logic
/**
 * Loads the Quick Connect page content based on user type.
 */
async function loadQuickConnectPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showMessage("Please log in to access Quick Connect.", "error");
        showPage('auth');
        return;
    }

    // Hide all sections initially
    alumniSlotsSection.classList.add('hidden');
    availableSlotsSection.classList.add('hidden');
    mySlotsSection.classList.add('hidden');

    if (user.type === 'alumni') {
        alumniSlotsSection.classList.remove('hidden');
        mySlotsSection.classList.remove('hidden');
        loadMySlots(); // Load alumni's created slots
    } else if (user.type === 'student') {
        availableSlotsSection.classList.remove('hidden');
        mySlotsSection.classList.remove('hidden');
        loadAvailableSlots(); // Load slots for students to book
        loadMySlots(); // Load student's booked slots
    }
}

/**
 * Handles alumni creating a new mentorship slot.
 * @param {Event} event - The form submit event.
 */
async function handleCreateSlot(event) {
    event.preventDefault();
    messageArea.innerHTML = '';

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.type !== 'alumni') {
        showMessage("You must be logged in as an alumni to create slots.", "error");
        return;
    }

    const date = slotDateInput.value;
    const time = slotTimeInput.value;
    const duration = slotDurationSelect.value;

    if (!date || !time) {
        showMessage("Please select a date and time for the slot.", "error");
        return;
    }

    try {
        const response = await fetch('/api/slots/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, time, duration: parseInt(duration) }),
        });

        const data = await response.json();

        if (data.success) {
            showMessage(data.message, 'success');
            createSlotForm.reset();
            loadMySlots(); // Refresh alumni's slots list
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error creating slot:', error);
        showMessage('An error occurred while creating the slot. Please try again.', 'error');
    }
}

/**
 * Loads and displays the current user's (alumni's created or student's booked) slots.
 */
async function loadMySlots() {
    mySlotsList.innerHTML = '<p class="text-center text-gray-600">Loading your slots...</p>';
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return; // Should not happen if called from showPage with auth check

    try {
        const response = await fetch('/api/slots/my');
        const data = await response.json();

        if (data.success && data.slots.length > 0) {
            mySlotsList.innerHTML = '';
            data.slots.forEach(slot => {
                const startTime = new Date(slot.start_time);
                const endTime = new Date(slot.end_time);
                const isBooked = slot.is_booked;
                const slotOwner = slot.alumni_name; // Alumni who created the slot
                const bookedBy = slot.student_name; // Student who booked it

                const slotCard = document.createElement('div');
                slotCard.className = `card p-4 flex flex-col md:flex-row justify-between items-center ${isBooked ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'}`;
                
                let statusText = isBooked ? `<span class="text-red-600 font-semibold">Booked by ${bookedBy || 'N/A'}</span>` : `<span class="text-green-600 font-semibold">Available</span>`;
                let roleSpecificText = '';

                if (user.type === 'alumni') {
                    if (slot.is_my_alumni_slot) { // This is a slot the alumni created
                        roleSpecificText = `
                            <p class="text-sm text-gray-600">
                                Status: ${statusText}
                            </p>
                        `;
                    } else { // This is a slot the alumni booked (shouldn't happen with current logic, but for completeness)
                        roleSpecificText = `
                            <p class="text-sm text-gray-600">
                                Booked with: <span class="font-semibold">${slotOwner}</span>
                            </p>
                        `;
                    }
                } else if (user.type === 'student') {
                    if (isBooked && slot.student_id === user.id) { // This is a slot the student booked
                        roleSpecificText = `
                            <p class="text-sm text-gray-600">
                                With: <span class="font-semibold">${slotOwner}</span>
                            </p>
                        `;
                    } else { // This is a slot the student created (shouldn't happen)
                        roleSpecificText = `
                            <p class="text-sm text-gray-600">
                                Created by: <span class="font-semibold">${slotOwner}</span>
                            </p>
                        `;
                    }
                }


                slotCard.innerHTML = `
                    <div class="flex-grow text-center md:text-left mb-2 md:mb-0">
                        <p class="text-lg font-bold text-gray-800">${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p class="text-sm text-gray-600">${slot.duration_minutes} minutes</p>
                        ${roleSpecificText}
                    </div>
                `;
                mySlotsList.appendChild(slotCard);
            });
        } else {
            mySlotsList.innerHTML = '<p class="text-center text-gray-600">No slots to display yet.</p>';
        }
    } catch (error) {
        console.error('Error loading my slots:', error);
        mySlotsList.innerHTML = '<p class="text-center text-red-600">Failed to load your slots. Please try again.</p>';
    }
}


/**
 * Loads and displays available mentorship slots for students.
 */
async function loadAvailableSlots() {
    availableSlotsList.innerHTML = '<p class="text-center text-gray-600">Searching for available slots...</p>';
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.type !== 'student') return;

    try {
        const response = await fetch('/api/slots/available');
        const data = await response.json();

        if (data.success && data.slots.length > 0) {
            availableSlotsList.innerHTML = '';
            data.slots.forEach(slot => {
                const startTime = new Date(slot.start_time);
                const slotCard = document.createElement('div');
                slotCard.className = 'card p-4 flex flex-col md:flex-row justify-between items-center bg-blue-50 border-blue-200';
                slotCard.innerHTML = `
                    <div class="flex-grow text-center md:text-left mb-2 md:mb-0">
                        <p class="text-lg font-bold text-gray-800">${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p class="text-sm text-gray-600">${slot.duration_minutes} minutes with <span class="font-semibold">${slot.alumni_name}</span></p>
                        <p class="text-sm text-gray-500">Connect instantly!</p>
                    </div>
                    <button class="btn-primary text-white px-4 py-2 rounded-lg text-sm" data-slot-id="${slot.id}">
                        Book Now <i class="fas fa-calendar-check ml-1"></i>
                    </button>
                `;
                availableSlotsList.appendChild(slotCard);
            });
            // Attach event listeners to all "Book Now" buttons
            availableSlotsList.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', handleBookSlot);
            });
        } else {
            availableSlotsList.innerHTML = '<p class="text-center text-gray-600">No slots available right now. Check back later!</p>';
        }
    } catch (error) {
        console.error('Error loading available slots:', error);
        availableSlotsList.innerHTML = '<p class="text-center text-red-600">Failed to load available slots. Please try again.</p>';
    }
}

/**
 * Handles a student booking an available mentorship slot.
 * @param {Event} event - The click event from the "Book Now" button.
 */
async function handleBookSlot(event) {
    messageArea.innerHTML = '';
    const slotId = event.target.dataset.slotId;
    if (!slotId) {
        showMessage("Error: Slot ID not found.", "error");
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.type !== 'student') {
        showMessage("You must be logged in as a student to book slots.", "error");
        return;
    }

    // Disable the button to prevent multiple clicks
    event.target.disabled = true;
    event.target.textContent = 'Booking...';

    try {
        const response = await fetch(`/api/slots/book/${slotId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // No body needed as slotId is in URL and user is from session
        });

        const data = await response.json();

        if (data.success) {
            showMessage(data.message, 'success');
            loadAvailableSlots(); // Refresh available slots
            loadMySlots(); // Refresh my booked slots
        } else {
            showMessage(data.message, 'error');
            event.target.disabled = false; // Re-enable button on failure
            event.target.textContent = 'Book Now';
        }
    } catch (error) {
        console.error('Error booking slot:', error);
        showMessage('An error occurred while booking the slot. Please try again.', 'error');
        event.target.disabled = false; // Re-enable button on network error
        event.target.textContent = 'Book Now';
    }
}

// Resource Bank Page Logic
/**
 * Loads the Resource Bank page content based on user type.
 */
async function loadResourceBankPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showMessage("Please log in to access the Resource Bank.", "error");
        showPage('auth');
        return;
    }

    // Hide/show sections based on user type
    if (user.type === 'alumni') {
        alumniResourceUploadSection.classList.remove('hidden');
    } else {
        alumniResourceUploadSection.classList.add('hidden');
    }
    
    loadResources(); // Load resources for all users
}

/**
 * Handles alumni uploading a new resource.
 * @param {Event} event - The form submit event.
 */
async function handleResourceUpload(event) {
    event.preventDefault();
    messageArea.innerHTML = '';

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.type !== 'alumni') {
        showMessage("You must be logged in as an alumni to upload resources.", "error");
        return;
    }

    const title = resourceTitleInput.value;
    const url = resourceUrlInput.value;
    const category = resourceCategorySelect.value;
    const description = resourceDescriptionInput.value;

    if (!title || !url || !category) {
        showMessage("Please fill in all required fields: Title, URL, and Category.", "error");
        return;
    }

    try {
        const response = await fetch('/api/resources/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, url, category, description }),
        });

        const data = await response.json();

        if (data.success) {
            showMessage(data.message, 'success');
            uploadResourceForm.reset(); // Clear the form
            loadResources(); // Refresh the list of resources
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error uploading resource:', error);
        showMessage('An error occurred while uploading the resource. Please try again.', 'error');
    }
}

/**
 * Loads and displays resources from the backend.
 * Implements basic targeting based on user's hometown/language if they are a student.
 */
async function loadResources() {
    resourcesContainer.innerHTML = '<p class="text-center text-gray-600 col-span-full">Loading resources...</p>';
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return; // Should not happen if called from showPage with auth check

    try {
        const response = await fetch('/api/resources');
        const data = await response.json();

        if (data.success && data.resources.length > 0) {
            resourcesContainer.innerHTML = ''; // Clear loading message
            data.resources.forEach(resource => {
                const resourceCard = document.createElement('div');
                resourceCard.className = 'card p-5 flex flex-col animate-pop-in';
                resourceCard.innerHTML = `
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${resource.title}</h3>
                    <p class="text-indigo-600 font-medium text-sm mb-2">${resource.category} <i class="fas fa-tag ml-1"></i></p>
                    ${resource.description ? `<p class="text-gray-700 text-sm mb-3">${resource.description}</p>` : ''}
                    <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="btn-primary text-white px-4 py-2 rounded-lg text-sm mt-auto self-start">
                        Access Resource <i class="fas fa-external-link-alt ml-1"></i>
                    </a>
                    <p class="text-gray-500 text-xs mt-3">Shared by: ${resource.alumni_name} (${new Date(resource.created_at).toLocaleDateString()})</p>
                    ${resource.alumni_hometown ? `<p class="text-gray-500 text-xs">From: ${resource.alumni_hometown}</p>` : ''}
                `;
                resourcesContainer.appendChild(resourceCard);
            });
        } else {
            resourcesContainer.innerHTML = '<p class="text-center text-gray-600 col-span-full">No resources available yet. Alumni, be the first to share!</p>';
        }
    } catch (error) {
        console.error('Error loading resources:', error);
        resourcesContainer.innerHTML = '<p class="text-center text-red-600 col-span-full">Failed to load resources. Please try again later.</p>';
    }
}

// Cultural Confidence Corner Logic
/**
 * Handles submitting a new anonymous post to the Confidence Corner.
 * @param {Event} event - The form submit event.
 */
async function handleConfidencePostSubmit(event) {
    event.preventDefault();
    messageArea.innerHTML = '';

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showMessage("Please log in to post in the Confidence Corner.", "error");
        return;
    }

    const content = postContentInput.value.trim();
    if (!content) {
        showMessage("Your post cannot be empty.", "error");
        return;
    }

    try {
        const response = await fetch('/api/confidence_corner/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: content }),
        });

        const data = await response.json();

        if (data.success) {
            showMessage(data.message, 'success');
            postContentInput.value = ''; // Clear the textarea
            loadConfidencePosts(); // Refresh the posts list
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error submitting post:', error);
        showMessage('An error occurred while submitting your post. Please try again.', 'error');
    }
}

/**
 * Loads and displays posts in the Cultural Confidence Corner.
 */
async function loadConfidencePosts() {
    confidencePostsContainer.innerHTML = '<p class="text-center text-gray-600">Loading posts...</p>';
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
        const response = await fetch('/api/confidence_corner/posts');
        const data = await response.json();

        if (data.success && data.posts.length > 0) {
            confidencePostsContainer.innerHTML = '';
            data.posts.forEach(post => {
                const postCard = document.createElement('div');
                postCard.className = 'card p-5';
                
                const postDate = new Date(post.created_at).toLocaleString();
                
                let moderationButtons = '';
                if (user.type === 'alumni') {
                    moderationButtons = `
                        <div class="flex justify-end space-x-2 mt-3">
                            ${post.is_reported ? '<span class="text-red-500 text-sm font-semibold"><i class="fas fa-flag mr-1"></i> Reported</span>' : ''}
                            <button class="btn-secondary text-red-700 hover:text-white hover:bg-red-700 px-3 py-1 rounded-md text-xs" data-post-id="${post.id}" onclick="handleDeletePost(event)">
                                Delete <i class="fas fa-trash-alt ml-1"></i>
                            </button>
                        </div>
                    `;
                } else { // Students can only report
                    moderationButtons = `
                        <div class="flex justify-end mt-3">
                            <button class="btn-secondary text-yellow-700 hover:text-white hover:bg-yellow-700 px-3 py-1 rounded-md text-xs" data-post-id="${post.id}" onclick="handleReportPost(event)">
                                Report <i class="fas fa-flag ml-1"></i>
                            </button>
                        </div>
                    `;
                }

                postCard.innerHTML = `
                    <p class="text-gray-800 text-base leading-relaxed mb-3">${post.content}</p>
                    <div class="flex justify-between items-center text-gray-500 text-xs">
                        <span>Posted by: <span class="font-semibold">Anonymous</span></span>
                        <span>${postDate}</span>
                    </div>
                    ${moderationButtons}
                `;
                confidencePostsContainer.appendChild(postCard);
            });
        } else {
            confidencePostsContainer.innerHTML = '<p class="text-center text-gray-600">No posts yet. Be the first to share your story!</p>';
        }
    } catch (error) {
        console.error('Error loading confidence posts:', error);
        confidencePostsContainer.innerHTML = '<p class="text-center text-red-600">Failed to load posts. Please try again later.</p>';
    }
}


// --- Event Listeners ---
authForm.addEventListener('submit', handleAuthSubmit);
toggleAuthModeButton.addEventListener('click', toggleAuthMode); // This line is correct and should be here.
profileEditForm.addEventListener('submit', saveProfileChanges);
shareJourneyForm.addEventListener('submit', handleShareJourneySubmit);
createSlotForm.addEventListener('submit', handleCreateSlot);
uploadResourceForm.addEventListener('submit', handleResourceUpload);
confidencePostForm.addEventListener('submit', handleConfidencePostSubmit);

// Dropdown event listener (ensure navMoreDropdownButton and moreDropdownMenu exist)
if (navMoreDropdownButton && moreDropdownMenu) {
    navMoreDropdownButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from immediately closing dropdown
        moreDropdownMenu.classList.toggle('show');
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (!event.target.matches('#nav-more-dropdown') && !moreDropdownMenu.contains(event.target)) {
            if (moreDropdownMenu.classList.contains('show')) {
                moreDropdownMenu.classList.remove('show');
            }
        }
    });
}


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as min for slot date input
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(today.getDate()).padStart(2, '0');
    if (slotDateInput) { // Check if element exists before setting property
        slotDateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    // Initial check for logged in user to update UI and redirect
    getLoggedInUser();
});