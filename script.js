// Kitalált helyszínek adatbázis
const mockPlaces = [
    {
        name: "Családi Kávézó",
        type: "kávézó",
        rating: 4.5,
        address: "Váci utca 15, Budapest"
    },
    {
        name: "Játékos Játszóház",
        type: "játszóház",
        rating: 4.8,
        address: "Dohány utca 22, Budapest"
    },
    {
        name: "Barátságos Étterem",
        type: "étterem",
        rating: 4.3,
        address: "Andrássy út 45, Budapest"
    },
    {
        name: "Kis Herceg Kávézó",
        type: "kávézó",
        rating: 4.7,
        address: "Rózsa utca 8, Budapest"
    },
    {
        name: "Vidám Világ Játszóház",
        type: "játszóház",
        rating: 4.9,
        address: "Nagymező utca 33, Budapest"
    },
    {
        name: "Családos Bár",
        type: "étterem",
        rating: 4.4,
        address: "Széchenyi tér 12, Budapest"
    },
    {
        name: "Gyerekbarát Kávézó",
        type: "kávézó",
        rating: 4.6,
        address: "Bajcsy-Zsilinszky út 27, Budapest"
    },
    {
        name: "Színpadi Játszóház",
        type: "játszóház",
        rating: 4.8,
        address: "Vörösmarty tér 7, Budapest"
    },
    {
        name: "Cicamama Étterem",
        type: "étterem",
        rating: 4.5,
        address: "Múzeum körút 14, Budapest"
    },
    {
        name: "Csillag Kávézó",
        type: "kávézó",
        rating: 4.2,
        address: "Tűzoltó utca 19, Budapest"
    },
    {
        name: "FitFamily Konditerem",
        type: "konditerem",
        rating: 4.6,
        address: "Dózsa György út 48, Budapest"
    },
    {
        name: "Családos Sport Club",
        type: "konditerem",
        rating: 4.7,
        address: "Király utca 65, Budapest"
    },
    {
        name: "Kids Gym Konditerem",
        type: "konditerem",
        rating: 4.5,
        address: "Rákóczi út 21, Budapest"
    },
    {
        name: "Wellness Center",
        type: "konditerem",
        rating: 4.8,
        address: "Budaörsi út 15, Budapest"
    }
];

// Véletlenszerű helyszínek generálása
function getRandomPlaces(count = 4) {
    const shuffled = [...mockPlaces].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Helyszín kártya generálása
function createPlaceCard(place) {
    const card = document.createElement('div');
    card.className = 'place-card';
    
    const typeLabels = {
        'kávézó': '☕ Kávézó',
        'játszóház': '🎪 Játszóház',
        'étterem': '🍽️ Étterem',
        'konditerem': '💪 Konditerem'
    };
    
    card.innerHTML = `
        <h3>${place.name}</h3>
        <p><strong>Típus:</strong> ${typeLabels[place.type] || place.type}</p>
        <p><strong>Cím:</strong> ${place.address}</p>
        <p class="rating">Értékelés: ${place.rating}</p>
    `;
    
    return card;
}

// Helyszínek megjelenítése
function displayPlaces(places) {
    const container = document.getElementById('placesContainer');
    container.innerHTML = '';
    
    if (places.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">Nincs találat</p>';
        return;
    }
    
    places.forEach(place => {
        const card = createPlaceCard(place);
        container.appendChild(card);
    });
}

// Keresőmező eseménykezelő
const searchInput = document.getElementById('searchInput');
let searchTimeout;

searchInput.addEventListener('input', function(e) {
    const searchValue = e.target.value.trim().toLowerCase();
    
    // Debounce - várunk 300ms-et mielőtt keresünk
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
        if (searchValue.length > 0) {
            // Szűrés a keresési érték alapján
            const filtered = mockPlaces.filter(place => 
                place.name.toLowerCase().includes(searchValue) ||
                place.address.toLowerCase().includes(searchValue) ||
                place.type.toLowerCase().includes(searchValue)
            );
            
            // Ha van találat, azokat mutatjuk, különben 4 véletlenszerűt
            if (filtered.length > 0) {
                displayPlaces(filtered.slice(0, 4));
            } else {
                displayPlaces(getRandomPlaces(4));
            }
        } else {
            // Ha üres a keresőmező, mutatunk 4 véletlenszerű helyszínt
            displayPlaces(getRandomPlaces(4));
        }
    }, 300);
});

// Oldal betöltésekor mutatunk 4 véletlenszerű helyszínt
document.addEventListener('DOMContentLoaded', () => {
    displayPlaces(getRandomPlaces(4));
    
    // Login Modal kezelés
    const loginModal = document.getElementById('loginModal');
    const loginTrigger = document.getElementById('loginTrigger');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    
    // Modal megnyitása
    if (loginTrigger) {
        loginTrigger.addEventListener('click', () => {
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Scroll letiltás háttérben
        });
    }
    
    // Modal bezárása X gombbal
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            loginModal.classList.remove('active');
            document.body.style.overflow = ''; // Scroll visszaállítás
        });
    }
    
    // Modal bezárása háttérre kattintva
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Modal bezárása Escape billentyűvel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal.classList.contains('active')) {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Login form submit kezelés
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Itt lehetne backend API hívás
            console.log('Bejelentkezés:', { email, password });
            
            // Szimulált bejelentkezés - modal bezárása
            // Valós implementációnál itt ellenőrizni kellene a hitelesítést
            alert('Bejelentkezési kérés elküldve! (Ez csak egy demo)');
            
            // Modal bezárása
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Opcionálisan: frissítsd a felhasználói interfészt
            // updateUserProfile(email);
        });
    }
});

