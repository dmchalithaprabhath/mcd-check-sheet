// Daily Checklist App - Main JavaScript
class DailyChecklistApp {
    constructor() {
        this.checklistItems = [];
        this.currentDate = new Date().toISOString().split('T')[0];
        this.init();
    }

    init() {
        this.loadChecklist();
        this.setupEventListeners();
        this.updateProgress();
        this.checkForInstallPrompt();
        this.registerServiceWorker();
    }

    // Load checklist from localStorage or create default items
    loadChecklist() {
        const saved = localStorage.getItem(`checklist_${this.currentDate}`);
        if (saved) {
            this.checklistItems = JSON.parse(saved);
        } else {
            this.createDefaultChecklist();
        }
        this.renderChecklist();
    }

    // Create default checklist items
    createDefaultChecklist(force = false) {
        if (!force && localStorage.getItem(`checklist_${this.currentDate}`)) return;
        const defaultItems = [
            "Close Manager sign",
            "Crew information",
            "Timeline check - Ebis",
            "Next day documents",
            "Digital PMC",
            "Daily",
            "Monthly",
            "BIB",
            "Ice Maker Switch",
            "Green file",
            "Office Air conditioner off",
            "Office lights off",
            "Window blinders",
            "Coupon stand, toys, fan",
            "TV, Radio",
            "Counter Air conditioners",
            "Gas Valve x 3",
            "Marinatior, 4 Switches",
            "Grill, Steamer, Toasters, monitors",
            "Utility data – if Sunday",
            "Door lock checks x2",
            "POS key keeping",
            "Continuations",
            "2 heater lights",
            "Outside banner lights",
            "Shelf-life check sheet",
            "Cycle cut paper, soft machine oil check sheet",
            "De frosting Edamame, Macaron, Whip cream",
            "Sink close (Drier, Tempering, Auto sink, Buns, Hot water, valves)",
            "Hand washing sheet",
            "Daily close x 2 Papers",
            "Duct off",
            "Secom on"
        ];
        this.checklistItems = defaultItems.map((title, index) => ({
            id: `item_${Date.now()}_${index}`,
            title: title,
            completed: false,
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        }));
        this.saveChecklist();
    }

    // Save checklist to localStorage
    saveChecklist() {
        localStorage.setItem(`checklist_${this.currentDate}`, JSON.stringify(this.checklistItems));
        this.updateProgress();
    }

    // Render checklist items
    renderChecklist() {
        const container = document.getElementById('checklistContainer');
        container.innerHTML = '';

        this.checklistItems.forEach(item => {
            const itemElement = this.createChecklistItemElement(item);
            container.appendChild(itemElement);
        });
    }

    // Create individual checklist item element
    createChecklistItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = `checklist-item ${item.completed ? 'completed' : ''}`;
        itemDiv.dataset.id = item.id;

        itemDiv.innerHTML = `
            <div class="item-header">
                <div class="checkbox ${item.completed ? 'checked' : ''}" data-id="${item.id}">
                    ${item.completed ? '✓' : ''}
                </div>
                <div class="item-title ${item.completed ? 'completed' : ''}">${item.title}</div>
                <div class="item-actions">
                    <button class="action-btn edit-btn" data-id="${item.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${item.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
        `;

        return itemDiv;
    }

    // Setup event listeners
    setupEventListeners() {
        // Add item button
        document.getElementById('addItemBtn').addEventListener('click', () => {
            this.showAddModal();
        });

        // Export PDF button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.showShareModal();
        });

        // Reset checklist button
        document.getElementById('resetChecklistBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the checklist? This will restore all default items and remove your changes for today.')) {
                this.createDefaultChecklist(true);
                this.renderChecklist();
            }
        });

        // Modal event listeners
        this.setupModalListeners();

        // Checklist item event listeners (delegated)
        document.getElementById('checklistContainer').addEventListener('click', (e) => {
            const target = e.target.closest('[data-id]');
            if (!target) return;

            const itemId = target.dataset.id;
            
            if (target.classList.contains('checkbox')) {
                this.toggleItem(itemId);
            } else if (target.closest('.edit-btn')) {
                this.showEditModal(itemId);
            } else if (target.closest('.delete-btn')) {
                this.deleteItem(itemId);
            }
        });

        // Install prompt
        document.getElementById('installBtn')?.addEventListener('click', () => {
            this.installApp();
        });

        document.getElementById('dismissInstall')?.addEventListener('click', () => {
            this.hideInstallPrompt();
        });
    }

    // Setup modal event listeners
    setupModalListeners() {
        // Add item modal
        document.getElementById('closeAddModal').addEventListener('click', () => {
            this.hideAddModal();
        });

        document.getElementById('cancelAdd').addEventListener('click', () => {
            this.hideAddModal();
        });

        document.getElementById('addItemForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addItem();
        });

        // Edit item modal
        document.getElementById('closeEditModal').addEventListener('click', () => {
            this.hideEditModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.hideEditModal();
        });

        document.getElementById('editItemForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEdit();
        });

        // Share modal
        document.getElementById('closeShareModal').addEventListener('click', () => {
            this.hideShareModal();
        });

        document.getElementById('emailShare').addEventListener('click', () => {
            this.shareViaEmail();
        });

        document.getElementById('whatsappShare').addEventListener('click', () => {
            this.shareViaWhatsApp();
        });

        document.getElementById('downloadShare').addEventListener('click', () => {
            this.downloadPDF();
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    // Toggle item completion
    toggleItem(itemId) {
        const item = this.checklistItems.find(item => item.id === itemId);
        if (item) {
            item.completed = !item.completed;
            item.completedAt = item.completed ? new Date().toISOString() : null;
            this.saveChecklist();
            this.renderChecklist();
        }
    }

    // Add new item
    addItem() {
        const title = document.getElementById('itemTitle').value.trim();
        const notes = document.getElementById('itemNotes').value.trim();

        if (title) {
            const newItem = {
                id: `item_${Date.now()}_${Math.random()}`,
                title: title,
                completed: false,
                notes: notes,
                createdAt: new Date().toISOString(),
                completedAt: null
            };

            this.checklistItems.push(newItem);
            this.saveChecklist();
            this.renderChecklist();
            this.hideAddModal();
        }
    }

    // Delete item
    deleteItem(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.checklistItems = this.checklistItems.filter(item => item.id !== itemId);
            this.saveChecklist();
            this.renderChecklist();
        }
    }

    // Show add modal
    showAddModal() {
        document.getElementById('itemTitle').value = '';
        document.getElementById('itemNotes').value = '';
        document.getElementById('addItemModal').classList.add('show');
    }

    // Hide add modal
    hideAddModal() {
        document.getElementById('addItemModal').classList.remove('show');
    }

    // Show edit modal
    showEditModal(itemId) {
        const item = this.checklistItems.find(item => item.id === itemId);
        if (item) {
            document.getElementById('editItemId').value = itemId;
            document.getElementById('editItemTitle').value = item.title;
            document.getElementById('editItemNotes').value = item.notes;
            document.getElementById('editItemModal').classList.add('show');
        }
    }

    // Hide edit modal
    hideEditModal() {
        document.getElementById('editItemModal').classList.remove('show');
    }

    // Save edit
    saveEdit() {
        const itemId = document.getElementById('editItemId').value;
        const title = document.getElementById('editItemTitle').value.trim();
        const notes = document.getElementById('editItemNotes').value.trim();

        if (title) {
            const item = this.checklistItems.find(item => item.id === itemId);
            if (item) {
                item.title = title;
                item.notes = notes;
                this.saveChecklist();
                this.renderChecklist();
                this.hideEditModal();
            }
        }
    }

    // Update progress
    updateProgress() {
        const total = this.checklistItems.length;
        const completed = this.checklistItems.filter(item => item.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('progressPercentage').textContent = `${percentage}%`;
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('totalCount').textContent = total;
    }

    // Show share modal
    showShareModal() {
        document.getElementById('shareModal').classList.add('show');
    }

    // Hide share modal
    hideShareModal() {
        document.getElementById('shareModal').classList.remove('show');
    }

    // Share via email
    async shareViaEmail() {
        try {
            const pdfBlob = await this.generatePDF();
            const subject = `Daily Checklist - ${this.currentDate}`;
            const body = this.generateEmailBody();
            
            // Create email with PDF attachment
            const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // For email with attachment, we'll use the Web Share API if available
            if (navigator.share && navigator.canShare) {
                const file = new File([pdfBlob], `daily-checklist-${this.currentDate}.pdf`, { type: 'application/pdf' });
                
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `Daily Checklist - ${this.currentDate}`,
                        text: body,
                        files: [file]
                    });
                } else {
                    // Fallback to mailto
                    window.open(mailtoLink);
                }
            } else {
                // Fallback to mailto
                window.open(mailtoLink);
            }
        } catch (error) {
            console.error('Error sharing via email:', error);
            // Fallback to text-only email
            const subject = `Daily Checklist - ${this.currentDate}`;
            const body = this.generateEmailBody();
            const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoLink);
        }
        this.hideShareModal();
    }

    // Share via WhatsApp
    async shareViaWhatsApp() {
        try {
            const pdfBlob = await this.generatePDF();
            const text = this.generateWhatsAppText();
            
            // For WhatsApp sharing with PDF, we'll use the Web Share API if available
            if (navigator.share && navigator.canShare) {
                const file = new File([pdfBlob], `daily-checklist-${this.currentDate}.pdf`, { type: 'application/pdf' });
                
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `Daily Checklist - ${this.currentDate}`,
                        text: text,
                        files: [file]
                    });
                } else {
                    // Fallback to text-only WhatsApp
                    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
                    window.open(whatsappLink);
                }
            } else {
                // Fallback to text-only WhatsApp
                const whatsappLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(whatsappLink);
            }
        } catch (error) {
            console.error('Error sharing via WhatsApp:', error);
            // Fallback to text-only WhatsApp
            const text = this.generateWhatsAppText();
            const whatsappLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(whatsappLink);
        }
        this.hideShareModal();
    }

    // Download PDF
    downloadPDF() {
        this.generatePDF().then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `daily-checklist-${this.currentDate}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        this.hideShareModal();
    }

    // Generate email body
    generateEmailBody() {
        const completed = this.checklistItems.filter(item => item.completed);
        const incomplete = this.checklistItems.filter(item => !item.completed);
        const percentage = this.checklistItems.length > 0 ? 
            Math.round((completed.length / this.checklistItems.length) * 100) : 0;

        let body = `Daily Checklist Report - ${this.currentDate}\n`;
        body += `Completion Rate: ${percentage}%\n\n`;
        
        body += `✅ COMPLETED ITEMS (${completed.length}):\n`;
        completed.forEach(item => {
            body += `• ${item.title}`;
            if (item.notes) body += ` - ${item.notes}`;
            body += '\n';
        });

        if (incomplete.length > 0) {
            body += `\n❌ PENDING ITEMS (${incomplete.length}):\n`;
            incomplete.forEach(item => {
                body += `• ${item.title}`;
                if (item.notes) body += ` - ${item.notes}`;
                body += '\n';
            });
        }

        return body;
    }

    // Generate WhatsApp text
    generateWhatsAppText() {
        const completed = this.checklistItems.filter(item => item.completed);
        const percentage = this.checklistItems.length > 0 ? 
            Math.round((completed.length / this.checklistItems.length) * 100) : 0;

        let text = `📋 Daily Checklist - ${this.currentDate}\n`;
        text += `✅ Completion: ${percentage}% (${completed.length}/${this.checklistItems.length})\n\n`;
        
        if (completed.length > 0) {
            text += `✅ Completed:\n`;
            completed.forEach(item => {
                text += `• ${item.title}\n`;
            });
        }

        return text;
    }

    // Generate PDF
    async generatePDF() {
        const { jsPDF } = await import('https://cdn.skypack.dev/jspdf');
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        let y = 30;

        // Title
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('Daily Checklist Report', pageWidth / 2, y, { align: 'center' });
        y += 15;

        // Date
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Date: ${this.currentDate}`, pageWidth / 2, y, { align: 'center' });
        y += 20;

        // Progress
        const completed = this.checklistItems.filter(item => item.completed);
        const incomplete = this.checklistItems.filter(item => !item.completed);
        const percentage = this.checklistItems.length > 0 ? 
            Math.round((completed.length / this.checklistItems.length) * 100) : 0;

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Completion Rate: ${percentage}%`, margin, y);
        y += 15;

        // Progress bar
        const barWidth = pageWidth - 2 * margin;
        const fillWidth = (barWidth * percentage) / 100;
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(200, 200, 200);
        doc.rect(margin, y, barWidth, 10, 'F');
        doc.setFillColor(76, 175, 80);
        doc.rect(margin, y, fillWidth, 10, 'F');
        y += 20;

        // Summary section
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Summary:', margin, y);
        y += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Completed: ${completed.length} items`, margin, y);
        y += 6;
        doc.text(`Pending: ${incomplete.length} items`, margin, y);
        y += 10;

        // Completed Items Section
        if (completed.length > 0) {
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('COMPLETED ITEMS:', margin, y);
            y += 8;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            completed.forEach(item => {
                if (y > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    y = 20;
                }
                // Light green background
                doc.setFillColor(220, 255, 220);
                doc.rect(margin - 2, y - 4, pageWidth - 2 * margin + 4, 9, 'F');
                doc.setTextColor(0, 0, 0);
                doc.text(`[x] ${item.title}`, margin, y);
                y += 6;
                if (item.notes) {
                    doc.setFontSize(8);
                    doc.setFont(undefined, 'italic');
                    doc.text(`Note: ${item.notes}`, margin + 8, y);
                    doc.setFont(undefined, 'normal');
                    doc.setFontSize(10);
                    y += 5;
                }
                y += 2;
            });
        }

        // Pending Items Section
        if (incomplete.length > 0) {
            y += 4;
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('PENDING ITEMS:', margin, y);
            y += 8;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            incomplete.forEach(item => {
                if (y > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    y = 20;
                }
                // Light red background
                doc.setFillColor(255, 230, 230);
                doc.rect(margin - 2, y - 4, pageWidth - 2 * margin + 4, 9, 'F');
                doc.setTextColor(0, 0, 0);
                doc.text(`[ ] ${item.title}`, margin, y);
                y += 6;
                if (item.notes) {
                    doc.setFontSize(8);
                    doc.setFont(undefined, 'italic');
                    doc.text(`Note: ${item.notes}`, margin + 8, y);
                    doc.setFont(undefined, 'normal');
                    doc.setFontSize(10);
                    y += 5;
                }
                y += 2;
            });
        }

        doc.setTextColor(0, 0, 0); // Reset text color
        return doc.output('blob');
    }

    // PWA Install functionality
    checkForInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            this.hideInstallPrompt();
            deferredPrompt = null;
        });
    }

    showInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.classList.add('show');
        }
    }

    hideInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.classList.remove('show');
        }
    }

    async installApp() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('App installed successfully');
            }
            window.deferredPrompt = null;
        }
    }

    // Service Worker registration
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully');
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DailyChecklistApp();
});

// Handle offline/online status
window.addEventListener('online', () => {
    console.log('App is online');
});

window.addEventListener('offline', () => {
    console.log('App is offline');
}); 