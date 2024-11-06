const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let Pokemons = [];

// Fetching all Pokemon information to 'Pokemons' from the poke-api 

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
    .then((response) => response.json())
    .then((data) => {
        Pokemons = data.results;
        displayPokemons(Pokemons)
});

// =======================================================================
// Make MyPokedex gurantee to retrieve all data before accessing MyPokedex
// =======================================================================

async function fetchPokeDataBeforeRedirect(id)
{
    try
    {
        const [pokemon, pokemonSpecies] = 
        await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((res) => res.json()
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((res) => res.json()
        ),
    ]);
    return true;
    } 
    catch (error)
    {
        console.error("Failed to fetch Pokemon data before redirect");
    }
}

// ============================================
// Displays all pokemon pictures with its names
// ============================================

function displayPokemons(pokemon)
{
    listWrapper.innerHTML = "";

    pokemon.forEach((pokemon) => {
        // Traveling through the URL by passing 6 '/' to reach to the Pokemon name
        const pokemonID = pokemon.url.split("/")[6];        
        const listItem = document.createElement("div");

        // Display a picture of each pokemon and its name
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonID}</p>
            </div>
            <div class="image-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" /> 
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">#${pokemon.name}</p>
            </div>   
        `;

        // To show the detail of a Pokemon when it is clicked.
        listItem.addEventListener("click", async () => {
            const success = await fetchPokeDataBeforeRedirect(pokemonID);
            if (success) 
            {
                window.location.href = `./detail.html?id=${pokemonID}`;
            }
        });

        listWrapper.appendChild(listItem);
    });

}

// ===============================
// Search bar to search Pokemon(s) 
// ===============================

searchInput.addEventListener("keyup", handleSearch);

function handleSearch()
{
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;

    // Search by pokemonID
    if (numberFilter.checked)
    {
        filteredPokemons = Pokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchTerm);
        });
    }

    // Search by pokemon name
    else if (nameFilter.checked)
    {
        filteredPokemons = Pokemons.filter((pokemon) => 
            pokemon.name.toLowerCase().startsWith(searchTerm)
        );
    }
    else
    {
        filteredPokemons = Pokemons;
    }
    
    // Handle case when there are no pokemons retrieved from the search
    displayPokemons(filteredPokemons);

    if (filteredPokemons.length === 0)
    {
        notFoundMessage.style.display = "block";
    }
    else
    {
        notFoundMessage.style.display = "none";
    }
}

// ===============================
// Clear button for the search bar 
// ===============================

const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch()
{
    searchInput.value = "";
    displayPokemons(Pokemons);
    notFoundMessage.stlye.display = "none";
}