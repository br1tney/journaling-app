// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializeApp();
});

function checkAuthentication() {
    const accessToken = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    
    if (!accessToken) {
        window.location.href = '/';
        return;
    }
    
    // Update welcome message
    if (username) {
        document.getElementById('welcomeUser').textContent = `Welcome back, ${username}!`;
    }
}

function initializeApp() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('entryDate').value = today;
    
    // Event listeners
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('saveEntry').addEventListener('click', saveEntry);
    document.getElementById('clearForm').addEventListener('click', clearForm);
    document.getElementById('imageUpload').addEventListener('change', handleImagePreview);
    document.getElementById('removeImage').addEventListener('click', removeImage);
    
    // Load existing entries
    loadEntries();
}

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    window.location.href = '/';
}

function showMessage(text, type = 'info') {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
    message.classList.remove('hidden');
    
    setTimeout(() => {
        message.classList.add('hidden');
    }, 5000);
}

function handleImagePreview() {
    const file = document.getElementById('imageUpload').files[0];
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function removeImage() {
    document.getElementById('imageUpload').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
}

async function saveEntry() {
    const date = document.getElementById('entryDate').value;
    const mood = document.getElementById('mood').value;
    const content = document.getElementById('journalEntry').value;
    const imageFile = document.getElementById('imageUpload').files[0];
    const username = localStorage.getItem('username') || 'anonymous';
    
    if (!date || !mood || !content) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('date', date);
    formData.append('mood', mood);
    formData.append('content', content);
    formData.append('userId', username);
    
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    try {
        const response = await fetch('/api/journal/entries', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Journal entry saved successfully!', 'success');
            clearForm();
            loadEntries();
        } else {
            throw new Error(result.error || 'Failed to save entry');
        }
    } catch (error) {
        console.error('Error saving entry:', error);
        showMessage(`Error saving entry: ${error.message}`, 'error');
    }
}

function clearForm() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('entryDate').value = today;
    document.getElementById('mood').value = '';
    document.getElementById('journalEntry').value = '';
    removeImage();
}

async function loadEntries() {
    const username = localStorage.getItem('username') || 'anonymous';
    
    try {
        const response = await fetch(`/api/journal/entries?userId=${username}`);
        const result = await response.json();
        
        if (response.ok) {
            displayEntries(result.entries);
        } else {
            throw new Error(result.error || 'Failed to load entries');
        }
    } catch (error) {
        console.error('Error loading entries:', error);
        showMessage(`Error loading entries: ${error.message}`, 'error');
    }
}

function displayEntries(entries) {
    const entriesList = document.getElementById('entriesList');
    
    if (!entries || entries.length === 0) {
        entriesList.innerHTML = '<p class="no-entries">No journal entries yet. Start writing!</p>';
        return;
    }
    
    // Sort entries by date (newest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const entriesHtml = entries.map(entry => `
        <div class="entry-card">
            <div class="entry-header">
                <div class="entry-date">${formatDate(entry.date)}</div>
                <div class="entry-mood">${getMoodEmoji(entry.mood)} ${entry.mood}</div>
            </div>
            <div class="entry-content">
                <p>${entry.content}</p>
                ${entry.imageUrl ? `<img src="${entry.imageUrl}" alt="Journal image" class="entry-image">` : ''}
            </div>
            <div class="entry-footer">
                <small>Created: ${formatDateTime(entry.createdAt)}</small>
            </div>
        </div>
    `).join('');
    
    entriesList.innerHTML = entriesHtml;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getMoodEmoji(mood) {
    const moods = {
        'amazing': '🤩',
        'happy': '😊',
        'content': '😌',
        'neutral': '😐',
        'sad': '😢',
        'anxious': '😰',
        'angry': '😠'
    };
    return moods[mood] || '😐';
}
