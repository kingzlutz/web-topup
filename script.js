// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');
const categoryBtns = document.querySelectorAll('.category-btn');
const gamesContainer = document.getElementById('games-container');
const modal = document.getElementById('gameModal');
const closeModal = document.querySelector('.close-modal');
const modalGameName = document.getElementById('modalGameName');
const modalGameImage = document.getElementById('modalGameImage');
const modalGameDesc = document.getElementById('modalGameDesc');
const modalDenominations = document.getElementById('modalDenominations');
const orderForm = document.getElementById('orderForm');
const messageForm = document.getElementById('messageForm');

// Game Data (would normally come from JSON file or API)
let games = [];

// Fetch game data from JSON file
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        games = data;
        displayGames(games);
    })
    .catch(error => console.error('Error loading game data:', error));

// Display games in the container
function displayGames(gamesToDisplay) {
    gamesContainer.innerHTML = '';
    
    gamesToDisplay.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.className = 'game-item';
        gameItem.dataset.category = game.category;
        
        gameItem.innerHTML = `
            <img src="${game.image}" alt="${game.name}" class="game-image">
            <div class="game-info">
                <h3>${game.name}</h3>
                <p>${game.shortDesc}</p>
                <span class="game-price">Mulai dari Rp${game.denominations[0].price.toLocaleString('id-ID')}</span>
                <button class="btn order-btn" data-id="${game.id}">Pesan Sekarang</button>
            </div>
        `;
        
        gamesContainer.appendChild(gameItem);
    });
    
    // Add event listeners to order buttons
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const gameId = this.dataset.id;
            openModal(gameId);
        });
    });
}

// Filter games by category
categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Update active button
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.dataset.category;
        
        if (category === 'all') {
            displayGames(games);
        } else {
            const filteredGames = games.filter(game => game.category === category);
            displayGames(filteredGames);
        }
    });
});

// Open modal with game details
function openModal(gameId) {
    const game = games.find(g => g.id === gameId);
    
    if (!game) return;
    
    modalGameName.textContent = game.name;
    modalGameImage.src = game.image;
    modalGameImage.alt = game.name;
    modalGameDesc.textContent = game.description;
    
    // Clear previous denominations
    modalDenominations.innerHTML = '';
    
    // Add denominations
    game.denominations.forEach(denom => {
        const denomElement = document.createElement('div');
        denomElement.className = 'denomination';
        denomElement.innerHTML = `
            <p>${denom.name}</p>
            <p>Rp${denom.price.toLocaleString('id-ID')}</p>
        `;
        
        denomElement.addEventListener('click', function() {
            document.querySelectorAll('.denomination').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
        });
        
        modalDenominations.appendChild(denomElement);
    });
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Handle order form submission
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const gameId = document.querySelector('#gameId').value;
    const paymentMethod = document.querySelector('#paymentMethod').value;
    const selectedDenomination = document.querySelector('.denomination.selected');
    
    if (!selectedDenomination) {
        alert('Silakan pilih nominal terlebih dahulu!');
        return;
    }
    
    // In a real app, you would send this data to your backend
    alert(`Pesanan berhasil!\n\nGame: ${modalGameName.textContent}\nID: ${gameId}\nMetode Pembayaran: ${paymentMethod}`);
    
    // Reset form and close modal
    orderForm.reset();
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Handle contact form submission
messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const message = document.querySelector('#message').value;
    
    // In a real app, you would send this data to your backend
    alert(`Terima kasih ${name}! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda melalui email.`);
    
    // Reset form
    messageForm.reset();
});

// Mobile menu toggle
menuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        navMenu.classList.remove('active');
    });
});