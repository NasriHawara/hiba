// Book State Management
let currentPage = 1;
const totalPages = 6;
let isMobile = false;

// Detect mobile device
function checkMobile() {
    isMobile = window.innerWidth <= 768;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    checkMobile();
    initializePages();
    if (!isMobile) {
        updatePageDisplay();
        updateNavigationButtons();
    }
});

// Initialize all pages
function initializePages() {
    for (let i = 1; i <= totalPages; i++) {
        const page = document.getElementById(`page${i}`);
        if (page) {
            page.style.setProperty('--page-index', i);
            
            if (!isMobile) {
                // Desktop: Set proper z-index for 3D stacking
                page.style.zIndex = (totalPages + 1 - i).toString();
                
                // Only first page should show content initially
                if (i === 1) {
                    page.classList.add('content-revealed');
                } else {
                    page.classList.remove('content-revealed');
                }
            } else {
                // Mobile: All pages visible with content
                page.classList.add('content-revealed');
                page.style.display = 'block';
            }
        }
    }
}

// Open Book Function
function openBook() {
    const bookCover = document.getElementById('bookCover');
    const bookContainer = document.getElementById('bookContainer');
    
    // Hide cover
    bookCover.classList.add('hidden');
    
    // Show book container
    bookContainer.classList.remove('hidden');
    
    // Add visible class after a short delay for smooth transition
    setTimeout(() => {
        bookContainer.classList.add('visible');
        
        // On mobile, scroll to top
        if (isMobile) {
            window.scrollTo(0, 0);
        }
    }, 50);
}

// Close Book Function
function closeBook() {
    const bookCover = document.getElementById('bookCover');
    const bookContainer = document.getElementById('bookContainer');
    
    // Hide book container
    bookContainer.classList.remove('visible');
    
    // After transition, show cover and reset
    setTimeout(() => {
        bookContainer.classList.add('hidden');
        bookCover.classList.remove('hidden');
        
        // Reset to page 1 after a short delay (only for desktop)
        if (!isMobile) {
            setTimeout(() => {
                currentPage = 1;
                resetAllPages();
                updatePageDisplay();
                updateNavigationButtons();
            }, 100);
        }
    }, 600);
}

// Reset all pages to unflipped state (Desktop only)
function resetAllPages() {
    if (isMobile) return; // No reset needed on mobile
    
    for (let i = 1; i <= totalPages; i++) {
        const page = document.getElementById(`page${i}`);
        if (page) {
            page.classList.remove('flipped');
            page.classList.remove('content-revealed');
            
            // Only first page shows content after reset
            if (i === 1) {
                page.classList.add('content-revealed');
            }
        }
    }
}

// Next Page Function (Desktop only)
function nextPage() {
    if (isMobile) return; // No page navigation on mobile
    
    if (currentPage < totalPages) {
        // Desktop: 3D flip animation
        const currentPageElement = document.getElementById(`page${currentPage}`);
        if (currentPageElement) {
            currentPageElement.classList.add('flipped');
        }
        
        currentPage++;
        
        const nextPageElement = document.getElementById(`page${currentPage}`);
        if (nextPageElement) {
            nextPageElement.classList.add('content-revealed');
        }
        
        updatePageDisplay();
        updateNavigationButtons();
    }
}

// Previous Page Function (Desktop only)
function previousPage() {
    if (isMobile) return; // No page navigation on mobile
    
    if (currentPage > 1) {
        // Desktop: Unflip animation
        currentPage--;
        
        const currentPageElement = document.getElementById(`page${currentPage}`);
        if (currentPageElement) {
            currentPageElement.classList.remove('flipped');
        }
        
        updatePageDisplay();
        updateNavigationButtons();
    }
}

// Update Page Display (Desktop only)
function updatePageDisplay() {
    if (isMobile) return; // No page indicator update on mobile
    
    // Update page indicator
    const currentPageNum = document.getElementById('currentPageNum');
    const totalPagesNum = document.getElementById('totalPages');
    
    if (currentPageNum) currentPageNum.textContent = currentPage;
    if (totalPagesNum) totalPagesNum.textContent = totalPages;
}

// Update Navigation Buttons State (Desktop only)
function updateNavigationButtons() {
    if (isMobile) return; // No buttons on mobile
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
}

// WhatsApp Form Submission
function sendWhatsApp(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    
    // Format the WhatsApp message
    const whatsappMessage = `Hi! My name is ${name}.\n\n${message}`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Replace with actual WhatsApp number (format: country code + number, no spaces or special characters)
    // Example: 15551234567 for US number +1 (555) 123-4567
    const phoneNumber = '15551234567';
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${+9613716610}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Reset form
    document.getElementById('whatsappForm').reset();
    
    return false;
}

// Handle Window Resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const wasMobile = isMobile;
        checkMobile();
        
        // If device type changed, reinitialize
        if (wasMobile !== isMobile) {
            initializePages();
            if (!isMobile) {
                currentPage = 1;
                updatePageDisplay();
                updateNavigationButtons();
            }
        }
    }, 250);
});

// Keyboard Navigation (Desktop only)
document.addEventListener('keydown', (event) => {
    if (isMobile) return; // No keyboard navigation on mobile
    
    // Only work when book is open
    const bookContainer = document.getElementById('bookContainer');
    if (bookContainer && bookContainer.classList.contains('visible')) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            nextPage();
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            previousPage();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            closeBook();
        }
    } else {
        // On cover page, Enter or Space to open
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openBook();
        }
    }
});