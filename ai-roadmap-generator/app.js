/**
 * app.js
 * Main application logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI
    UI.initTheme();
    UI.renderSidebar();

    // Event Listeners
    const btnGenerate = document.getElementById('generate-btn');
    const inputTopic = document.getElementById('topic-input');
    const btnNew = document.getElementById('new-roadmap-btn');
    const btnExport = document.getElementById('export-btn');
    const btnSidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    // Generate Roadmap
    async function handleGenerate() {
        const topic = inputTopic.value.trim();
        if (!topic) {
            alert('Please enter a topic!');
            return;
        }

        UI.showLoading();

        try {
            // Check if we already have this saved?
            const saved = getRoadmapByTopic(topic);
            if (saved) {
                console.log('Loaded from cache:', topic);
                UI.renderRoadmap(saved);
            } else {
                console.log('Generating new:', topic);
                const data = await generateRoadmap(topic);
                UI.renderRoadmap(data);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate roadmap. Please try again.');
        } finally {
            UI.hideLoading();
        }
    }

    btnGenerate.addEventListener('click', handleGenerate);
    inputTopic.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGenerate();
    });

    // New Roadmap (Reset)
    btnNew.addEventListener('click', () => {
        inputTopic.value = '';
        UI.elements.heroSection.classList.remove('minimized');
        UI.elements.roadmapContainer.classList.add('hidden');
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });

    // Export PDF
    btnExport.addEventListener('click', async () => {
        const element = document.getElementById('roadmap-container');
        const topic = document.getElementById('roadmap-title').textContent;

        // Show loading state on button
        const originalText = btnExport.innerHTML;
        btnExport.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Exporting...';
        btnExport.disabled = true;

        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${topic}-roadmap.pdf`);

        } catch (err) {
            console.error('PDF Export failed:', err);
            alert('Could not export PDF.');
        } finally {
            btnExport.innerHTML = originalText;
            btnExport.disabled = false;
        }
    });

    // Mobile Sidebar Toggle
    btnSidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !btnSidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
});
