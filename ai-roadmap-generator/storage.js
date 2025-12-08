/**
 * storage.js
 * Handles LocalStorage operations for roadmaps and preferences.
 */

const STORAGE_KEYS = {
    ROADMAPS: 'ai_roadmaps_v1',
    THEME: 'ai_theme_v1'
};

// --- Roadmap Management ---

function saveRoadmapToStorage(roadmapData) {
    const saved = getSavedRoadmaps();
    // Check if exists, update it if so, otherwise push new
    const existingIndex = saved.findIndex(r => r.topic.toLowerCase() === roadmapData.topic.toLowerCase());

    if (existingIndex >= 0) {
        saved[existingIndex] = roadmapData; // Update
    } else {
        saved.push(roadmapData); // Add new
    }

    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(saved));
}

function getSavedRoadmaps() {
    const data = localStorage.getItem(STORAGE_KEYS.ROADMAPS);
    return data ? JSON.parse(data) : [];
}

function getRoadmapByTopic(topic) {
    const saved = getSavedRoadmaps();
    return saved.find(r => r.topic.toLowerCase() === topic.toLowerCase());
}

function deleteRoadmapFromStorage(topic) {
    let saved = getSavedRoadmaps();
    saved = saved.filter(r => r.topic.toLowerCase() !== topic.toLowerCase());
    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(saved));
}

// --- Progress Tracking ---

function updateItemProgress(topic, itemId, isCompleted) {
    const roadmap = getRoadmapByTopic(topic);
    if (!roadmap) return;

    if (!roadmap.completedItems) {
        roadmap.completedItems = [];
    }

    if (isCompleted) {
        if (!roadmap.completedItems.includes(itemId)) {
            roadmap.completedItems.push(itemId);
        }
    } else {
        roadmap.completedItems = roadmap.completedItems.filter(id => id !== itemId);
    }

    saveRoadmapToStorage(roadmap);
}

// --- Theme Preference ---

function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}
