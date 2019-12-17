(function() {
        const input = document.querySelector('.search__input');
        const form = document.querySelector('.search');
        const typeList = document.querySelector('#pokemon__typeList');
        const pokemonDetail = document.querySelectorAll('.details');
        const dex = document.querySelector('.dex');
        const suggestion = document.querySelector('.suggestion');

        form.addEventListener('submit', event => {
                event.preventDefault();
        });

        const pokemonArray = [];

        async function getPokemonDex() {
                try {
                        const pokedexNational = 'https://pokeapi.co/api/v2/pokedex/1/';
                        const response = await fetch(pokedexNational);
                        const pokemon = await response.json();
                        const poke = await pokemon.pokemon_entries;
                        // array of pokemons with the links

                        poke.map(pokemon => {
                                pokemonArray.push(pokemon);
                                return pokemon;
                        });

                        input.addEventListener('keyup', displayMatches);
                        input.addEventListener('keypress', () => {
                                suggestion.style.display = 'block';
                                dex.style.visibility = 'hidden';
                        });

                        suggestion.addEventListener('click', e => {
                                if (e.target && e.target.matches('li')) {
                                        getPokemon(e.target.textContent);
                                        dex.style.visibility = 'visible';
                                        suggestion.style.display = 'none';
                                }

                                // input.addEventListener('keyup', displayMatches);
                        });
                } catch (err) {
                        alert(err);
                }
        }

        async function getPokemon(name) {
                try {
                        const source = 'https://pokeapi.co/api/v2/pokemon/';
                        const url = source + name;
                        const response = await fetch(url);
                        const json = await response.json();
                        const pokemon = await json;

                        await fetch(pokemon.species.url)
                                .then(function(response) {
                                        return response.json();
                                })
                                .then(function(typeFlavor) {
                                        pokemonDetail[3].textContent = typeFlavor.genera[2].genus;
                                        for (let i = 0; i < typeFlavor.flavor_text_entries.length; i++) {
                                                if (typeFlavor.flavor_text_entries[i].language.name === 'en') {
                                                        pokemonDetail[7].textContent =
                                                                typeFlavor.flavor_text_entries[i].flavor_text;
                                                        return;
                                                }
                                        }
                                });

                        typeList.innerHTML = '';
                        pokemonDetail[0].textContent = pokemon.id;
                        pokemonDetail[1].textContent = pokemon.name;
                        console.log('second');
                        pokemonDetail[2].src = pokemon.sprites.front_default;
                        for (let x = 0; x < pokemon.types.length; x++) {
                                const type = document.createElement('li');
                                type.textContent = pokemon.types[x].type.name;
                                typeList.appendChild(type);
                        }

                        pokemonDetail[5].textContent = `${pokemon.height}'`;
                        pokemonDetail[6].textContent = `${pokemon.weight} lbs`;
                } catch (err) {
                        alert(err);
                }
        }

        function findMatches(wordToMatch, pokemonArray) {
                return pokemonArray.filter(pokemon => {
                        // here we need to figure out if the city or state matches what was searched
                        const regex = new RegExp(wordToMatch, 'gi');
                        return pokemon.pokemon_species.name.match(regex);
                        // returns an array with the pokemon that matches with the word
                });
        }

        function displayMatches() {
                const matchArray = findMatches(
                        // this.value, // input value
                        this.value,
                        pokemonArray // list to find matches from
                );

                const matchedName = matchArray.map(pokemon => pokemon.pokemon_species.name);
                console.log(matchedName, matchedName.length);

                const html = matchArray
                        .map(pokemon => {
                                const regex = new RegExp(this.value, 'gi');

                                const pokemonName = pokemon.pokemon_species.name.replace(
                                        regex,
                                        `<span class="highlight">${this.value}</span>`
                                );

                                return `<li class="suggestion__list"><i class="fas fa-search"></i>${pokemonName}</li>`;
                        })
                        .join('');

                suggestion.innerHTML = html;
        }

        getPokemonDex();
})();
