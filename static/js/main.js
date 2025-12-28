/**
 * Paws & Tails - Main JavaScript with API Integration
 * Saves and retrieves data from database
 */

const API_BASE = '/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. Load Pets from Database
    // =========================================
    async function loadPets() {
        try {
            const response = await fetch(`${API_BASE}/pets/`);
            const data = await response.json();
            const pets = data.results || data;
            
            if (pets.length === 0) {
                document.getElementById('petsContainer').innerHTML = '<p>No pets available</p>';
                return;
            }
            
            displayPets(pets);
        } catch (error) {
            console.error('Error loading pets:', error);
        }
    }

    function displayPets(pets) {
        const container = document.getElementById('petsContainer');
        if (!container) return;
        
        container.innerHTML = pets.map(pet => `
            <div class="pet-card">
                <div class="pet-image">
                    ${pet.image ? `<img src="${pet.image}" alt="${pet.name}">` : '<div class="no-image">No Image</div>'}
                </div>
                <div class="pet-info">
                    <h3>${pet.name}</h3>
                    <p><strong>Type:</strong> ${pet.pet_type}</p>
                    <p><strong>Age:</strong> ${pet.age}</p>
                    <p><strong>Gender:</strong> ${pet.gender}</p>
                    <p><strong>Status:</strong> ${pet.status}</p>
                    ${pet.description ? `<p>${pet.description}</p>` : ''}
                    <button onclick="viewPetDetails(${pet.id})" class="btn btn-primary">View Details</button>
                </div>
            </div>
        `).join('');
    }

    // =========================================
    // 2. Filter Pets
    // =========================================
    document.getElementById('filterType')?.addEventListener('change', filterPets);
    document.getElementById('filterGender')?.addEventListener('change', filterPets);
    document.getElementById('filterAge')?.addEventListener('change', filterPets);
    document.getElementById('searchBtn')?.addEventListener('click', filterPets);

    async function filterPets() {
        const type = document.getElementById('filterType')?.value || '';
        const gender = document.getElementById('filterGender')?.value || '';
        const age = document.getElementById('filterAge')?.value || '';
        
        let url = `${API_BASE}/pets/?`;
        if (type) url += `pet_type=${type}&`;
        if (gender) url += `gender=${gender}&`;
        if (age) url += `age=${age}&`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayPets(data.results || data);
        } catch (error) {
            console.error('Error filtering pets:', error);
        }
    }

    // =========================================
    // 3. Contact Form Submission
    // =========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,
                message: document.getElementById('contactMessage').value
            };
            
            try {
                const response = await fetch(`${API_BASE}/contacts/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Thank you! Your message has been saved.');
                    contactForm.reset();
                } else {
                    alert('Error submitting form');
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
            }
        });
    }

    // =========================================
    // 4. Adoption Form Submission
    // =========================================
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm) {
        adoptionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const petId = adoptionForm.dataset.petId || document.getElementById('adoptionPetId').value;
            const formData = {
                adopter_name: document.getElementById('adopterName').value,
                adopter_email: document.getElementById('adopterEmail').value,
                adopter_phone: document.getElementById('adopterPhone').value,
                pet: petId,
                reason_for_adoption: document.getElementById('reasonForAdoption').value,
                home_type: document.getElementById('homeType').value,
                other_pets: document.getElementById('otherPets').value
            };
            
            try {
                const response = await fetch(`${API_BASE}/adoptions/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Your adoption application has been submitted!');
                    adoptionForm.reset();
                } else {
                    alert('Error submitting adoption form');
                }
            } catch (error) {
                console.error('Error submitting adoption form:', error);
            }
        });
    }

    // =========================================
    // 5. Volunteer Form Submission
    // =========================================
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('volunteerName').value,
                email: document.getElementById('volunteerEmail').value,
                phone: document.getElementById('volunteerPhone').value,
                interest: document.getElementById('volunteerInterest').value,
                bio: document.getElementById('volunteerBio').value,
                availability: document.getElementById('volunteerAvailability').value
            };
            
            try {
                const response = await fetch(`${API_BASE}/volunteers/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Thank you for volunteering! We\'ll contact you soon.');
                    volunteerForm.reset();
                } else {
                    alert('Error submitting volunteer form');
                }
            } catch (error) {
                console.error('Error submitting volunteer form:', error);
            }
        });
    }

    // =========================================
    // 6. Donation Form Submission
    // =========================================
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const isCustom = document.getElementById('donationCustom')?.checked || false;
            const formData = {
                donor_name: document.getElementById('donorName').value,
                donor_email: document.getElementById('donorEmail').value,
                amount: isCustom ? 
                    document.getElementById('customAmount').value : 
                    document.getElementById('donationAmount').value,
                is_custom: isCustom,
                message: document.getElementById('donationMessage').value,
                payment_status: 'pending'
            };
            
            try {
                const response = await fetch(`${API_BASE}/donations/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Thank you for your donation!');
                    donationForm.reset();
                } else {
                    alert('Error processing donation');
                }
            } catch (error) {
                console.error('Error submitting donation form:', error);
            }
        });
    }

    // =========================================
    // 7. Newsletter Subscription
    // =========================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('newsletterEmail').value;
            
            try {
                const response = await fetch(`${API_BASE}/newsletter/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({ email, is_active: true })
                });
                
                if (response.ok) {
                    alert('Thank you for subscribing!');
                    newsletterForm.reset();
                } else {
                    alert('Error subscribing to newsletter');
                }
            } catch (error) {
                console.error('Error subscribing to newsletter:', error);
            }
        });
    }

    // =========================================
    // 8. Mobile Menu Toggle
    // =========================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }

    // =========================================
    // 9. Scroll to Top
    // =========================================
    window.addEventListener('scroll', () => {
        const scrollBtn = document.getElementById('scrollTopBtn');
        if (scrollBtn) {
            scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        }
    });

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================
    // 10. Load pets on page load
    // =========================================
    loadPets();
});

// =========================================
// Helper Functions
// =========================================

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function viewPetDetails(petId) {
    try {
        const response = await fetch(`${API_BASE}/pets/${petId}/`);
        const pet = await response.json();
        
        const modal = document.getElementById('petModal');
        const modalBody = document.getElementById('modalBody');
        
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="pet-details">
                    ${pet.image ? `<img src="${pet.image}" alt="${pet.name}" style="max-width: 100%; height: auto;">` : ''}
                    <h2>${pet.name}</h2>
                    <p><strong>Type:</strong> ${pet.pet_type}</p>
                    <p><strong>Breed:</strong> ${pet.breed || 'Unknown'}</p>
                    <p><strong>Age:</strong> ${pet.age}</p>
                    <p><strong>Gender:</strong> ${pet.gender}</p>
                    <p><strong>Status:</strong> ${pet.status}</p>
                    <p><strong>Vaccinated:</strong> ${pet.is_vaccinated ? 'Yes' : 'No'}</p>
                    <p><strong>Neutered/Spayed:</strong> ${pet.is_neutered_spayed ? 'Yes' : 'No'}</p>
                    <p><strong>Health Status:</strong> ${pet.health_status || 'Healthy'}</p>
                    <p><strong>Description:</strong> ${pet.description || 'No description available'}</p>
                    <button onclick="adoptPet(${pet.id})" class="btn btn-success">Adopt ${pet.name}</button>
                </div>
            `;
            modal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading pet details:', error);
    }
}

function adoptPet(petId) {
    const modal = document.getElementById('adoptionModal');
    if (modal) {
        document.getElementById('adoptionPetId').value = petId;
        modal.style.display = 'block';
    }
}

// Close modals
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-close')) {
        e.target.closest('.modal').style.display = 'none';
    }
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});
        donateBtns: document.querySelectorAll('.btn-amount')
    };

    // =========================================
    // 3. Functions
    // =========================================

    // Render Pets to the Grid
    const renderPets = (pets) => {
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

    // Initial Render
    renderPets(petsData);

    // Search / Filter Button Click
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

    // Mobile Menu Toggle
    elements.mobileMenuBtn.addEventListener('click', () => {
        elements.navbar.classList.toggle('active');
    });

    // Modal Close Actions
    elements.modalClose.addEventListener('click', closeModal);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });

    // Volunteer Form Submit
    if(elements.volunteerForm) {
        elements.volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Application Submitted Successfully!');
            elements.volunteerForm.reset();
        });
    }

    // Donation Buttons Logic
    elements.donateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            elements.donateBtns.forEach(b => b.style.background = 'transparent');
            elements.donateBtns.forEach(b => b.style.color = 'white');
            
            this.style.background = 'white';
            this.style.color = 'var(--primary)';
        });
    });

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