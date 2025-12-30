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