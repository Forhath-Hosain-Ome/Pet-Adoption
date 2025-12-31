/**
 * Paws & Tails - Main JavaScript
 * Professional & Clean Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. Mock Database (Fake API Response)
    // =========================================
    const petsData = [
        {
            id: 1,
            name: "Max",
            type: "dog",
            age: "2 yrs",
            gender: "male",
            image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&q=60",
            location: "Dhaka",
            badge: "New",
            desc: "Max is energetic and loves playing fetch.",
            features: ["Vaccinated", "Friendly", "Trained"]
        },
        {
            id: 2,
            name: "Luna",
            type: "cat",
            age: "1 yr",
            gender: "female",
            image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&q=60",
            location: "Chittagong",
            badge: "Popular",
            desc: "Luna is a calm cat who loves looking out the window.",
            features: ["House Trained", "Calm", "Indoor"]
        },
        {
            id: 3,
            name: "Coco",
            type: "dog",
            age: "6 mon",
            gender: "male",
            image: "https://images.unsplash.com/photo-1583512603806-077998240c7a?w=500&q=60",
            location: "Sylhet",
            badge: "Special",
            desc: "Coco is a fluffy bunny looking for carrots and love.",
            features: ["Gentle", "Small", "Cute"]
        },
        {
            id: 4,
            name: "Rocky",
            type: "dog",
            age: "4 yrs",
            gender: "male",
            image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=60",
            location: "Dhaka",
            badge: "",
            desc: "Rocky is a loyal guard dog and very protective.",
            features: ["Guard Dog", "Loyal", "Strong"]
        },
        {
            id: 5,
            name: "Mimi",
            type: "cat",
            age: "3 yrs",
            gender: "female",
            image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=60",
            location: "Rajshahi",
            badge: "Urgent",
            desc: "Mimi needs a home urgently due to shelter space.",
            features: ["Vaccinated", "Shy", "Needs Love"]
        },
        {
            id: 6,
            name: "Tweety",
            type: "bird",
            age: "1 yr",
            gender: "female",
            image: "https://images.unsplash.com/photo-1606567595334-d39972c85dbe?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: "Khulna",
            badge: "",
            desc: "Tweety sings beautiful songs every morning.",
            features: ["Singer", "Colorful", "Active"]
        }
    ];

    // =========================================
    // 2. DOM Elements Selection
    // =========================================
    const elements = {
        petsContainer: document.getElementById('petsContainer'),
        filterType: document.getElementById('filterType'),
        filterAge: document.getElementById('filterAge'),
        filterGender: document.getElementById('filterGender'),
        searchBtn: document.getElementById('searchBtn'),
        mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
        navbar: document.querySelector('.navbar'),
        modal: document.getElementById('petModal'),
        modalBody: document.getElementById('modalBody'),
        modalClose: document.querySelector('.modal-close'),
        volunteerForm: document.getElementById('volunteerForm'),
        donateBtns: document.querySelectorAll('.btn-amount')
    };

    // =========================================
    // 3. Functions
    // =========================================

    // Render Pets to the Grid
    const renderPets = (pets) => {
        if (!elements.petsContainer) return; // Skip if element doesn't exist
        
        elements.petsContainer.innerHTML = ""; // Clear previous content

        if (pets.length === 0) {
            elements.petsContainer.innerHTML = `
                <div class="no-pets" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <h3>No pets found matching your criteria 😔</h3>
                </div>`;
            return;
        }

        pets.forEach(pet => {
            const card = document.createElement('article');
            card.className = 'pet-card';
            card.innerHTML = `
                <div class="pet-image-wrapper">
                    <img src="${pet.image}" alt="${pet.name}" loading="lazy">
                    ${pet.badge ? `<span class="badge">${pet.badge}</span>` : ''}
                </div>
                <div class="pet-info">
                    <h3>${pet.name}</h3>
                    <ul class="pet-stats">
                        <li><i class="fas fa-paw"></i> ${pet.type}</li>
                        <li><i class="fas fa-clock"></i> ${pet.age}</li>
                        <li><i class="fas fa-venus-mars"></i> ${pet.gender}</li>
                    </ul>
                    <button class="btn btn-block btn-primary view-details-btn" data-id="${pet.id}">Meet ${pet.name}</button>
                </div>
            `;
            elements.petsContainer.appendChild(card);
        });

        // Re-attach event listeners to new buttons
        attachModalListeners();
    };

    // Filter Logic
    const filterPets = () => {
        if (!elements.filterType || !elements.filterGender) return; // Skip if filters don't exist
        
        const type = elements.filterType.value.toLowerCase();
        const gender = elements.filterGender.value.toLowerCase();
        
        // Simple Filter Logic
        const filtered = petsData.filter(pet => {
            const matchType = type === "" || pet.type === type;
            const matchGender = gender === "" || pet.gender === gender;
            return matchType && matchGender;
        });

        renderPets(filtered);
    };

    // Modal Logic
    const openModal = (petId) => {
        const pet = petsData.find(p => p.id == petId);
        if (!pet) return;

        elements.modalBody.innerHTML = `
            <div style="text-align: center;">
                <img src="${pet.image}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
                <h2 style="color: var(--primary); margin-bottom: 0.5rem;">${pet.name}</h2>
                <p style="color: var(--gray); margin-bottom: 1rem;">${pet.desc}</p>
                <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 1.5rem;">
                    ${pet.features.map(f => `<span style="background: #e3f2fd; color: var(--primary); padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;">${f}</span>`).join('')}
                </div>
                <button class="btn btn-primary btn-block" onclick="alert('Application Started for ${pet.name}!')">Adopt ${pet.name}</button>
            </div>
        `;
        elements.modal.classList.add('active');
    };

    const closeModal = () => {
        elements.modal.classList.remove('active');
    };

    const attachModalListeners = () => {
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                openModal(e.target.dataset.id);
            });
        });
    };

    // Notification Toast
    const showNotification = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; 
            background: ${type === 'success' ? 'var(--success)' : 'var(--accent)'}; 
            color: white; padding: 1rem 2rem; border-radius: 5px; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 3000; 
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // =========================================
    // 4. Event Listeners Initialization
    // =========================================

    // Initial Render (only if container exists)
    if (elements.petsContainer) {
        renderPets(petsData);
    }

    // Search / Filter Button Click
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submit reload
            const btnText = elements.searchBtn.innerHTML;
            elements.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
            
            // Simulate API Delay
            setTimeout(() => {
                filterPets();
                elements.searchBtn.innerHTML = btnText;
                showNotification('Search results updated!');
            }, 500);
        });
    }

    // Mobile Menu Toggle
    if (elements.mobileMenuBtn && elements.navbar) {
        elements.mobileMenuBtn.addEventListener('click', () => {
            elements.navbar.classList.toggle('active');
        });
    }

    // Modal Close Actions
    if (elements.modalClose && elements.modal) {
        elements.modalClose.addEventListener('click', closeModal);
        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) closeModal();
        });
    }

    // =========================================
    // Form Submission Handlers (AJAX)
    // =========================================
    
    /**
     * Generic form submission handler
     * Sends form data to API endpoint and saves to database
     */
    const handleFormSubmit = async (form, apiEndpoint, successMessage) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                // Get CSRF token
                const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                
                // Collect form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Special handling for checkboxes (multiple values)
                if (form.querySelectorAll('input[type="checkbox"]:checked').length > 0) {
                    const checkedBoxes = form.querySelectorAll('input[type="checkbox"]:checked');
                    if (checkedBoxes.length > 0) {
                        const checkboxName = checkedBoxes[0].name;
                        // Convert array to comma-separated string
                        const values = Array.from(checkedBoxes).map(cb => cb.value);
                        data[checkboxName] = values.join(', ');
                    }
                }
                
                console.log('Form data being sent:', data);
                console.log('API endpoint:', apiEndpoint);
                
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                submitBtn.disabled = true;
                
                // Send request to API
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('Response status:', response.status);
                
                // Handle response
                if (response.ok) {
                    const result = await response.json();
                    console.log('Success response:', result);
                    showNotification(successMessage || 'Submitted Successfully!', 'success');
                    form.reset();
                } else {
                    const error = await response.json();
                    console.error('API Error:', error);
                    const errorMessage = error.detail || JSON.stringify(error) || 'Failed to submit. Please try again.';
                    showNotification(errorMessage, 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('An error occurred. Please try again.', 'error');
            } finally {
                // Restore button state
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    };
    
    // Adoption Form
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm) {
        handleFormSubmit(adoptionForm, '/api/v1/adoptions/', 'Adoption Application Submitted Successfully!');
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        handleFormSubmit(contactForm, '/api/v1/contacts/', 'Contact Message Sent Successfully!');
    }
    
    // Volunteer Form
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        handleFormSubmit(volunteerForm, '/api/v1/volunteers/', 'Volunteer Application Submitted Successfully!');
    }
    
    // Donation Form
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                const formData = new FormData(donationForm);
                const data = Object.fromEntries(formData);
                
                // Convert checkbox to boolean
                data.is_anonymous = data.is_anonymous === 'on' ? true : false;
                
                console.log('Donation form data:', data);
                
                // Show loading state
                const submitBtn = donationForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                const response = await fetch('/api/v1/donations/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('Donation response status:', response.status);
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Donation saved:', result);
                    showNotification('Thank you for your donation! 💝', 'success');
                    donationForm.reset();
                } else {
                    const error = await response.json();
                    console.error('Donation error:', error);
                    const errorMessage = error.detail || JSON.stringify(error) || 'Donation submission failed.';
                    showNotification(errorMessage, 'error');
                }
            } catch (error) {
                console.error('Donation submission error:', error);
                showNotification('An error occurred. Please try again.', 'error');
            } finally {
                const submitBtn = donationForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                const email = document.getElementById('newsletterEmail').value;
                const data = { email: email };
                
                console.log('Newsletter data:', data);
                
                const submitBtn = newsletterForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
                submitBtn.disabled = true;
                
                const response = await fetch('/api/v1/newsletter/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('Newsletter response status:', response.status);
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Newsletter saved:', result);
                    showNotification('Successfully subscribed to our newsletter! 📧', 'success');
                    newsletterForm.reset();
                } else {
                    const error = await response.json();
                    console.error('Newsletter error:', error);
                    const errorMessage = error.detail || error.email?.[0] || JSON.stringify(error) || 'Subscription failed.';
                    showNotification(errorMessage, 'error');
                }
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                showNotification('An error occurred. Please try again.', 'error');
            } finally {
                const submitBtn = newsletterForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Donation Buttons Logic (for UI only - doesn't affect submission)
    if (elements.donateBtns && elements.donateBtns.length > 0) {
        elements.donateBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                elements.donateBtns.forEach(b => b.style.background = 'transparent');
                elements.donateBtns.forEach(b => b.style.color = 'white');
                
                this.style.background = 'white';
                this.style.color = 'var(--primary)';
            });
        });
    }

});
// =========================================
    // Smooth Scroll & Active Link Logic
    // =========================================
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // ১. সব লিংক থেকে active ক্লাস সরিয়ে ফেলা
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // ২. যেটাতে ক্লিক করা হয়েছে সেটাতে active ক্লাস দেওয়া
            link.classList.add('active');

            // ৩. মোবাইলে লিংক ক্লিক করলে মেনু বন্ধ করে দেওয়া
            elements.navbar.classList.remove('active');
        });
    });

    // স্ক্রল করার সময় অটোমেটিক Active লিংক পরিবর্তন (Optional but Pro)
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
// CSS Keyframes injection for Toast Notification
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);

// =========================================
    // Dark/Light Mode Logic
    // =========================================
    const themeBtn = document.getElementById('themeToggle');
    const themeIcon = themeBtn.querySelector('i');
    
    // 1. Check if user previously selected dark mode
    const savedTheme = localStorage.getItem('theme');
    
    // Function to apply theme
    const applyTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    };

    // Apply saved theme on load
    if (savedTheme === 'dark') {
        applyTheme(true);
    }

    // 2. Toggle theme on click
    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        
        // Update Icon
        if (isDark) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark'); 
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });