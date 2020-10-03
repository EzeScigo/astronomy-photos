const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imageContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const removeConfirmed = document.querySelector('.remove-confirmed');
const loader = document.querySelector('.loader');

let podArray = [];  // Array
let favObj = {}; // Obj

const count = 10;
const apiKey = 'YuB4qvLOg7EbfVUqf9pbYfhRsLg6iZltOw8LD8s2';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

// Helper Function to Set Attributes on DOM Elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Create New Card
function createDOMNodes(page) {
    let arrayDOM = [];
    arrayDOM = podArray;
    if (page === 'favorites') {
        arrayDOM = Object.values(favObj);
    }
    arrayDOM.forEach((photo) => {

        // Create New div with class "card"
        const card = document.createElement('div');
        setAttributes(card, {
            class: "card",
        });

        // Create new div with class "card-body"
        const cardBody = document.createElement('div');
        setAttributes(cardBody, {
            class: "card-body",
        });

        // Create h5 title for cardBody
        const cardTitle = document.createElement('h5');
        setAttributes(cardTitle, {
            class: "card-title",
        });
        cardTitle.innerText = photo.title;

        // Create link Add Favorites for cardBody
        const cardFav = document.createElement('p');
        if (page === 'home') {
            setAttributes(cardFav, {
                class: "clickable",
                onclick: `saveFavorite('${photo.url}')`,
            });
            cardFav.textContent = 'Add to Favorites';
        } else if (page === 'favorites') {
            setAttributes(cardFav, {
                class: "clickable",
                onclick: `removeFavorite('${photo.url}')`,
            });
            cardFav.textContent = 'Remove from Favorites';
        }

        // Create p for text in cardBody
        const cardText = document.createElement('p');
        setAttributes(cardText, {
            class: "card-text",
        });
        cardText.textContent = photo.explanation;

        // Create footer for Copyright and Date
        const cardFooter = document.createElement('small');
        setAttributes(cardFooter, {
            class: "text-muted",
        });

        // Create strong for Date
        const cardDate = document.createElement('strong');
        cardDate.innerText = photo.date + " ";

        // Create span for Copyright
        const copyrightResult = photo.copyright === undefined ? '' : photo.copyright;
        const cardCopyright = document.createElement('span');
        cardCopyright.textContent = `${copyrightResult}`;
        
        // Create new <a> to link image
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.hdurl,
            title: "View Full Image",
            target: '_blank',
        });

        // Create new <img> for picture
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.url,
            alt: "NASA Picture of the Day",
            title: photo.title,
            class: "card-img-top",
        });

        // Put Date + Copyright in Card Footer
        cardFooter.append(cardDate, cardCopyright);
        // Put Title + link to Fav + Text + Footer in CardBody
        cardBody.append(cardTitle, cardFav, cardText, cardFooter);
        // Put <img> inside <a>
        item.appendChild(img);
        // Put <a> and <div card-body> inside <div card>
        card.append(item, cardBody);
        // Put <div card> inside <div imageContainer>
        imageContainer.appendChild(card);
    });
}

function updateDOM(page) {
    // Get Favorites from localStorage
    loader.classList.remove('hidden');
    if (localStorage.getItem('nasaFavorites')) {
        favObj = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    // Refresh Image Container
    imageContainer.textContent = '';
    loader.classList.add('hidden');
    createDOMNodes(page);
}

// Get Picture Of the Day data from NASA APOD API
async function getPicture() { 
    try {
        // Show Loader animation
        loader.classList.remove('hidden');
        // API request
        const response = await fetch(apiUrl);
        podArray = await response.json();
        updateDOM('home');
    } catch (error) {
        console.log('ups', error);
    }
}

// Add photo to Favorites
function saveFavorite(itemUrl) {
    // Loop through podArray to select Favorite
    podArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favObj[itemUrl]) {
            favObj[itemUrl] = item; // Key = URL, Value = entire item data
            // Show Save Confirmation for 2 secs
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // Set Favorites in localStorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favObj));
        }
    });
}

// Remove photo from Favorites
function removeFavorite(itemUrl) {
    // Loop through podArray to select Favorite
    if (favObj[itemUrl]) {
        delete favObj[itemUrl];
        // Update Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favObj));
        // Update DOM
        updateDOM('favorites');
        // Show Remove Confirmation for 2 secs
        removeConfirmed.hidden = false;
        setTimeout(() => {
            removeConfirmed.hidden = true;
        }, 2000);
    }
}

// Show Favorites Navbar
function showFavNav() {
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
}

// Show Results Navbar
function showResultsNav() {
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
}

// On Load
getPicture();

