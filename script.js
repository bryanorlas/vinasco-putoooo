const profiles = [
    {
        id: 1,
        name: "Ingrid",
        age: 24,
        bio: "Me encanta el esquí de fondo y el café en Oslo ⛷️☕",
        distance: "A 5 km de ti (Oslo)",
        interests: ["esquí", "café", "naturaleza"],
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Astrid",
        age: 26,
        bio: "Diseñadora de Bergen. Siempre buscando la próxima aurora boreal 🌌",
        distance: "A 12 km de ti (Bergen)",
        interests: ["diseño", "viajes", "fotografía"],
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Solveig",
        age: 23,
        bio: "Senderismo por los fiordos los fines de semana 🏔️",
        distance: "A 3 km de ti (Stavanger)",
        interests: ["senderismo", "montaña", "deporte"],
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Nora",
        age: 27,
        bio: "Arquitecta. Amante del salmón ahumado y el diseño nórdico 🐟",
        distance: "A 8 km de ti (Trondheim)",
        interests: ["arquitectura", "comida", "diseño"],
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        name: "Linnea",
        age: 25,
        bio: "Disfrutando del sol de medianoche en el verano nórdico ☀️",
        distance: "A 1 km de ti (Tromsø)",
        interests: ["verano", "fiestas", "música"],
        image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const cardStack = document.getElementById('card-stack');
let currentCardIndex = 0;
let matchedProfiles = [];
let filteredProfiles = [...profiles];

function createCard(profile, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.zIndex = filteredProfiles.length - index;
    
    // Scale and translate for background cards
    if (index > currentCardIndex) {
        const offset = index - currentCardIndex;
        card.style.transform = `scale(${1 - offset * 0.05}) translateY(${offset * 10}px)`;
    }

    card.innerHTML = `
        <img src="${profile.image}" alt="${profile.name}">
        <div class="stamp stamp-nope">NOPE</div>
        <div class="stamp stamp-like">LIKE</div>
        <div class="card-info">
            <h2 class="card-title">${profile.name} <span class="card-age">${profile.age}</span></h2>
            <p class="card-bio"><i class="fa-solid fa-quote-left"></i> ${profile.bio}</p>
            <div class="card-interests">
                ${profile.interests ? profile.interests.map(i => `<span class="interest-tag">${i}</span>`).join('') : ''}
            </div>
            <p class="distance"><i class="fa-solid fa-location-dot"></i> ${profile.distance}</p>
        </div>
    `;

    // Add drag functionality for the top card
    if (index === currentCardIndex) {
        makeCardDraggable(card);
    }

    return card;
}

function renderCards() {
    cardStack.innerHTML = '';
    filteredProfiles.forEach((profile, index) => {
        if (index >= currentCardIndex && index < currentCardIndex + 3) {
            const card = createCard(profile, index);
            cardStack.appendChild(card);
        }
    });

    if (currentCardIndex >= filteredProfiles.length) {
        cardStack.innerHTML = `
            <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; color:#94a3b8; text-align:center; padding: 20px;">
                <div style="width:80px;height:80px;border-radius:50%;background:#1e293b;display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow: 0 0 30px rgba(236, 72, 153, 0.2);">
                    <i class="fa-solid fa-fire" style="font-size:2rem;color:#ec4899;"></i>
                </div>
                <h3 style="color:white;font-size:1.5rem;margin-bottom:10px;">¡No hay más perfiles!</h3>
                <p>Vuelve más tarde para descubrir nuevas personas cerca de ti.</p>
            </div>
        `;
    }
}

function makeCardDraggable(card) {
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    const nopeStamp = card.querySelector('.stamp-nope');
    const likeStamp = card.querySelector('.stamp-like');

    const onPointerDown = (e) => {
        startX = e.clientX || e.touches[0].clientX;
        startY = e.clientY || e.touches[0].clientY;
        isDragging = true;
        card.style.transition = 'none';
    };

    const onPointerMove = (e) => {
        if (!isDragging) return;

        const currentX = e.clientX || e.touches[0].clientX;
        const currentY = e.clientY || e.touches[0].clientY;
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        const rotate = deltaX * 0.05;
        card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;

        // Show stamps
        if (deltaX > 0) {
            likeStamp.style.opacity = Math.min(deltaX / 100, 1);
            nopeStamp.style.opacity = 0;
        } else {
            nopeStamp.style.opacity = Math.min(Math.abs(deltaX) / 100, 1);
            likeStamp.style.opacity = 0;
        }
    };

    const onPointerUp = (e) => {
        if (!isDragging) return;
        isDragging = false;

        const currentX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const deltaX = currentX - startX;

        card.style.transition = 'transform 0.4s ease-out';

        if (Math.abs(deltaX) > 100) {
            // Swipe successful
            const direction = deltaX > 0 ? 1 : -1;
            
            if (direction === 1) {
                showMatchModal(card, direction);
            } else {
                card.style.transform = `translate(${direction * window.innerWidth}px, ${direction * 100}px) rotate(${direction * 30}deg)`;
                
                setTimeout(() => {
                    currentCardIndex++;
                    renderCards();
                }, 300);
            }
        } else {
            // Revert back
            card.style.transform = 'translate(0px, 0px) rotate(0deg)';
            likeStamp.style.opacity = 0;
            nopeStamp.style.opacity = 0;
        }
    };

    card.addEventListener('mousedown', onPointerDown);
    card.addEventListener('touchstart', onPointerDown);

    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('touchmove', onPointerMove);

    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchend', onPointerUp);
}

// Controls logic
document.getElementById('btn-no').addEventListener('click', () => {
    if (currentCardIndex >= filteredProfiles.length) return;
    const currentCard = cardStack.querySelector('.card');
    if(currentCard) {
        currentCard.querySelector('.stamp-nope').style.opacity = 1;
        currentCard.style.transition = 'transform 0.4s ease-out';
        currentCard.style.transform = `translate(-${window.innerWidth}px, 100px) rotate(-30deg)`;
        setTimeout(() => {
            currentCardIndex++;
            renderCards();
        }, 300);
    }
});

document.getElementById('btn-yes').addEventListener('click', () => {
    if (currentCardIndex >= filteredProfiles.length) return;
    const currentCard = cardStack.querySelector('.card');
    if(currentCard) {
        currentCard.querySelector('.stamp-like').style.opacity = 1;
        showMatchModal(currentCard, 1);
    }
});

document.getElementById('btn-star').addEventListener('click', () => {
    if (currentCardIndex >= filteredProfiles.length) return;
    const currentCard = cardStack.querySelector('.card');
    if(currentCard) {
        currentCard.style.transition = 'transform 0.4s ease-out';
        currentCard.style.transform = `translateY(-${window.innerHeight}px) rotate(0deg)`;
        setTimeout(() => {
            currentCardIndex++;
            renderCards();
        }, 300);
    }
});

// Initialize
renderCards();

// Modal logic
const matchModal = document.getElementById('match-modal');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');
const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalBio = document.getElementById('modal-bio');

let pendingCard = null;
let pendingDirection = null;

function showMatchModal(card, direction) {
    const profile = filteredProfiles[currentCardIndex];
    modalImg.src = profile.image;
    modalName.textContent = `${profile.name}, ${profile.age}`;
    modalBio.innerHTML = `<i class="fa-solid fa-quote-left"></i> ${profile.bio}`;
    
    pendingCard = card;
    pendingDirection = direction;
    matchModal.classList.add('active');
}

modalCancel.addEventListener('click', () => {
    matchModal.classList.remove('active');
    if (pendingCard) {
        pendingCard.style.transition = 'transform 0.4s ease-out';
        pendingCard.style.transform = 'translate(0px, 0px) rotate(0deg)';
        const likeStamp = pendingCard.querySelector('.stamp-like');
        if (likeStamp) likeStamp.style.opacity = 0;
    }
    pendingCard = null;
});

modalConfirm.addEventListener('click', () => {
    matchModal.classList.remove('active');
    if (pendingCard) {
        pendingCard.style.transition = 'transform 0.4s ease-out';
        pendingCard.style.transform = `translate(${pendingDirection * window.innerWidth}px, 100px) rotate(${pendingDirection * 30}deg)`;
        
        // Save match
        matchedProfiles.push(filteredProfiles[currentCardIndex]);
        updateChatView();

        setTimeout(() => {
            currentCardIndex++;
            renderCards();
            pendingCard = null;
        }, 300);
    }
});

// Profile Editing Logic
const myProfileBtn = document.getElementById('my-profile-btn');
const profileModal = document.getElementById('profile-modal');
const closeProfileModal = document.getElementById('close-profile-modal');
const profileImgUpload = document.getElementById('profile-img-upload');
const editProfileImg = document.getElementById('edit-profile-img');
const myProfileImg = document.getElementById('my-profile-img');
const saveProfileBtn = document.getElementById('save-profile-btn');
const profileBioInput = document.getElementById('profile-bio-input');

myProfileBtn.addEventListener('click', () => {
    profileModal.classList.add('active');
});

closeProfileModal.addEventListener('click', () => {
    profileModal.classList.remove('active');
});

profileImgUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            editProfileImg.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

saveProfileBtn.addEventListener('click', () => {
    myProfileImg.src = editProfileImg.src;
    localStorage.setItem('myBio', profileBioInput.value);
    localStorage.setItem('myImage', editProfileImg.src);
    profileModal.classList.remove('active');
});

// Load saved data on init
const savedBio = localStorage.getItem('myBio');
const savedImage = localStorage.getItem('myImage');
if (savedBio) profileBioInput.value = savedBio;
if (savedImage) {
    myProfileImg.src = savedImage;
    editProfileImg.src = savedImage;
}

// Chat View Logic
const chatIcon = document.querySelector('.chat-icon');
const chatView = document.getElementById('chat-view');
const closeChatBtn = document.getElementById('close-chat-btn');
const matchesContainer = document.getElementById('matches-container');
const messagesList = document.getElementById('messages-list');
const badge = document.querySelector('.badge');

chatIcon.addEventListener('click', () => {
    chatView.classList.add('active');
});

closeChatBtn.addEventListener('click', () => {
    chatView.classList.remove('active');
});

function updateChatView() {
    if (matchedProfiles.length === 0) return;
    
    // Update badge
    badge.textContent = matchedProfiles.length;
    
    // Render Matches Bubble
    matchesContainer.innerHTML = '';
    matchedProfiles.forEach(profile => {
        const bubble = document.createElement('div');
        bubble.className = 'match-bubble';
        bubble.innerHTML = `
            <img src="${profile.image}" alt="${profile.name}">
            <span>${profile.name}</span>
        `;
        matchesContainer.appendChild(bubble);
    });
    
    // Render Messages
    messagesList.innerHTML = '';
    matchedProfiles.forEach(profile => {
        const msg = document.createElement('div');
        msg.className = 'message-item';
        msg.innerHTML = `
            <img src="${profile.image}" alt="${profile.name}">
            <div class="message-info">
                <h5>${profile.name}</h5>
                <p>¡Hola! Acabamos de hacer match 🎉</p>
            </div>
        `;
        messagesList.appendChild(msg);
    });
}

// Initial badge state
badge.textContent = '0';

// Filter Logic
const filterModal = document.getElementById('filter-modal');
const navFilterBtn = document.getElementById('nav-filter-btn');
const closeFilterModal = document.getElementById('close-filter-modal');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const ageFilter = document.getElementById('age-filter');
const ageValue = document.getElementById('age-value');
const interestFilter = document.getElementById('interest-filter');

if(navFilterBtn) {
    navFilterBtn.addEventListener('click', () => {
        filterModal.classList.add('active');
    });
}

if(closeFilterModal) {
    closeFilterModal.addEventListener('click', () => {
        filterModal.classList.remove('active');
    });
}

if(ageFilter) {
    ageFilter.addEventListener('input', (e) => {
        ageValue.textContent = e.target.value;
    });
}

if(applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
        const maxAge = parseInt(ageFilter.value);
        const interestsText = interestFilter.value.toLowerCase().trim();
        const searchInterests = interestsText ? interestsText.split(',').map(i => i.trim()).filter(i => i) : [];

        filteredProfiles = profiles.filter(p => {
            // Age filter
            if (p.age > maxAge) return false;
            
            // Interests filter
            if (searchInterests.length > 0) {
                const hasCommonInterest = searchInterests.some(searchInt => {
                    const inInterests = p.interests && p.interests.some(i => i.toLowerCase().includes(searchInt));
                    const inBio = p.bio.toLowerCase().includes(searchInt);
                    return inInterests || inBio;
                });
                if (!hasCommonInterest) return false;
            }
            return true;
        });

        currentCardIndex = 0; // reset
        renderCards();
        filterModal.classList.remove('active');
    });
}
