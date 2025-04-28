let currentLanguage = '';
let artworks = [];

function renderHeader() {
  let header = document.getElementById('header');
  
  // If the header doesn't exist, create it
  if (!header) {
    header = document.createElement('div');
    header.id = 'header';
    document.body.prepend(header);
  }

  // Update the header content
  header.innerHTML = `
  <div class="header-content">
    <button class="home-button" onclick="showLanguageSelection()">Home</button>
    <div class="language-selector">
      <select id="language-select" onchange="changeLanguage(this.value)">
        <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>EN</option>
        <option value="fr" ${currentLanguage === 'fr' ? 'selected' : ''}>FR</option>
        <option value="de" ${currentLanguage === 'de' ? 'selected' : ''}>DE</option>
        <option value="es" ${currentLanguage === 'es' ? 'selected' : ''}>ES</option>
      </select>
    </div>
  </div>
  `;
}

function changeLanguage(lang) {
  if (lang !== currentLanguage) {
    loadLanguage(lang);
  }
}

function loadLanguage(lang) {
  currentLanguage = lang;
  fetch(`data/artworks_${lang}.json`)
    .then(response => response.json())
    .then(data => {
      artworks = data;
      showLanguageSelection(); // Call this after artworks are loaded
    });
}

function renderArtworkDetails(index) {
  const artwork = artworks[index];
  const app = document.getElementById('app');

  // Add a fade-out effect before updating the content
  app.classList.add('fade-out');
  setTimeout(() => {
    let prevButton = index > 0 
      ? `<button onclick="renderArtworkDetails(${index - 1})">← Previous</button>` 
      : '';
    let nextButton = index < artworks.length - 1 
      ? `<button onclick="renderArtworkDetails(${index + 1})">Next →</button>` 
      : '';

    app.innerHTML = `
      <h2>${artwork.title}</h2>
      <p><strong>Artist:</strong> ${artwork.artist} (${artwork.year})</p>
      <img src="${artwork.image}" alt="${artwork.title}" class="artwork-image">
      <p><strong>Commentary:</strong> ${artwork.description}</p>
      <div class="centered-buttons">
        ${prevButton}
        ${nextButton}
      </div>
    `;

    // Remove fade-out and add fade-in effect
    app.classList.remove('fade-out');
    app.classList.add('fade-in');

    // Remove the fade-in class after the animation completes
    setTimeout(() => {
      app.classList.remove('fade-in');
    }, 170); // Match the duration of the fade-in effect
  }, 170); // Match the duration of the fade-out effect
}

function showLanguageSelection() {
  renderHeader(); // Add the header with the language selector
  const app = document.getElementById('app');

  let html = `
    <h1>Explore the Sibyla</h1>
    <p>Select a painting to view details or start the guided tour.</p>
    <button class="start-tour-button" onclick="startTour()">Start Tour</button>
    <div class="painting-tiles">
  `;

  artworks.forEach((artwork, index) => {
    html += `
      <div class="tile" onclick="renderArtworkDetails(${index})">
        <img src="${artwork.image}" alt="${artwork.title}" class="tile-image">
        <div class="tile-gradient"></div>
        <div class="tile-content">
          <h3>${artwork.title}</h3>
          <p>${artwork.artist}</p>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  app.innerHTML = html;

  // Render footer outside the #app container
  let footer = document.getElementById('footer');
  if (!footer) {
    footer = document.createElement('footer');
    footer.id = 'footer';
    footer.className = 'footer'; // Ensure the footer has the correct class
    document.body.appendChild(footer);
  }

  footer.innerHTML = `
    <div class="footer-content">
      <p>
        Follow us on 
        <a href="https://www.instagram.com/lenkarodanicova/" target="_blank" class="footer-link">@lenkarodanicova</a> 
        and 
        <a href="https://www.instagram.com/scharpfmanfred/" target="_blank" class="footer-link">@scharpfmanfred</a>.
      </p>
      <p class="copyright">© 2025 Lenka Rodanicova. All rights reserved.</p>
    </div>
  `;
}

function startTour() {
  if (artworks.length > 0) {
    renderArtworkDetails(0); // Start with the first painting
  } else {
    alert("No artworks available for the tour.");
  }
}

// Start app
loadLanguage('en'); // Load artworks for the default language