// --- 1. SÉLECTION DES ÉLÉMENTS DU DOM ---
const movieGrid = document.getElementById('movieGrid');
const favoritesGrid = document.getElementById('favoritesGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('movieModal');
const modalDetails = document.getElementById('modalDetails');
const closeModalBtn = document.querySelector('.close-modal');

// --- 2. ÉTAT DE L'APPLICATION ---
let currentFilter = 'Tous';
let favorites = []; // Stocke les IDs des films favoris

// --- 3. FONCTIONS D'AFFICHAGE ---

// Génère le HTML d'une carte de film
function createMovieCard(movie, isFav) {
    return `
        <div class="movie-card">
            <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, ${movie.id})">
                <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
            </button>
            
            <img src="${movie.image}" alt="${movie.title}" onclick="openModal(${movie.id})">
            
            <div class="movie-info" onclick="openModal(${movie.id})">
                <h3>${movie.title}</h3>
                <div class="meta">
                    <span>${movie.year}</span>
                    <span>⭐ ${movie.rating}</span>
                </div>
            </div>
        </div>
    `;
}

// Affiche la liste principale des films
function renderMovies(moviesToDisplay) {
    movieGrid.innerHTML = '';
    
    if (moviesToDisplay.length === 0) {
        movieGrid.innerHTML = `<p class="empty-msg">Aucun film trouvé.</p>`;
        return;
    }

    moviesToDisplay.forEach(movie => {
        const isFav = favorites.includes(movie.id);
        movieGrid.innerHTML += createMovieCard(movie, isFav);
    });
}

// Affiche la liste des favoris en bas de page
function renderFavorites() {
    favoritesGrid.innerHTML = '';

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `<p class="empty-msg">🎬 Aucun film dans vos favoris pour le moment.</p>`;
        return;
    }

    // Filtrer les films complets à partir des IDs stockés dans 'favorites'
    const favMovies = movies.filter(movie => favorites.includes(movie.id));
    
    favMovies.forEach(movie => {
        favoritesGrid.innerHTML += createMovieCard(movie, true);
    });
}

// Mettre à jour toute l'interface en même temps
function updateUI() {
    // Appliquer la recherche et le filtre sur la grille principale
    const term = searchInput.value.toLowerCase();
    const filteredMovies = movies.filter(m => 
        m.title.toLowerCase().includes(term) && 
        (currentFilter === 'Tous' || m.category === currentFilter)
    );
    
    renderMovies(filteredMovies);
    renderFavorites();
}

// --- 4. GESTION DES FAVORIS ---
function toggleFavorite(event, id) {
    event.stopPropagation(); // Empêche d'ouvrir la modale quand on clique sur le cœur
    
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1); // Le retirer s'il y est
    } else {
        favorites.push(id); // L'ajouter s'il n'y est pas
    }
    
    // Mettre à jour l'affichage instantanément
    updateUI();
}

// --- 5. RECHERCHE ET FILTRES ---
searchInput.addEventListener('input', updateUI);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Changer le bouton actif visuellement
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Mettre à jour le filtre logique
        currentFilter = btn.dataset.category;
        updateUI();
    });
});

// --- 6. GESTION DE LA MODALE ---
function openModal(id) {
    const movie = movies.find(m => m.id === id);
    const isFav = favorites.includes(movie.id);

    modalDetails.innerHTML = `
        <img src="${movie.image}" class="modal-img">
        <div class="modal-text">
            <span class="badge">${movie.category}</span>
            <h2>${movie.title}</h2>
            <p style="color: #b3b3b3; margin-bottom: 15px;">
                <strong>Année :</strong> ${movie.year} &nbsp;|&nbsp; <strong>Durée :</strong> ${movie.duration}
            </p>
            <p>${movie.longDesc}</p>
            <div class="modal-footer">
                <button class="btn-main" onclick="toggleFavorite(event, ${movie.id}); closeModalHandler();">
                    <i class="${isFav ? 'fas' : 'far'} fa-heart"></i> ${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeModalHandler() {
    modal.style.display = 'none';
}

closeModalBtn.addEventListener('click', closeModalHandler);
window.addEventListener('click', (e) => { 
    if (e.target === modal) closeModalHandler(); 
});

// --- 7. INITIALISATION AU DÉMARRAGE ---
updateUI();
