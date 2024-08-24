const audio = document.getElementById('background-audio');

// Function to play the audio
function playAudio() {
    audio.play().catch(error => {
        console.log('Audio playback failed:', error);
    });
}

// Function to stop the audio
function stopAudio() {
    audio.pause();
    savePlaybackTime();
}

// Save the current playback time to localStorage
function savePlaybackTime() {
    localStorage.setItem('audioTime', audio.currentTime);
}

// Load the saved playback time from localStorage
function loadPlaybackTime() {
    const savedTime = localStorage.getItem('audioTime');
    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }
}

// Start the audio when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPlaybackTime();
    playAudio();
});

// Stop the audio when the user leaves the page or switches tabs
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAudio();
    } else {
        playAudio();
    }
});

// Save playback time when the user leaves the page (e.g., closing tab)
window.addEventListener('beforeunload', savePlaybackTime);
