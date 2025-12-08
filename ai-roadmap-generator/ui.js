/**
 * ui.js
 * Handles DOM manipulation and rendering.
 */

const UI = {
    elements: {
        roadmapContainer: document.getElementById('roadmap-container'),
        roadmapTitle: document.getElementById('roadmap-title'),
        roadmapOverview: document.getElementById('roadmap-overview'),
        beginnerItems: document.getElementById('beginner-items'),
        intermediateItems: document.getElementById('intermediate-items'),
        advancedItems: document.getElementById('advanced-items'),
        resourcesList: document.getElementById('resources-list'),
        projectsList: document.getElementById('projects-list'),
        loading: document.getElementById('loading'),
        sidebarList: document.getElementById('saved-list'),
        saveBtn: document.getElementById('save-btn'),
        exportBtn: document.getElementById('export-btn'),
        heroSection: document.getElementById('hero-section'),
        body: document.body
    },

    showLoading() {
        this.elements.loading.classList.remove('hidden');
        this.elements.roadmapContainer.classList.add('hidden');
        this.elements.heroSection.classList.add('minimized');
    },

    hideLoading() {
        this.elements.loading.classList.add('hidden');
        this.elements.roadmapContainer.classList.remove('hidden');
    },

    renderRoadmap(data) {
        // Clear previous
        this.elements.beginnerItems.innerHTML = '';
        this.elements.intermediateItems.innerHTML = '';
        this.elements.advancedItems.innerHTML = '';
        this.elements.resourcesList.innerHTML = '';
        this.elements.projectsList.innerHTML = '';

        // Set Headers
        this.elements.roadmapTitle.textContent = data.topic;
        this.elements.roadmapOverview.textContent = data.overview;

        // Render Sections
        this.renderSection(data.roadmap.beginner, this.elements.beginnerItems, data);
        this.renderSection(data.roadmap.intermediate, this.elements.intermediateItems, data);
        this.renderSection(data.roadmap.advanced, this.elements.advancedItems, data);

        // Render Resources
        data.resources.forEach(res => {
            const li = document.createElement('li');
            li.className = 'resource-item';
            li.innerHTML = `<a href="${res.url}" target="_blank">${res.title} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`;
            this.elements.resourcesList.appendChild(li);
        });

        // Render Projects
        data.projects.forEach(proj => {
            const div = document.createElement('div');
            div.className = 'project-card';
            div.innerHTML = `<h4>${proj.title}</h4><p>${proj.desc}</p>`;
            this.elements.projectsList.appendChild(div);
        });

        // Enable buttons
        this.elements.saveBtn.disabled = false;
        this.elements.exportBtn.disabled = false;
        this.elements.saveBtn.onclick = () => {
            saveRoadmapToStorage(data);
            this.renderSidebar();
            alert('Roadmap saved!');
        };
    },

    renderSection(items, container, fullData) {
        if (!items) return;

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'roadmap-card';

            const isChecked = fullData.completedItems && fullData.completedItems.includes(item.id);

            card.innerHTML = `
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
                <label class="checkbox-container">
                    <input type="checkbox" data-id="${item.id}" ${isChecked ? 'checked' : ''}>
                    <span>Mark as Completed</span>
                </label>
            `;

            // Add change listener for progress
            const checkbox = card.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                updateItemProgress(fullData.topic, item.id, e.target.checked);

                // Add visual feedback
                if (e.target.checked) {
                    // Confetti or sound could go here
                }
            });

            container.appendChild(card);
        });
    },

    renderSidebar() {
        const saved = getSavedRoadmaps();
        const list = this.elements.sidebarList;
        list.innerHTML = '';

        if (saved.length === 0) {
            list.innerHTML = '<li style="padding:1rem; color:var(--text-muted); font-size:0.9rem;">No saved roadmaps yet.</li>';
            return;
        }

        saved.forEach(roadmap => {
            const li = document.createElement('li');
            li.className = 'saved-item';
            li.innerHTML = `
                <i class="fa-solid fa-folder"></i>
                <span>${roadmap.topic}</span>
                <button class="delete-saved" title="Delete"><i class="fa-solid fa-trash"></i></button>
            `;

            // Text click loads roadmap
            li.addEventListener('click', (e) => {
                if (e.target.closest('.delete-saved')) return; // Ignore if delete clicked

                // Load this roadmap
                UI.renderRoadmap(roadmap);
                UI.elements.heroSection.classList.add('minimized');
                UI.elements.roadmapContainer.classList.remove('hidden');

                // Active state
                document.querySelectorAll('.saved-item').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
            });

            // Delete click
            const delBtn = li.querySelector('.delete-saved');
            delBtn.addEventListener('click', () => {
                if (confirm(`Delete "${roadmap.topic}"?`)) {
                    deleteRoadmapFromStorage(roadmap.topic);
                    UI.renderSidebar();
                    // If currently viewing deleted, reset view? (Optional enhancement)
                }
            });

            list.appendChild(li);
        });
    },

    initTheme() {
        const savedTheme = getTheme();
        this.setTheme(savedTheme);

        document.getElementById('theme-toggle').addEventListener('click', () => {
            const current = document.body.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });
    },

    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        const icon = document.querySelector('#theme-toggle i');
        if (theme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
        saveTheme(theme);
    }
};
