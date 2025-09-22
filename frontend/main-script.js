// Main page functionality for Kolam Analysis

// Global variables
let currentSection = 'analysis';
let canvas, ctx;
let uploadedImage = null;
let analysisResults = {};
let analysisInProgress = false;
let analyzedKolams = [];

// Color schemes
const colorSchemes = {
    traditional: ['#ff6b6b', '#ffd93d', '#54a0ff', '#5f27cd', '#00d2d3'],
    festival: ['#ff9f43', '#10ac84', '#ee5a24', '#feca57', '#ff6348'],
    monochrome: ['#2f3542', '#57606f', '#a4b0be', '#ced6e0', '#ddd']
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeCanvas();
    initializeEventListeners();
    initializeFileUpload();
    showToast('Welcome to Kolam Analysis! 🔍', 'info');
});

// Initialize canvas
function initializeCanvas() {
    try {
        canvas = document.getElementById('kolamCanvas');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        ctx = canvas.getContext('2d');
        clearCanvas();
        
        console.log('Canvas initialized successfully');
    } catch (error) {
        console.error('Error initializing canvas:', error);
        showToast('Error initializing canvas', 'error');
    }
}

// Clear canvas function
function clearCanvas() {
    try {
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Set canvas background to white
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw placeholder text
            ctx.fillStyle = '#e0e0e0';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Upload an image to begin analysis', canvas.width / 2, canvas.height / 2);
            
            // Draw subtle border
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
        }
    } catch (error) {
        console.error('Error clearing canvas:', error);
    }
}

// Initialize event listeners
function initializeEventListeners() {
    try {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                // Only prevent default for internal hash links, allow external links to work
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = href.substring(1);
                    switchSection(target);
                }
                // External links (like about.html) will work normally
            });
        });
        
        // Gallery filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterGallery(this.dataset.filter);
            });
        });
        
        console.log('Event listeners initialized successfully');
    } catch (error) {
        console.error('Error initializing event listeners:', error);
    }
}

// Initialize file upload functionality
function initializeFileUpload() {
    try {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (!uploadArea || !fileInput) {
            console.error('Upload elements not found');
            return;
        }
        
        // File input change
        fileInput.addEventListener('change', handleFileSelect);
        
        // Drag and drop
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        
        console.log('File upload initialized successfully');
    } catch (error) {
        console.error('Error initializing file upload:', error);
    }
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

// Handle drag leave
function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

// Process uploaded file
function processFile(file) {
    try {
        if (!file.type.startsWith('image/')) {
            showToast('Please upload a valid image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showToast('Image size should be less than 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage = new Image();
            uploadedImage.onload = function() {
                displayUploadedImage();
                enableAnalysisButton();
                showToast('Image uploaded successfully!', 'success');
            };
            uploadedImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
    } catch (error) {
        console.error('Error processing file:', error);
        showToast('Error processing image file', 'error');
    }
}

// Display uploaded image
function displayUploadedImage() {
    try {
        const canvas = document.getElementById('kolamCanvas');
        const imagePreview = document.getElementById('imagePreview');
        const uploadedImageElement = document.getElementById('uploadedImage');
        
        if (canvas && imagePreview && uploadedImageElement && uploadedImage) {
            // Show the image preview overlay
            canvas.style.display = 'block';
            imagePreview.style.display = 'flex';
            uploadedImageElement.src = uploadedImage.src;
            uploadedImageElement.alt = 'Uploaded Kolam Image';
            
            // Also draw the image on the canvas for analysis
            drawKolamOnCanvas(uploadedImage);
        }
    } catch (error) {
        console.error('Error displaying uploaded image:', error);
    }
}

// Enable analysis button
function enableAnalysisButton() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.style.opacity = '1';
        analyzeBtn.style.cursor = 'pointer';
    }
}

// Analyze Kolam function
function analyzeKolam() {
    try {
        if (!uploadedImage) {
            showToast('Please upload an image first', 'error');
            return;
        }
        
        if (analysisInProgress) {
            showToast('Analysis already in progress', 'warning');
            return;
        }
        
        analysisInProgress = true;
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        }
        
        // Simulate analysis with timeout (replace with actual analysis logic)
        setTimeout(() => {
            performAnalysis();
        }, 2000);
        
    } catch (error) {
        console.error('Error analyzing Kolam:', error);
        showToast('Error during analysis', 'error');
        resetAnalysisButton();
    }
}

// Perform analysis (simulated)
function performAnalysis() {
    try {
        // Get selected analysis options
        const symmetryAnalysis = document.getElementById('symmetryAnalysis')?.checked;
        const colorExtraction = document.getElementById('colorExtraction')?.checked;
        const patternRecognition = document.getElementById('patternRecognition')?.checked;
        const complexityMeasure = document.getElementById('complexityMeasure')?.checked;
        
        analysisResults = {};
        
        if (symmetryAnalysis) {
            analysisResults.symmetry = {
                type: 'Radial',
                score: Math.floor(Math.random() * 40) + 60, // 60-100%
                axes: Math.floor(Math.random() * 4) + 4 // 4-8 axes
            };
        }
        
        if (colorExtraction) {
            analysisResults.colors = [
                '#FF6B6B', '#54A0FF', '#5F27CD', 
                '#FFD93D', '#00D2D3', '#FF9F43'
            ].slice(0, Math.floor(Math.random() * 3) + 3);
        }
        
        if (patternRecognition) {
            const patterns = ['Lotus', 'Geometric', 'Floral', 'Traditional', 'Modern'];
            analysisResults.pattern = patterns[Math.floor(Math.random() * patterns.length)];
        }
        
        if (complexityMeasure) {
            analysisResults.complexity = {
                score: Math.floor(Math.random() * 30) + 70, // 70-100
                level: ['Medium', 'High', 'Very High'][Math.floor(Math.random() * 3)]
            };
        }
        
        displayAnalysisResults();
        resetAnalysisButton();
        showToast('Analysis completed successfully!', 'success');
        
        // Save analysis to local storage
        saveAnalysisToGallery();
        
    } catch (error) {
        console.error('Error performing analysis:', error);
        showToast('Error during analysis processing', 'error');
        resetAnalysisButton();
    }
}

// Display analysis results
function displayAnalysisResults() {
    try {
        const resultsPanel = document.getElementById('resultsPanel');
        const resultsContent = document.getElementById('resultsContent');
        
        if (!resultsPanel || !resultsContent) {
            console.error('Results elements not found');
            return;
        }
        
        let resultsHTML = '';
        
        if (analysisResults.symmetry) {
            resultsHTML += `
                <div class="result-item">
                    <span class="result-label">Symmetry Type</span>
                    <span class="result-value">${analysisResults.symmetry.type}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Symmetry Score</span>
                    <span class="result-value">${analysisResults.symmetry.score}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Symmetry Axes</span>
                    <span class="result-value">${analysisResults.symmetry.axes}</span>
                </div>
            `;
        }
        
        if (analysisResults.colors) {
            const colorSwatches = analysisResults.colors.map(color => 
                `<div class="color-swatch" style="background-color: ${color}" title="${color}"></div>`
            ).join('');
            
            resultsHTML += `
                <div class="result-item">
                    <span class="result-label">Dominant Colors</span>
                    <div class="color-swatches">${colorSwatches}</div>
                </div>
            `;
        }
        
        if (analysisResults.pattern) {
            resultsHTML += `
                <div class="result-item">
                    <span class="result-label">Pattern Type</span>
                    <span class="result-value">${analysisResults.pattern}</span>
                </div>
            `;
        }
        
        if (analysisResults.complexity) {
            resultsHTML += `
                <div class="result-item">
                    <span class="result-label">Complexity Level</span>
                    <span class="result-value">${analysisResults.complexity.level}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Complexity Score</span>
                    <span class="result-value">${analysisResults.complexity.score}%</span>
                </div>
            `;
        }
        
        resultsContent.innerHTML = resultsHTML;
        resultsPanel.style.display = 'block';
        
        // Update canvas with analysis overlay
        if (uploadedImage) {
            drawKolamOnCanvas(uploadedImage);
        }
        
    } catch (error) {
        console.error('Error displaying results:', error);
    }
}

// Reset analysis button
function resetAnalysisButton() {
    analysisInProgress = false;
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-microscope"></i> Analyze Pattern';
    }
}

// Clear analysis
function clearAnalysis() {
    try {
        uploadedImage = null;
        analysisResults = {};
        
        const canvas = document.getElementById('kolamCanvas');
        const imagePreview = document.getElementById('imagePreview');
        const resultsPanel = document.getElementById('resultsPanel');
        const fileInput = document.getElementById('fileInput');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        if (canvas) {
            canvas.style.display = 'block';
            clearCanvas(); // Clear and reset canvas
        }
        if (imagePreview) imagePreview.style.display = 'none';
        if (resultsPanel) resultsPanel.style.display = 'none';
        if (fileInput) fileInput.value = '';
        if (analyzeBtn) {
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<i class="fas fa-microscope"></i> Analyze Pattern';
        }
        
        showToast('Analysis cleared', 'info');
        
    } catch (error) {
        console.error('Error clearing analysis:', error);
    }
}

// Advanced canvas analysis functions
function drawKolamOnCanvas(image) {
    try {
        if (!canvas || !ctx || !image) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scaling to fit image in canvas
        const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
        const scaledWidth = image.naturalWidth * scale;
        const scaledHeight = image.naturalHeight * scale;
        
        // Center the image
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        
        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image
        ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
        
        // Add analysis overlay if needed
        drawAnalysisOverlay();
        
    } catch (error) {
        console.error('Error drawing Kolam on canvas:', error);
    }
}

function drawAnalysisOverlay() {
    try {
        if (!ctx || Object.keys(analysisResults).length === 0) return;
        
        // Draw symmetry lines if symmetry analysis is available
        if (analysisResults.symmetry) {
            ctx.strokeStyle = 'rgba(255, 107, 107, 0.6)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            
            // Draw center lines for symmetry
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Vertical line
            ctx.beginPath();
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, canvas.height);
            ctx.stroke();
            
            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(canvas.width, centerY);
            ctx.stroke();
            
            ctx.setLineDash([]); // Reset line dash
        }
        
        // Add complexity indicator
        if (analysisResults.complexity) {
            ctx.fillStyle = 'rgba(84, 160, 255, 0.8)';
            ctx.font = '14px Inter';
            ctx.fillText(`Complexity: ${analysisResults.complexity.level}`, 10, 25);
        }
        
    } catch (error) {
        console.error('Error drawing analysis overlay:', error);
    }
}

// Save analysis to gallery
function saveAnalysisToGallery() {
    try {
        if (!uploadedImage || Object.keys(analysisResults).length === 0) {
            return;
        }
        
        const analysisData = {
            id: Date.now(),
            image: uploadedImage.src,
            results: analysisResults,
            timestamp: new Date().toISOString(),
            type: 'analyzed'
        };
        
        analyzedKolams.push(analysisData);
        localStorage.setItem('analyzedKolams', JSON.stringify(analyzedKolams));
        
    } catch (error) {
        console.error('Error saving analysis to gallery:', error);
    }
}
// Switch between sections
function switchSection(sectionName) {
    try {
        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionName}`) {
                link.classList.add('active');
            }
        });
        
        // Update sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            currentSection = sectionName;
        }
        
        // Initialize section-specific functionality
        if (sectionName === 'gallery') {
            loadGallery();
        }
    } catch (error) {
        console.error('Error switching section:', error);
    }
}

// Profile menu toggle
function toggleProfileMenu() {
    try {
        const profileMenu = document.getElementById('profileMenu');
        if (profileMenu) {
            profileMenu.classList.toggle('show');
        }
    } catch (error) {
        console.error('Error toggling profile menu:', error);
    }
}

// Close profile menu when clicking outside
document.addEventListener('click', function(e) {
    const profileMenu = document.getElementById('profileMenu');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (profileMenu && !profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
        profileMenu.classList.remove('show');
    }
});



// Canvas tools for analysis
function downloadResults() {
    try {
        if (!uploadedImage && !canvas) {
            showToast('No image to download', 'error');
            return;
        }
        
        let downloadUrl;
        
        // If we have analysis results, download the canvas with overlays
        if (Object.keys(analysisResults).length > 0 && canvas) {
            downloadUrl = canvas.toDataURL('image/png');
        } else if (uploadedImage) {
            // Otherwise download the original image
            downloadUrl = uploadedImage.src;
        } else {
            showToast('No content available to download', 'error');
            return;
        }
        
        const link = document.createElement('a');
        link.download = `kolam-analysis-${Date.now()}.png`;
        link.href = downloadUrl;
        link.click();
        
        showToast('Analysis image downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error downloading results:', error);
        showToast('Error downloading image', 'error');
    }
}

function shareResults() {
    showToast('Share functionality coming soon!', 'info');
}

function exportResults() {
    try {
        if (Object.keys(analysisResults).length === 0) {
            showToast('No analysis results to export', 'error');
            return;
        }
        
        const exportData = {
            timestamp: new Date().toISOString(),
            results: analysisResults,
            imageInfo: {
                width: uploadedImage?.naturalWidth || 0,
                height: uploadedImage?.naturalHeight || 0
            },
            analysisOptions: {
                symmetryAnalysis: document.getElementById('symmetryAnalysis')?.checked || false,
                colorExtraction: document.getElementById('colorExtraction')?.checked || false,
                patternRecognition: document.getElementById('patternRecognition')?.checked || false,
                complexityMeasure: document.getElementById('complexityMeasure')?.checked || false
            }
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `kolam-analysis-${Date.now()}.json`;
        link.click();
        
        showToast('Analysis results exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting results:', error);
        showToast('Error exporting analysis results', 'error');
    }
}

// Toggle analysis overlay on canvas
function toggleAnalysisOverlay() {
    try {
        if (!uploadedImage || Object.keys(analysisResults).length === 0) {
            showToast('No analysis data available', 'error');
            return;
        }
        
        // Redraw image without overlay first
        drawKolamOnCanvas(uploadedImage);
        
        // Check if overlay should be shown (you can add a toggle state here)
        const showOverlay = true; // This could be controlled by a button
        
        if (showOverlay) {
            drawAnalysisOverlay();
        }
        
    } catch (error) {
        console.error('Error toggling analysis overlay:', error);
    }
}
function downloadKolam() {
    try {
        if (!uploadedImage) {
            showToast('No image to download', 'error');
            return;
        }
        
        const link = document.createElement('a');
        link.download = `kolam-${Date.now()}.png`;
        link.href = uploadedImage.src;
        link.click();
        
        showToast('Kolam downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error downloading Kolam:', error);
        showToast('Error downloading Kolam', 'error');
    }
}

function shareKolam() {
    showToast('Share functionality coming soon!', 'info');
}

function saveToGallery() {
    try {
        if (!uploadedImage || Object.keys(analysisResults).length === 0) {
            showToast('No analyzed pattern to save', 'error');
            return;
        }
        
        const kolamData = {
            id: Date.now(),
            image: uploadedImage.src,
            results: analysisResults,
            timestamp: new Date().toISOString(),
            type: 'analyzed'
        };
        
        let savedKolams = JSON.parse(localStorage.getItem('savedKolams') || '[]');
        savedKolams.push(kolamData);
        localStorage.setItem('savedKolams', JSON.stringify(savedKolams));
        
        showToast('Analysis saved to gallery!', 'success');
    } catch (error) {
        console.error('Error saving to gallery:', error);
        showToast('Error saving to gallery', 'error');
    }
}

// Gallery Functions
function loadGallery() {
    try {
        const savedKolams = JSON.parse(localStorage.getItem('savedKolams') || '[]');
        const analyzedKolams = JSON.parse(localStorage.getItem('analyzedKolams') || '[]');
        
        const allKolams = [...savedKolams, ...analyzedKolams];
        displayGalleryItems(allKolams);
    } catch (error) {
        console.error('Error loading gallery:', error);
        showToast('Error loading gallery', 'error');
    }
}

function filterGallery(filter) {
    try {
        const savedKolams = JSON.parse(localStorage.getItem('savedKolams') || '[]');
        const analyzedKolams = JSON.parse(localStorage.getItem('analyzedKolams') || '[]');
        
        let filteredKolams = [];
        
        switch (filter) {
            case 'all':
                filteredKolams = [...savedKolams, ...analyzedKolams];
                break;
            case 'traditional':
                filteredKolams = [...savedKolams, ...analyzedKolams].filter(k => 
                    k.results?.pattern === 'Traditional' || k.type === 'traditional'
                );
                break;
            case 'modern':
                filteredKolams = [...savedKolams, ...analyzedKolams].filter(k => 
                    k.results?.pattern === 'Modern' || k.type === 'modern'
                );
                break;
            case 'favorites':
                filteredKolams = [...savedKolams, ...analyzedKolams].filter(k => k.favorite);
                break;
        }
        
        displayGalleryItems(filteredKolams);
    } catch (error) {
        console.error('Error filtering gallery:', error);
    }
}

function displayGalleryItems(kolams) {
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (!galleryGrid) {
        console.error('Gallery grid element not found');
        return;
    }
    
    if (kolams.length === 0) {
        galleryGrid.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5); grid-column: 1/-1;">No patterns found</p>';
        return;
    }
    
    galleryGrid.innerHTML = kolams.map(kolam => {
        const analysisInfo = kolam.results ? `
            <div class="analysis-summary">
                ${kolam.results.symmetry ? `<span class="analysis-tag">Symmetry: ${kolam.results.symmetry.score}%</span>` : ''}
                ${kolam.results.pattern ? `<span class="analysis-tag">Pattern: ${kolam.results.pattern}</span>` : ''}
                ${kolam.results.complexity ? `<span class="analysis-tag">Complexity: ${kolam.results.complexity.level}</span>` : ''}
            </div>
        ` : '';
        
        return `
            <div class="gallery-item">
                ${kolam.image ? `<img src="${kolam.image}" alt="Kolam pattern">` : '<div class="placeholder-image">Analyzed Pattern</div>'}
                <div class="item-info">
                    <p>Created: ${new Date(kolam.timestamp).toLocaleDateString()}</p>
                    <p>Type: ${kolam.type}</p>
                    ${analysisInfo}
                </div>
                <div class="item-actions">
                    <button class="action-btn" onclick="viewKolamDetails('${kolam.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="downloadKolamFromGallery('${kolam.id}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn" onclick="toggleFavorite('${kolam.id}')" title="Toggle Favorite">
                        <i class="${kolam.favorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Gallery action functions
function viewKolamDetails(kolamId) {
    try {
        const savedKolams = JSON.parse(localStorage.getItem('savedKolams') || '[]');
        const analyzedKolams = JSON.parse(localStorage.getItem('analyzedKolams') || '[]');
        const allKolams = [...savedKolams, ...analyzedKolams];
        
        const kolam = allKolams.find(k => k.id.toString() === kolamId);
        if (kolam && kolam.results) {
            let detailsHTML = `
                <div class="kolam-details-modal">
                    <h3>Analysis Details</h3>
                    <div class="details-content">
            `;
            
            if (kolam.results.symmetry) {
                detailsHTML += `<p><strong>Symmetry:</strong> ${kolam.results.symmetry.type} (${kolam.results.symmetry.score}%)</p>`;
            }
            if (kolam.results.pattern) {
                detailsHTML += `<p><strong>Pattern:</strong> ${kolam.results.pattern}</p>`;
            }
            if (kolam.results.complexity) {
                detailsHTML += `<p><strong>Complexity:</strong> ${kolam.results.complexity.level} (${kolam.results.complexity.score}%)</p>`;
            }
            
            detailsHTML += `
                    </div>
                </div>
            `;
            
            showToast('Analysis details loaded', 'info');
        }
    } catch (error) {
        console.error('Error viewing Kolam details:', error);
    }
}

function downloadKolamFromGallery(kolamId) {
    try {
        const savedKolams = JSON.parse(localStorage.getItem('savedKolams') || '[]');
        const analyzedKolams = JSON.parse(localStorage.getItem('analyzedKolams') || '[]');
        const allKolams = [...savedKolams, ...analyzedKolams];
        
        const kolam = allKolams.find(k => k.id.toString() === kolamId);
        if (kolam && kolam.image) {
            const link = document.createElement('a');
            link.download = `kolam-${kolamId}.png`;
            link.href = kolam.image;
            link.click();
            
            showToast('Kolam downloaded!', 'success');
        }
    } catch (error) {
        console.error('Error downloading from gallery:', error);
    }
}

function toggleFavorite(kolamId) {
    try {
        let savedKolams = JSON.parse(localStorage.getItem('savedKolams') || '[]');
        let analyzedKolams = JSON.parse(localStorage.getItem('analyzedKolams') || '[]');
        
        // Find and update in saved kolams
        let found = false;
        savedKolams = savedKolams.map(kolam => {
            if (kolam.id.toString() === kolamId) {
                kolam.favorite = !kolam.favorite;
                found = true;
            }
            return kolam;
        });
        
        // Find and update in analyzed kolams if not found
        if (!found) {
            analyzedKolams = analyzedKolams.map(kolam => {
                if (kolam.id.toString() === kolamId) {
                    kolam.favorite = !kolam.favorite;
                }
                return kolam;
            });
        }
        
        localStorage.setItem('savedKolams', JSON.stringify(savedKolams));
        localStorage.setItem('analyzedKolams', JSON.stringify(analyzedKolams));
        
        // Refresh current gallery view
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        filterGallery(activeFilter);
        
        showToast('Favorite updated!', 'info');
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
}
function logout() {
    showToast('Logging out...', 'info');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Toast notification system
function showToast(message, type = 'info') {
    try {
        const toast = document.getElementById('toast');
        if (!toast) {
            console.error('Toast element not found');
            return;
        }
        
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        toastIcon.className = `toast-icon ${icons[type]}`;
        toastIcon.style.color = colors[type];
        toastMessage.textContent = message;
        
        toast.style.display = 'flex';
        toast.style.borderColor = colors[type];
        
        setTimeout(() => {
            hideToast();
        }, 4000);
    } catch (error) {
        console.error('Error showing toast:', error);
        alert(message);
    }
}

function hideToast() {
    try {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.animation = '';
        }, 300);
    } catch (error) {
        console.error('Error hiding toast:', error);
    }
}

// Add CSS animation for slideOut
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    

    
    .gallery-item {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 15px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }
    
    .gallery-item:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-5px);
    }
    
    .gallery-item img,
    .placeholder-image {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 10px;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.6);
    }
    
    .item-info {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
    }
`;
document.head.appendChild(style);


const fileInput = document.getElementById("fileInput");

const kolamResult = document.getElementById("kolamResult");



fileInput.addEventListener("change", async () => {

    if (!fileInput.files[0]) return;



    const formData = new FormData();

    formData.append("file", fileInput.files[0]);



    kolamResult.textContent = "Analyzing...";



    try {

        const response = await fetch("http://127.0.0.1:5000/analyze", {

            method: "POST",

            body: formData

        });



        const data = await response.json();



       if (data.status === "success") {

    const classification = data.classification;



    const symLabel = classification.symmetry?.id ?? "Unknown";

    const gridLabel = classification.grid?.id ?? "Unknown";

    const shapeLabel = classification.shape?.id ?? "Unknown";



    kolamResult.textContent =

        `Analysis Complete!\n` +
        `Symmetry: ${symLabel}\n` +
        `Grid: ${gridLabel}\n` +
        `Shape: ${shapeLabel}`;

}
       else {

            kolamResult.textContent = "Error: " + data.message;

        }

    } catch (err) {

        kolamResult.textContent = "Server error: " + err.message;

    }

});