// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const icon = type === 'success' ? 
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
        type === 'error' ?
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>' :
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    
    toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in-right`;
    toast.innerHTML = `
        <div class="flex-shrink-0">${icon}</div>
        <div class="flex-1 font-medium">${message}</div>
        <button class="flex-shrink-0 hover:opacity-75 transition-opacity" onclick="this.parentElement.remove()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Mentett helyek kezelése (localStorage)
function getSavedPlaces() {
    const saved = localStorage.getItem('savedPlaces');
    return saved ? JSON.parse(saved) : [];
}

function savePlace(place) {
    const saved = getSavedPlaces();
    const exists = saved.some(p => p.name === place.name && p.address === place.address);
    if (!exists) {
        saved.push(place);
        localStorage.setItem('savedPlaces', JSON.stringify(saved));
        return true;
    }
    return false;
}

function removePlace(placeName, placeAddress) {
    const saved = getSavedPlaces();
    const filtered = saved.filter(p => !(p.name === placeName && p.address === placeAddress));
    localStorage.setItem('savedPlaces', JSON.stringify(filtered));
}

function isPlaceSaved(placeName, placeAddress) {
    const saved = getSavedPlaces();
    return saved.some(p => p.name === placeName && p.address === placeAddress);
}

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
    },
    {
        name: "Családi Panzió",
        type: "szállás",
        rating: 4.6,
        address: "Kossuth Lajos utca 32, Budapest",
        phone: "+36 1 234 5692",
        hours: "Check-in: 14:00, Check-out: 11:00",
        description: "Barátságos panzió családok számára. Családi szobák, játszóterem és reggeliző. Központi elhelyezés.",
        amenities: ["Családi szobák", "Játszóterem", "Reggeliző", "Ingyenes WiFi"]
    },
    {
        name: "Kids Hotel",
        type: "szállás",
        rating: 4.9,
        address: "Hegyalja út 45, Budapest",
        phone: "+36 1 234 5693",
        hours: "Check-in: 15:00, Check-out: 12:00",
        description: "Prémium gyerekbarát szálloda külön játszószobákkal, gyerekfelügyelettel és családi programokkal.",
        amenities: ["Gyerekfelügyelet", "Játszószobák", "Családi programok", "Wellness"]
    },
    {
        name: "Baba Barát Szálloda",
        type: "szállás",
        rating: 4.7,
        address: "Ferenciek tere 8, Budapest",
        phone: "+36 1 234 5694",
        hours: "Check-in: 14:00, Check-out: 11:00",
        description: "Kifejezetten babákkal utazó családoknak tervezett szálloda. Bababútorzat, pelenkázó és babakocsibarát infrastruktúra.",
        amenities: ["Bababútorzat", "Pelenkázó", "Babakocsibarát", "Babakocsi bérlés"]
    },
    {
        name: "Vidám Vendégház",
        type: "szállás",
        rating: 4.5,
        address: "Ó utca 22, Budapest",
        phone: "+36 1 234 5695",
        hours: "Check-in: 15:00, Check-out: 10:00",
        description: "Hangulatos vendégház kerttel, játszóudvarral. Tökéletes hosszabb tartózkodásra családokkal.",
        amenities: ["Kert", "Játszóudvar", "Teljes konyha", "Parkolás"]
    },
    {
        name: "Napfényes Kávézó",
        type: "kávézó",
        rating: 4.4,
        address: "Madách Imre út 12, Budapest",
        phone: "+36 1 234 5696",
        hours: "H-V: 8:00-19:00",
        description: "Világos, napos kávézó nagy ablakokkal és terasszal. Van belső játszó sarok és babakocsibarát bejárat.",
        amenities: ["Terasz", "Játszó sarok", "Babakocsibarát", "Nagy ablakok"]
    },
    {
        name: "Falatozó Étterem",
        type: "étterem",
        rating: 4.3,
        address: "Erzsébet körút 35, Budapest",
        phone: "+36 1 234 5697",
        hours: "H-V: 11:00-21:30",
        description: "Középkategóriás étterem családi atmoszférával. Gyors szolgáltatás, nagy adagok és gyerekbarát árak.",
        amenities: ["Gyors szolgáltatás", "Nagy adagok", "Gyerekbarát árak", "Parkolás"]
    },
    {
        name: "Mozgás Csarnok",
        type: "konditerem",
        rating: 4.6,
        address: "Fő utca 58, Budapest",
        phone: "+36 1 234 5698",
        hours: "H-P: 5:00-23:00, Szo-V: 6:00-22:00",
        description: "Modern konditerem családok számára. Óriási terület, sok gép és külön gyerekterem felügyelet mellett.",
        amenities: ["Nagy terület", "Sok gép", "Gyerekterem", "24/7 elérés"]
    },
    {
        name: "Családi Szálloda",
        type: "szállás",
        rating: 4.8,
        address: "Margit körút 25, Budapest",
        phone: "+36 1 234 5699",
        hours: "Check-in: 14:00, Check-out: 11:00",
        description: "4 csillagos szálloda kifejezetten családok számára. Uszoda, játszószoba és gyerekfelügyelet.",
        amenities: ["Uszoda", "Játszószoba", "Gyerekfelügyelet", "Reggeli"]
    },
    {
        name: "Környezetbarát Kávézó",
        type: "kávézó",
        rating: 4.5,
        address: "Bartók Béla út 67, Budapest",
        phone: "+36 1 234 5700",
        hours: "H-V: 7:00-18:00",
        description: "Bio kávézó egészséges snackekkel és környezetbarát megközelítéssel. Játszó sarok organikus játékokkal.",
        amenities: ["Bio kávé", "Egészséges snackek", "Játszó sarok", "Környezetbarát"]
    },
    {
        name: "Gourmet Családi Étterem",
        type: "étterem",
        rating: 4.7,
        address: "Ráday utca 8, Budapest",
        phone: "+36 1 234 5701",
        hours: "H-V: 12:00-22:00",
        description: "Minőségi ételek családi hangulattal. Profi szakácsok, friss alapanyagok és kreatív gyerekmenü.",
        amenities: ["Minőségi ételek", "Kreatív menü", "Friss alapanyagok", "Terasz"]
    },
    {
        name: "Extrém Sport Klub",
        type: "konditerem",
        rating: 4.4,
        address: "Thököly út 78, Budapest",
        phone: "+36 1 234 5702",
        hours: "H-V: 6:00-22:00",
        description: "Szakértő edzőkkel és speciális gyerekprogramokkal. Rock climbing fal, úszás és csoportos edzések.",
        amenities: ["Rock climbing", "Úszás", "Csoportos edzések", "Szakértő edzők"]
    },
    {
        name: "Pesti Panzió",
        type: "szállás",
        rating: 4.6,
        address: "Arany János utca 32, Budapest",
        phone: "+36 1 234 5703",
        hours: "Check-in: 14:00, Check-out: 11:00",
        description: "Hangulatos panzió jó ár-érték aránnyal. Családi szobák, központi elhelyezés és barátságos személyzet.",
        amenities: ["Jó ár-érték", "Központi", "Barátságos", "CSaládi szobák"]
    },
    {
        name: "Cukrászda & Kávézó",
        type: "kávézó",
        rating: 4.8,
        address: "Váci utca 89, Budapest",
        phone: "+36 1 234 5704",
        hours: "H-V: 8:00-20:00",
        description: "Házi készítésű sütemények és prémium kávék. Játszó sarok a gyerekeknek és kellemes környezet a szülőknek.",
        amenities: ["Házi sütemények", "Prémium kávé", "Játszó sarok", "Kellemes környezet"]
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
    card.className = 'place-card bg-[#FFFBF7] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#E8DDD0] overflow-hidden group hover:-translate-y-1';
    card.setAttribute('data-place-id', mockPlaces.indexOf(place));
    
    const typeLabels = {
        'kávézó': '☕ Kávézó',
        'játszóház': '🎪 Játszóház',
        'étterem': '🍽️ Étterem',
        'konditerem': '💪 Konditerem',
        'szállás': '🏨 Szállás'
    };
    
    const typeColors = {
        'kávézó': 'bg-amber-100 text-amber-800',
        'játszóház': 'bg-purple-100 text-purple-800',
        'étterem': 'bg-orange-100 text-orange-800',
        'konditerem': 'bg-blue-100 text-blue-800',
        'szállás': 'bg-green-100 text-green-800'
    };
    
    // Generate star rating
    const fullStars = Math.floor(place.rating);
    const hasHalfStar = place.rating % 1 >= 0.5;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="text-yellow-400 text-lg">⭐</span>';
    }
    if (hasHalfStar && fullStars < 5) {
        starsHTML += '<span class="text-yellow-400 text-lg">⭐</span>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        starsHTML += '<span class="text-gray-300 text-lg">⭐</span>';
    }
    
    card.innerHTML = `
        <div class="p-6">
            <div class="mb-3">
                <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${typeColors[place.type] || 'bg-gray-100 text-gray-800'} whitespace-nowrap mb-2">
                    ${typeLabels[place.type] || place.type}
                </span>
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300 line-clamp-2">
                    ${place.name}
                </h3>
            </div>
            
            <div class="flex items-center gap-2 mb-4">
                <div class="flex items-center gap-1">
                    ${starsHTML}
                </div>
                <span class="text-lg font-semibold text-gray-900">${place.rating}</span>
            </div>
            
            <div class="space-y-2">
                <div class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <p class="text-sm text-gray-600 line-clamp-2">${place.address}</p>
                </div>
                
                ${place.amenities && place.amenities.length > 0 ? `
                <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#E8DDD0]">
                    ${place.amenities.slice(0, 3).map(amenity => `
                        <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#FFF9F3] text-gray-700 border border-[#E8DDD0]">
                            ${amenity}
                        </span>
                    `).join('')}
                    ${place.amenities.length > 3 ? `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-gray-500">
                        +${place.amenities.length - 3} több
                    </span>` : ''}
                </div>
                ` : ''}
            </div>
            
            <div class="mt-4 pt-4 border-t border-[#E8DDD0]">
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">Részletek megtekintése</span>
                    <svg class="w-5 h-5 text-teal-500 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </div>
        </div>
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
        'konditerem': '💪 Konditerem',
        'szállás': '🏨 Szállás'
    };
    
    const typeColors = {
        'kávézó': 'bg-amber-100 text-amber-800 border-amber-200',
        'játszóház': 'bg-purple-100 text-purple-800 border-purple-200',
        'étterem': 'bg-orange-100 text-orange-800 border-orange-200',
        'konditerem': 'bg-blue-100 text-blue-800 border-blue-200',
        'szállás': 'bg-green-100 text-green-800 border-green-200'
    };
    
    // Generate star rating
    const fullStars = Math.floor(place.rating);
    const hasHalfStar = place.rating % 1 >= 0.5;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="text-yellow-400 text-2xl">⭐</span>';
    }
    if (hasHalfStar && fullStars < 5) {
        starsHTML += '<span class="text-yellow-400 text-2xl">⭐</span>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        starsHTML += '<span class="text-gray-300 text-2xl">⭐</span>';
    }
    
    header.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div class="flex-1">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">${place.name}</h2>
                <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${typeColors[place.type] || 'bg-gray-100 text-gray-800 border-gray-200'}">
                    ${typeLabels[place.type] || place.type}
                </span>
            </div>
            <div class="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-5 py-4 shadow-sm">
                <span class="text-4xl font-bold text-orange-500">${place.rating}</span>
                <div class="flex items-center gap-1">
                    ${starsHTML}
                </div>
            </div>
        </div>
    `;
    
    body.innerHTML = `
        <!-- Address Section -->
        <div class="mb-8 pb-8 border-b border-[#E8DDD0]">
            <div class="flex items-start gap-3 mb-4">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">📍 Cím</h3>
                    <p class="text-gray-700 mb-4">${place.address}</p>
                    <a 
                        href="https://maps.google.com/?q=${encodeURIComponent(place.address)}" 
                        target="_blank" 
                        class="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                        </svg>
                        Megnyitás térképen
                    </a>
                </div>
            </div>
        </div>
        
        ${place.phone ? `
        <div class="mb-8 pb-8 border-b border-[#E8DDD0]">
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">📞 Telefon</h3>
                    <a href="tel:${place.phone.replace(/\s/g, '')}" class="text-teal-600 hover:text-teal-700 font-medium text-lg transition-colors">
                        ${place.phone}
                    </a>
                </div>
            </div>
        </div>
        ` : ''}
        
        ${place.hours ? `
        <div class="mb-8 pb-8 border-b border-[#E8DDD0]">
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">🕐 Nyitvatartás</h3>
                    <p class="text-gray-700">${place.hours}</p>
                </div>
            </div>
        </div>
        ` : ''}
        
        ${place.description ? `
        <div class="mb-8 pb-8 border-b border-[#E8DDD0]">
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">📝 Leírás</h3>
                    <p class="text-gray-700 leading-relaxed">${place.description}</p>
                </div>
            </div>
        </div>
        ` : ''}
        
        ${place.amenities && place.amenities.length > 0 ? `
        <div class="mb-8 pb-8 border-b border-[#E8DDD0]">
            <div class="flex items-start gap-3 mb-4">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">✨ Szolgáltatások</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        ${place.amenities.map(amenity => `
                            <div class="flex items-center gap-2 px-4 py-3 bg-[#FFF9F3] border border-[#E8DDD0] rounded-lg hover:border-teal-300 hover:bg-teal-50/50 transition-all duration-200">
                                <span class="text-teal-500">✓</span>
                                <span class="text-gray-700 text-sm font-medium">${amenity}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        ` : ''}
        
        <!-- Action Button -->
        <div class="pt-6">
            ${isPlaceSaved(place.name, place.address) ? `
                <button 
                    onclick="removeFromList('${place.name}', '${place.address}')"
                    class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Törlés a listából
                </button>
            ` : `
                <button 
                    onclick="addToList('${place.name}', '${place.address}', '${place.type}', ${place.rating})"
                    class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Listához adás
                </button>
            `}
        </div>
    `;
    
    // Show modal with animation
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    
    // Initialize animation state
    const content = document.getElementById('placeDetailContent');
    const backdrop = document.getElementById('placeDetailBackdrop');
    if (content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
    }
    if (backdrop) {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
    }
    
    // Trigger animation
    setTimeout(() => {
        if (content) {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }
        if (backdrop) {
            backdrop.classList.remove('opacity-0');
            backdrop.classList.add('opacity-100');
        }
    }, 10);
}

// Listához adás funkció
window.addToList = function(name, address, type, rating) {
    const place = {
        name: name,
        address: address,
        type: type,
        rating: rating
    };
    
    if (savePlace(place)) {
        showToast('Hely hozzáadva a listához!', 'success');
        const savedPlace = mockPlaces.find(p => p.name === name && p.address === address) || place;
        showPlaceDetail(savedPlace);
        
        // Ha a mentett helyek nézetben vagyunk, frissítsük a listát
        if (isShowingSavedPlaces) {
            const saved = getSavedPlaces();
            const placesToDisplay = saved.map(savedPlace => {
                return mockPlaces.find(p => p.name === savedPlace.name && p.address === savedPlace.address) || savedPlace;
            });
            displayPlaces(placesToDisplay, true);
        }
    } else {
        alert('Ez a hely már a listában van!');
    }
};

// Listából törlés funkció
window.removeFromList = function(name, address) {
    if (confirm('Biztosan törölni szeretnéd ezt a helyet a listából?')) {
        removePlace(name, address);
        alert('Hely törölve a listából!');
        const place = mockPlaces.find(p => p.name === name && p.address === address);
        if (place) {
            showPlaceDetail(place);
        }
        // Ha a mentett helyek nézetben vagyunk, frissítsük a listát
        if (isShowingSavedPlaces) {
            const saved = getSavedPlaces();
            if (saved.length === 0) {
                displayPlaces([], true);
            } else {
                const placesToDisplay = saved.map(savedPlace => {
                    return mockPlaces.find(p => p.name === savedPlace.name && p.address === savedPlace.address) || savedPlace;
                });
                displayPlaces(placesToDisplay, true);
            }
        }
    }
};

// Helyszínek megjelenítése paginációval
function displayPlaces(places, resetPage = false) {
    const container = document.getElementById('placesContainer');
    
    if (resetPage) {
        currentPage = 1;
    }
    
    if (places.length === 0) {
        container.innerHTML = '';
        if (isShowingSavedPlaces) {
            container.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-16 px-4">
                    <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Még nincsenek mentett helyek</h3>
                    <p class="text-gray-600 text-center max-w-md">Helyszínek részleteit megnyitva a "Listához adás" gombbal hozzáadhatsz helyeket a kedvenceidhez.</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-16 px-4">
                    <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Nincs találat</h3>
                    <p class="text-gray-600 text-center max-w-md">Próbáld meg más keresési feltételekkel vagy szűrőkkel.</p>
                </div>
            `;
        }
        // Pagináció elrejtése
        const pagination = document.getElementById('pagination');
        if (pagination) {
            pagination.style.display = 'none';
        }
        return;
    }
    
    // Pagináció számítása
    const totalPages = Math.ceil(places.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPlaces = places.slice(startIndex, endIndex);
    
    // Kártyák megjelenítése animációval
    container.innerHTML = '';
    paginatedPlaces.forEach((place, index) => {
        const card = createPlaceCard(place);
        // Fade-in animáció hozzáadása
        card.classList.add('opacity-0', 'animate-fade-in');
        card.style.animationDelay = `${index * 50}ms`;
        container.appendChild(card);
    });
    
    // Pagináció UI generálása
    renderPagination(totalPages, places.length);
}

// Keresőmező eseménykezelő
const searchInput = document.getElementById('searchInput');
let searchTimeout;
let isShowingSavedPlaces = false;

// Aktív filter kezelése
let activeFilter = 'all';

// Pagináció változók
let currentPage = 1;
const itemsPerPage = 12;

// Filter tabok kezelése
function initializeFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Összes tab active osztály és Tailwind stílusok eltávolítása
            filterTabs.forEach(t => {
                t.classList.remove('active');
                // Tailwind active stílusok eltávolítása
                t.classList.remove('bg-white', 'text-teal-600', 'shadow-sm');
                if (!t.classList.contains('text-gray-600')) {
                    t.classList.add('text-gray-600');
                }
            });
            
            // Aktuális tab active osztály és Tailwind stílusok hozzáadása
            tab.classList.add('active');
            tab.classList.remove('text-gray-600');
            tab.classList.add('bg-white', 'text-teal-600', 'shadow-sm');
            
            // Aktív filter frissítése
            activeFilter = tab.dataset.filter;
            
            // Helyek szűrése és megjelenítése
            filterAndDisplayPlaces();
        });
    });
}

// Helyek szűrése és megjelenítése
function filterAndDisplayPlaces() {
    // Ha mentett helyeket mutatunk, ne szűrjünk
    if (isShowingSavedPlaces) {
        return;
    }
    
    const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    let filteredPlaces;
    
    // Ha van aktív filter és nem "all"
    if (activeFilter && activeFilter !== 'all') {
        filteredPlaces = mockPlaces.filter(place => place.type === activeFilter);
    } else {
        filteredPlaces = [...mockPlaces];
    }
    
    // Keresőmező szerinti szűrés
    if (searchValue) {
        filteredPlaces = filteredPlaces.filter(place => 
            place.name.toLowerCase().includes(searchValue) ||
            place.address.toLowerCase().includes(searchValue) ||
            place.type.toLowerCase().includes(searchValue)
        );
    }
    
    // Ha van találat, azokat mutatjuk, különben véletlenszerűt
    if (filteredPlaces.length > 0) {
        displayPlaces(filteredPlaces, true);
    } else {
        displayPlaces(getRandomPlaces(12), true);
    }
}

// Pagináció UI generálása
function renderPagination(totalPages, totalItems) {
    let pagination = document.getElementById('pagination');
    
    if (!pagination) {
        pagination = document.createElement('div');
        pagination.id = 'pagination';
        pagination.className = 'flex flex-col md:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t border-gray-200';
        const main = document.querySelector('.main');
        if (main) {
            main.appendChild(pagination);
        }
    }
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    pagination.innerHTML = `
        <div class="text-sm text-gray-600">
            <span>${startItem}-${endItem} / ${totalItems} találat</span>
        </div>
        <div class="flex items-center gap-2 flex-wrap justify-center">
            <button 
                class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700" 
                id="prevPage" 
                ${currentPage === 1 ? 'disabled' : ''}>
                ← Előző
            </button>
            <div class="flex items-center gap-1">
                ${generatePaginationNumbers(totalPages)}
            </div>
            <button 
                class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700" 
                id="nextPage" 
                ${currentPage === totalPages ? 'disabled' : ''}>
                Következő →
            </button>
        </div>
    `;
    
    // Event listeners
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                filterAndDisplayPlaces();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : '';
            let filteredPlaces;
            
            if (activeFilter && activeFilter !== 'all') {
                filteredPlaces = mockPlaces.filter(place => place.type === activeFilter);
            } else {
                filteredPlaces = [...mockPlaces];
            }
            
            if (searchValue) {
                filteredPlaces = filteredPlaces.filter(place => 
                    place.name.toLowerCase().includes(searchValue) ||
                    place.address.toLowerCase().includes(searchValue) ||
                    place.type.toLowerCase().includes(searchValue)
                );
            }
            
            const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                filterAndDisplayPlaces();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
    // Oldalszámok kattintása
    const pageNumbers = pagination.querySelectorAll('.page-number');
    pageNumbers.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (page !== currentPage) {
                currentPage = page;
                filterAndDisplayPlaces();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// Oldalszámok generálása
function generatePaginationNumbers(totalPages) {
    const maxVisible = 5;
    let startPage, endPage;
    
    if (totalPages <= maxVisible) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 3) {
            startPage = 1;
            endPage = maxVisible;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - maxVisible + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }
    
    let html = '';
    
    if (startPage > 1) {
        html += `<button class="min-w-[36px] h-9 px-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 transition-all duration-200" data-page="1">1</button>`;
        if (startPage > 2) {
            html += `<span class="px-2 text-gray-400 text-sm">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            html += `<button class="min-w-[36px] h-9 px-3 bg-teal-500 border border-teal-500 rounded-lg text-sm font-semibold text-white shadow-sm" data-page="${i}">${i}</button>`;
        } else {
            html += `<button class="min-w-[36px] h-9 px-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 transition-all duration-200" data-page="${i}">${i}</button>`;
        }
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span class="px-2 text-gray-400 text-sm">...</span>`;
        }
        html += `<button class="min-w-[36px] h-9 px-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 transition-all duration-200" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    return html;
}

// Oldal betöltésekor mutatunk helyszíneket
document.addEventListener('DOMContentLoaded', () => {
    displayPlaces(mockPlaces, true);
    
    // Filter tabok inicializálása
    initializeFilterTabs();
    
    // Keresőmező eseménykezelő - debounce
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterAndDisplayPlaces();
            }, 300); // 300ms debounce
        });
    }
    
    // Login Modal kezelés
    const loginModal = document.getElementById('loginModal');
    const loginTrigger = document.getElementById('loginTrigger');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    const loginModalBackdrop = document.getElementById('loginModalBackdrop');
    
    function openLoginModal() {
        loginModal.classList.remove('hidden');
        loginModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // Initialize animation state
        const content = document.getElementById('loginModalContent');
        if (content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
        }
        if (loginModalBackdrop) {
            loginModalBackdrop.classList.remove('opacity-100');
            loginModalBackdrop.classList.add('opacity-0');
        }
        
        // Trigger animation
        setTimeout(() => {
            if (content) {
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }
            if (loginModalBackdrop) {
                loginModalBackdrop.classList.remove('opacity-0');
                loginModalBackdrop.classList.add('opacity-100');
            }
        }, 10);
    }
    
    function closeLoginModalFunc() {
        const content = document.getElementById('loginModalContent');
        if (content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
        }
        if (loginModalBackdrop) {
            loginModalBackdrop.classList.remove('opacity-100');
            loginModalBackdrop.classList.add('opacity-0');
        }
        
        setTimeout(() => {
            loginModal.classList.add('hidden');
            loginModal.classList.remove('flex');
            document.body.style.overflow = '';
        }, 200);
    }
    
    // Modal megnyitása
    if (loginTrigger) {
        loginTrigger.addEventListener('click', openLoginModal);
    }
    
    // Modal bezárása X gombbal
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', closeLoginModalFunc);
    }
    
    // Modal bezárása háttérre kattintva
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal || e.target === loginModalBackdrop) {
                closeLoginModalFunc();
            }
        });
    }
    
    // Modal bezárása Escape billentyűvel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !loginModal.classList.contains('hidden')) {
            closeLoginModalFunc();
        }
    });
    
    // Login form submit kezelés - automatikusan elfogadja
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Automatikusan elfogadja a bejelentkezést, nincs validáció
            // Modal bezárása és scroll visszaállítás
            closeLoginModalFunc();
            
            // Bejelentkezés gomb elrejtése, hamburger menü és listám gomb megjelenítése
            const loginTrigger = document.getElementById('loginTrigger');
            const headerRightButtons = document.getElementById('headerRightButtons');
            
            if (loginTrigger && headerRightButtons) {
                loginTrigger.style.display = 'none';
                headerRightButtons.style.display = 'flex';
                
                // Hamburger menü inicializálása ha még nem történt
                initializeHamburgerMenu();
            }
            
            // Form reset
            loginForm.reset();
        });
    }
    
    // Hamburger menü inicializálás függvény
    function initializeHamburgerMenu() {
        const hamburgerButton = document.getElementById('hamburgerButton');
        const hamburgerMenuDropdown = document.getElementById('hamburgerMenuDropdown');
        
        if (!hamburgerButton || !hamburgerMenuDropdown) {
            return;
        }
        
        // Ha már van event listener, ne adjunk hozzá újat
        if (hamburgerButton.dataset.initialized === 'true') {
            return;
        }
        
        hamburgerButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            hamburgerMenuDropdown.classList.toggle('active');
            hamburgerButton.classList.toggle('active');
        });
        
        hamburgerButton.dataset.initialized = 'true';
    }
    
    // Hamburger menü kezelés - inicializálás oldal betöltésekor
    initializeHamburgerMenu();
    
    // Menü bezárása kattintásra a menün kívülre
    document.addEventListener('click', (e) => {
        const hamburgerButton = document.getElementById('hamburgerButton');
        const hamburgerMenuDropdown = document.getElementById('hamburgerMenuDropdown');
        
        if (hamburgerButton && hamburgerMenuDropdown) {
            if (!hamburgerMenuDropdown.contains(e.target) && !hamburgerButton.contains(e.target)) {
                hamburgerMenuDropdown.classList.remove('active');
                hamburgerButton.classList.remove('active');
            }
        }
    });
    
    // Hamburger menü elemek kezelése
    const myAccount = document.getElementById('myAccount');
    const submitRecommendation = document.getElementById('submitRecommendation');
    const logout = document.getElementById('logout');
    
    function closeHamburgerMenu() {
        const hamburgerMenuDropdown = document.getElementById('hamburgerMenuDropdown');
        const hamburgerButton = document.getElementById('hamburgerButton');
        if (hamburgerMenuDropdown && hamburgerButton) {
            hamburgerMenuDropdown.classList.remove('active');
            hamburgerButton.classList.remove('active');
        }
    }
    
    // My Account Modal kezelés
    const myAccountModal = document.getElementById('myAccountModal');
    const myAccountBackdrop = document.getElementById('myAccountBackdrop');
    const closeMyAccountModal = document.getElementById('closeMyAccountModal');
    const cancelMyAccount = document.getElementById('cancelMyAccount');
    const myAccountForm = document.getElementById('myAccountForm');
    
    function openMyAccountModal() {
        if (myAccountModal) {
            myAccountModal.classList.remove('hidden');
            myAccountModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
            
            // Initialize animation state
            const content = document.getElementById('myAccountContent');
            if (content) {
                content.classList.remove('scale-100', 'opacity-100');
                content.classList.add('scale-95', 'opacity-0');
            }
            if (myAccountBackdrop) {
                myAccountBackdrop.classList.remove('opacity-100');
                myAccountBackdrop.classList.add('opacity-0');
            }
            
            // Trigger animation
            setTimeout(() => {
                if (content) {
                    content.classList.remove('scale-95', 'opacity-0');
                    content.classList.add('scale-100', 'opacity-100');
                }
                if (myAccountBackdrop) {
                    myAccountBackdrop.classList.remove('opacity-0');
                    myAccountBackdrop.classList.add('opacity-100');
                }
            }, 10);
        }
    }
    
    function closeMyAccountModalFunc() {
        const content = document.getElementById('myAccountContent');
        if (content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
        }
        if (myAccountBackdrop) {
            myAccountBackdrop.classList.remove('opacity-100');
            myAccountBackdrop.classList.add('opacity-0');
        }
        
        setTimeout(() => {
            if (myAccountModal) {
                myAccountModal.classList.add('hidden');
                myAccountModal.classList.remove('flex');
                document.body.style.overflow = '';
            }
        }, 200);
    }
    
    if (myAccount) {
        myAccount.addEventListener('click', (e) => {
            e.preventDefault();
            openMyAccountModal();
            closeHamburgerMenu();
        });
    }
    
    if (closeMyAccountModal) {
        closeMyAccountModal.addEventListener('click', closeMyAccountModalFunc);
    }
    
    if (cancelMyAccount) {
        cancelMyAccount.addEventListener('click', closeMyAccountModalFunc);
    }
    
    // Modal bezárása háttérre kattintva
    if (myAccountModal) {
        myAccountModal.addEventListener('click', (e) => {
            if (e.target === myAccountModal || e.target === myAccountBackdrop) {
                closeMyAccountModalFunc();
            }
        });
    }
    
    // Modal bezárása Escape billentyűvel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && myAccountModal && !myAccountModal.classList.contains('hidden')) {
            closeMyAccountModalFunc();
        }
    });
    
    // Profil kép feltöltés kezelés
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImage = document.getElementById('profileImage');
    
    if (profileImageInput && profileImage) {
        profileImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profileImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Gyerekek mezőinek frissítése
    window.updateChildrenFields = function() {
        const childCount = parseInt(document.getElementById('childCount').value) || 0;
        const container = document.getElementById('childrenContainer');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 1; i <= childCount; i++) {
            const childDiv = document.createElement('div');
            childDiv.className = 'p-4 bg-[#FFF9F3] border border-[#E8DDD0] rounded-xl';
            childDiv.innerHTML = `
                <h4 class="text-lg font-semibold text-teal-600 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    ${i}. gyerek
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label for="childName${i}" class="block text-sm font-semibold text-gray-700 mb-2">Név</label>
                        <input 
                            type="text" 
                            id="childName${i}" 
                            name="childName${i}" 
                            placeholder="Gyerek neve"
                            class="w-full px-4 py-3 bg-white border border-[#E8DDD0] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        >
                    </div>
                    <div>
                        <label for="childBirthYear${i}" class="block text-sm font-semibold text-gray-700 mb-2">Születési év</label>
                        <input 
                            type="number" 
                            id="childBirthYear${i}" 
                            name="childBirthYear${i}" 
                            min="2000" 
                            max="${new Date().getFullYear()}" 
                            placeholder="${new Date().getFullYear()}" 
                            value="${new Date().getFullYear()}"
                            class="w-full px-4 py-3 bg-white border border-[#E8DDD0] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        >
                    </div>
                </div>
            `;
            container.appendChild(childDiv);
        }
    };
    
    // Form submit kezelés
    if (myAccountForm) {
        myAccountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                subscription: document.querySelector('input[name="subscription"]:checked')?.value,
                firstName: document.getElementById('firstName')?.value,
                lastName: document.getElementById('lastName')?.value,
                email: document.getElementById('accountEmail')?.value,
                phone: document.getElementById('phone')?.value,
                parentCount: document.getElementById('parentCount')?.value,
                childCount: document.getElementById('childCount')?.value,
                children: []
            };
            
            // Gyerekek adatainak összegyűjtése
            const childCount = parseInt(formData.childCount) || 0;
            for (let i = 1; i <= childCount; i++) {
                const name = document.getElementById(`childName${i}`)?.value;
                const birthYear = document.getElementById(`childBirthYear${i}`)?.value;
                if (name || birthYear) {
                    formData.children.push({
                        name: name,
                        birthYear: birthYear
                    });
                }
            }
            
            console.log('Fiók adatok mentve:', formData);
            alert('Adatok mentve! (Ez csak egy demo)');
            
            closeMyAccountModalFunc();
        });
    }
    
    // Submit Recommendation Modal kezelés
    const submitRecommendationModal = document.getElementById('submitRecommendationModal');
    const submitRecommendationBackdrop = document.getElementById('submitRecommendationBackdrop');
    const closeSubmitRecommendationModal = document.getElementById('closeSubmitRecommendationModal');
    const cancelSubmitRecommendation = document.getElementById('cancelSubmitRecommendation');
    const submitRecommendationForm = document.getElementById('submitRecommendationForm');
    
    function openSubmitRecommendationModal() {
        if (submitRecommendationModal) {
            submitRecommendationModal.classList.remove('hidden');
            submitRecommendationModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
            
            // Initialize animation state
            const content = document.getElementById('submitRecommendationContent');
            if (content) {
                content.classList.remove('scale-100', 'opacity-100');
                content.classList.add('scale-95', 'opacity-0');
            }
            if (submitRecommendationBackdrop) {
                submitRecommendationBackdrop.classList.remove('opacity-100');
                submitRecommendationBackdrop.classList.add('opacity-0');
            }
            
            // Trigger animation
            setTimeout(() => {
                if (content) {
                    content.classList.remove('scale-95', 'opacity-0');
                    content.classList.add('scale-100', 'opacity-100');
                }
                if (submitRecommendationBackdrop) {
                    submitRecommendationBackdrop.classList.remove('opacity-0');
                    submitRecommendationBackdrop.classList.add('opacity-100');
                }
            }, 10);
        }
    }
    
    function closeSubmitRecommendationModalFunc() {
        const content = document.getElementById('submitRecommendationContent');
        if (content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
        }
        if (submitRecommendationBackdrop) {
            submitRecommendationBackdrop.classList.remove('opacity-100');
            submitRecommendationBackdrop.classList.add('opacity-0');
        }
        
        setTimeout(() => {
            if (submitRecommendationModal) {
                submitRecommendationModal.classList.add('hidden');
                submitRecommendationModal.classList.remove('flex');
                document.body.style.overflow = '';
            }
        }, 200);
    }
    
    if (submitRecommendation) {
        submitRecommendation.addEventListener('click', (e) => {
            e.preventDefault();
            openSubmitRecommendationModal();
        });
    }
    
    if (closeSubmitRecommendationModal) {
        closeSubmitRecommendationModal.addEventListener('click', closeSubmitRecommendationModalFunc);
    }
    
    if (cancelSubmitRecommendation) {
        cancelSubmitRecommendation.addEventListener('click', closeSubmitRecommendationModalFunc);
    }
    
    // Modal bezárása háttérre kattintva
    if (submitRecommendationModal) {
        submitRecommendationModal.addEventListener('click', (e) => {
            if (e.target === submitRecommendationModal || e.target === submitRecommendationBackdrop) {
                closeSubmitRecommendationModalFunc();
            }
        });
    }
    
    // Modal bezárása Escape billentyűvel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && submitRecommendationModal && !submitRecommendationModal.classList.contains('hidden')) {
            closeSubmitRecommendationModalFunc();
        }
    });
    
    // Form submit kezelés
    if (submitRecommendationForm) {
        submitRecommendationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                placeName: document.getElementById('placeName')?.value,
                placeType: document.getElementById('placeType')?.value,
                recommendationText: document.getElementById('recommendationText')?.value,
                mapsLink: document.getElementById('mapsLink')?.value || null,
                amenities: []
            };
            
            // Checklist értékek összegyűjtése
            const checkedAmenities = submitRecommendationForm.querySelectorAll('input[name="amenities"]:checked');
            if (checkedAmenities.length === 0) {
                alert('Kérjük, válassz legalább egy opciót a checklist-ből!');
                return;
            }
            
            checkedAmenities.forEach(checkbox => {
                formData.amenities.push(checkbox.value);
            });
            
            console.log('Ajánlás beküldve:', formData);
            alert('Köszönjük az ajánlást! A helyszín átnézése után megjelenik az oldalon.');
            
            // Form reset
            submitRecommendationForm.reset();
            closeSubmitRecommendationModalFunc();
        });
    }
    
    if (logout) {
        logout.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Kijelentkezés: hamburger menü és listám gomb elrejtése, bejelentkezés gomb megjelenítése
            const headerRightButtons = document.getElementById('headerRightButtons');
            const loginTrigger = document.getElementById('loginTrigger');
            
            if (headerRightButtons && loginTrigger) {
                headerRightButtons.style.display = 'none';
                loginTrigger.style.display = 'block';
            }
            
            closeHamburgerMenu();
        });
    }
    
    // Felvédzés és Listám gombok kezelése
    const showAllButton = document.getElementById('showAllButton');
    const myListsButton = document.getElementById('myListsButton');
    
    // Alapértelmezett állapot: Felvédzés gomb aktív
    if (showAllButton) {
        showAllButton.classList.add('active');
    }
    
    function showAllPlaces() {
        // Összes rekord megjelenítése
        isShowingSavedPlaces = false;
        // Keresőmező ürítése
        if (searchInput) {
            searchInput.value = '';
        }
        
        displayPlaces(mockPlaces, true);
        
        // Aktív állapot beállítása
        if (showAllButton) {
            showAllButton.classList.add('active');
        }
        if (myListsButton) {
            myListsButton.classList.remove('active');
        }
    }
    
    function showSavedPlaces() {
        const saved = getSavedPlaces();
        
        if (saved.length === 0) {
            alert('Még nincsenek mentett helyek a listádon.\nHelyszínek részleteit megnyitva a "Listához adás" gombbal hozzáadhatsz helyeket.');
            return;
        }
        
        // Mentett helyek megjelenítése a fő tartalomban
        isShowingSavedPlaces = true;
        // Keresőmező ürítése
        if (searchInput) {
            searchInput.value = '';
        }
        
        const placesToDisplay = saved.map(savedPlace => {
            return mockPlaces.find(p => p.name === savedPlace.name && p.address === savedPlace.address) || savedPlace;
        });
        
        displayPlaces(placesToDisplay, true);
        
        // Aktív állapot beállítása
        if (showAllButton) {
            showAllButton.classList.remove('active');
        }
        if (myListsButton) {
            myListsButton.classList.add('active');
        }
    }
    
    // Felvédzés gomb (Összes helyek megjelenítése)
    if (showAllButton) {
        showAllButton.addEventListener('click', (e) => {
            e.preventDefault();
            showAllPlaces();
        });
    }
    
    // Listám gomb (Mentett helyek megjelenítése)
    if (myListsButton) {
        myListsButton.addEventListener('click', (e) => {
            e.preventDefault();
            showSavedPlaces();
        });
    }
    
    // Place Detail Modal kezelés
    const placeDetailModal = document.getElementById('placeDetailModal');
    const closePlaceDetail = document.getElementById('closePlaceDetail');
    const placeDetailBackdrop = document.getElementById('placeDetailBackdrop');
    
    function closePlaceDetailModal() {
        const content = document.getElementById('placeDetailContent');
        if (content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
        }
        if (placeDetailBackdrop) {
            placeDetailBackdrop.classList.remove('opacity-100');
            placeDetailBackdrop.classList.add('opacity-0');
        }
        
        setTimeout(() => {
            placeDetailModal.classList.add('hidden');
            placeDetailModal.classList.remove('flex');
            document.body.style.overflow = '';
        }, 200);
    }
    
    // Modal bezárása X gombbal
    if (closePlaceDetail) {
        closePlaceDetail.addEventListener('click', closePlaceDetailModal);
    }
    
    // Modal bezárása háttérre kattintva
    if (placeDetailBackdrop) {
        placeDetailBackdrop.addEventListener('click', closePlaceDetailModal);
    }
    
    // Modal bezárása Escape billentyűvel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !placeDetailModal.classList.contains('hidden')) {
            closePlaceDetailModal();
        }
    });
});


