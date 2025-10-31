// Kitalált helyszínek adatbázis
const mockPlaces = [
    {
        name: "Családi Kávézó",
        type: "kávézó",
        rating: 4.5,
        address: "Váci utca 15, Budapest",
        phone: "+36 1 234 5678",
        hours: "H-P: 8:00-20:00, Szo-V: 9:00-18:00",
        description: "Egy barátságos kávézó, ahol a gyerekek is szívesen időznek. Van játszó sarok, és a családosok számára kényelmes bútorzat.",
        amenities: ["Játszó sarok", "Gyerekbarát étlap", "Pelenkázó", "Parkolás"]
    },
    {
        name: "Játékos Játszóház",
        type: "játszóház",
        rating: 4.8,
        address: "Dohány utca 22, Budapest",
        phone: "+36 1 234 5679",
        hours: "H-V: 10:00-19:00",
        description: "Korszerű játszóház családok számára, több szintes játékterekkel, labirintussal és interaktív játékokkal.",
        amenities: ["Labirintus", "Játszóterek", "Biztonságos környezet", "Kávézó a szülőknek"]
    },
    {
        name: "Barátságos Étterem",
        type: "étterem",
        rating: 4.3,
        address: "Andrássy út 45, Budapest",
        phone: "+36 1 234 5680",
        hours: "H-V: 12:00-22:00",
        description: "Családbarát étterem finom ételekkel, ahol a gyerekeknek is készülnek külön étlapok. Kényelmes családi asztalok és gyors szolgáltatás.",
        amenities: ["Gyerekmenü", "Magas szék", "Gyors szolgáltatás", "Terasz"]
    },
    {
        name: "Kis Herceg Kávézó",
        type: "kávézó",
        rating: 4.7,
        address: "Rózsa utca 8, Budapest",
        phone: "+36 1 234 5681",
        hours: "H-P: 7:00-19:00, Szo-V: 8:00-17:00",
        description: "Hangulatos kávézó könyvklub hangulattal. Van nappali rész a babáknak és játszó sarok a nagyobb gyerekeknek.",
        amenities: ["Könyvklub", "Nappali", "Játszó sarok", "Ingyenes WiFi"]
    },
    {
        name: "Vidám Világ Játszóház",
        type: "játszóház",
        rating: 4.9,
        address: "Nagymező utca 33, Budapest",
        phone: "+36 1 234 5682",
        hours: "H-V: 9:00-20:00",
        description: "Nagy játszóház témás játékterekkel, szerepjátékokkal és képzettséges szakemberekkel, akik folyamatosan felügyelik a gyerekeket.",
        amenities: ["Témás játékterek", "Szerepjátékok", "Felügyelt programok", "Biztonsági kamerák"]
    },
    {
        name: "Családos Bár",
        type: "étterem",
        rating: 4.4,
        address: "Széchenyi tér 12, Budapest",
        phone: "+36 1 234 5683",
        hours: "H-V: 11:00-23:00",
        description: "Modern bár étterem keverék, ahol a szülők is jól érzik magukat, miközben a gyerekek játszanak. Vannak családi asztalok és szórakoztató programok.",
        amenities: ["Családi asztalok", "Gyerekbarát menü", "Szórakoztató programok", "Legyenek órák"]
    },
    {
        name: "Gyerekbarát Kávézó",
        type: "kávézó",
        rating: 4.6,
        address: "Bajcsy-Zsilinszky út 27, Budapest",
        phone: "+36 1 234 5684",
        hours: "H-V: 8:00-18:00",
        description: "Kisebb, hangulatos kávézó, ahol minden részlet a családokra van szabva. Játszó sarok, magas székek és egészséges snackek.",
        amenities: ["Játszó sarok", "Magas székek", "Egészséges snackek", "Kert"]
    },
    {
        name: "Színpadi Játszóház",
        type: "játszóház",
        rating: 4.8,
        address: "Vörösmarty tér 7, Budapest",
        phone: "+36 1 234 5685",
        hours: "H-V: 10:00-19:00",
        description: "Kreatív játszóház színpadként kialakított területekkel, ahol a gyerekek előadásokat tartanak és szerepeket játszanak.",
        amenities: ["Színpadi terület", "Kostümök", "Kreatív programok", "Felvétel lehetőség"]
    },
    {
        name: "Cicamama Étterem",
        type: "étterem",
        rating: 4.5,
        address: "Múzeum körút 14, Budapest",
        phone: "+36 1 234 5686",
        hours: "H-V: 11:00-21:00",
        description: "Tradicionális magyar és nemzetközi ételek családbarát környezetben. Nagy adagok, gyors szolgáltatás és színes gyerekmenü.",
        amenities: ["Magyar ételek", "Gyerekmenü", "Nagy adagok", "Családi atmoszféra"]
    },
    {
        name: "Csillag Kávézó",
        type: "kávézó",
        rating: 4.2,
        address: "Tűzoltó utca 19, Budapest",
        phone: "+36 1 234 5687",
        hours: "H-P: 7:30-18:00, Szo-V: 9:00-16:00",
        description: "Egyszerű, barátságos kávézó reggeliként és délutáni kávézásra. Kisebb játszó sarok a gyerekeknek.",
        amenities: ["Reggeli", "Kis játszó sarok", "Kávé specialitások", "Sütemények"]
    },
    {
        name: "FitFamily Konditerem",
        type: "konditerem",
        rating: 4.6,
        address: "Dózsa György út 48, Budapest",
        phone: "+36 1 234 5688",
        hours: "H-P: 6:00-22:00, Szo-V: 8:00-20:00",
        description: "Családbarát konditerem, ahol a szülők edzhetnek, miközben a gyerekek felügyelt gyerekteremben játszhatnak.",
        amenities: ["Gyerekterem", "Családi bérlet", "Csoportos edzések", "Babakocsibarát"]
    },
    {
        name: "Családos Sport Club",
        type: "konditerem",
        rating: 4.7,
        address: "Király utca 65, Budapest",
        phone: "+36 1 234 5689",
        hours: "H-P: 6:00-23:00, Szo-V: 8:00-21:00",
        description: "Prémium sportklub családok számára. Versenyszintű gépek, uszoda és felügyelt gyerekprogramok.",
        amenities: ["Uszoda", "Versenygépek", "Felügyelt gyerekprogramok", "Wellness részleg"]
    },
    {
        name: "Kids Gym Konditerem",
        type: "konditerem",
        rating: 4.5,
        address: "Rákóczi út 21, Budapest",
        phone: "+36 1 234 5690",
        hours: "H-V: 7:00-21:00",
        description: "Kifejezetten gyerekekre szabott mozgásprogramokkal rendelkező konditerem. Van felnőtt rész is a szülőknek.",
        amenities: ["Gyerek mozgásprogramok", "Felnőtt részleg", "Torna termek", "Úszás"]
    },
    {
        name: "Wellness Center",
        type: "konditerem",
        rating: 4.8,
        address: "Budaörsi út 15, Budapest",
        phone: "+36 1 234 5691",
        hours: "H-P: 6:00-22:00, Szo-V: 8:00-20:00",
        description: "Komplex wellness központ konditeremmel, szaunával, masszázszal és felügyelt gyerekteremmel.",
        amenities: ["Wellness", "Szauna", "Masszázs", "Gyerekfelügyelet"]
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
    card.setAttribute('data-place-id', mockPlaces.indexOf(place));
    
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
    
    // Kattintás esemény hozzáadása
    card.addEventListener('click', () => {
        showPlaceDetail(place);
    });
    
    return card;
}

// Helyszín részletes nézet megjelenítése
function showPlaceDetail(place) {
    const modal = document.getElementById('placeDetailModal');
    const header = document.getElementById('placeDetailHeader');
    const body = document.getElementById('placeDetailBody');
    
    const typeLabels = {
        'kávézó': '☕ Kávézó',
        'játszóház': '🎪 Játszóház',
        'étterem': '🍽️ Étterem',
        'konditerem': '💪 Konditerem'
    };
    
    header.innerHTML = `
        <div class="place-detail-title">
            <h2>${place.name}</h2>
            <span class="place-detail-type">${typeLabels[place.type] || place.type}</span>
        </div>
        <div class="place-detail-rating">
            <span class="rating-big">${place.rating}</span>
            <span class="rating-stars">${'⭐'.repeat(Math.round(place.rating))}</span>
        </div>
    `;
    
    body.innerHTML = `
        <div class="place-detail-section">
            <h3>📍 Cím</h3>
            <p>${place.address}</p>
            <a href="https://maps.google.com/?q=${encodeURIComponent(place.address)}" target="_blank" class="map-link">
                Megnyitás térképen
            </a>
        </div>
        
        ${place.phone ? `
        <div class="place-detail-section">
            <h3>📞 Telefon</h3>
            <p><a href="tel:${place.phone.replace(/\s/g, '')}">${place.phone}</a></p>
        </div>
        ` : ''}
        
        ${place.hours ? `
        <div class="place-detail-section">
            <h3>🕐 Nyitvatartás</h3>
            <p>${place.hours}</p>
        </div>
        ` : ''}
        
        ${place.description ? `
        <div class="place-detail-section">
            <h3>📝 Leírás</h3>
            <p>${place.description}</p>
        </div>
        ` : ''}
        
        ${place.amenities && place.amenities.length > 0 ? `
        <div class="place-detail-section">
            <h3>✨ Szolgáltatások</h3>
            <ul class="amenities-list">
                ${place.amenities.map(amenity => `<li>${amenity}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
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
    
    // Place Detail Modal kezelés
    const placeDetailModal = document.getElementById('placeDetailModal');
    const closePlaceDetail = document.getElementById('closePlaceDetail');
    
    // Modal bezárása X gombbal
    if (closePlaceDetail) {
        closePlaceDetail.addEventListener('click', () => {
            placeDetailModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Modal bezárása háttérre kattintva
    placeDetailModal.addEventListener('click', (e) => {
        if (e.target === placeDetailModal) {
            placeDetailModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Modal bezárása Escape billentyűvel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && placeDetailModal.classList.contains('active')) {
            placeDetailModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

