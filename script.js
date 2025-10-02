// Get elements from HTML
const filterButtons = document.querySelectorAll(".btn-filter")
const sortButtons = document.querySelectorAll(".btn-sort")
const randomButtons = document.getElementById("randomBtn")
const recipesContainer = document.getElementById("recipeContainer")
const favBtn = document.getElementById("favBtn")

// global state variabler
let selectedFilters = [] // All chosen filter-btns
let selectedSort = null // Chosen sort-method
let showFavoritesOnly = false

// Data - recipes array
const recipes = [
  {
    id: 1,
    title: "Pesto Pasta",
    image: "images/pizza.jpg",
    readyInMinutes: 25,
    sourceUrl: "https://example.com/pesto-pasta",
    cuisine: "Italian",
    ingredients: [
      "pasta",
      "basil",
      "parmesan cheese",
      "garlic",
      "pine nuts",
      "olive oil",
      "salt",
      "black pepper"
    ],
    isFavorite: false
  },
  {
    id: 2,
    title: "Green Curry with Tofu",
    image: "images/pizza.jpg",
    readyInMinutes: 40,
    sourceUrl: "https://example.com/green-curry-tofu",
    cuisine: "Thai",
    ingredients: [
      "tofu",
      "green curry paste",
      "coconut milk",
      "bamboo shoots",
      "bell peppers",
      "basil",
      "lime leaves",
      "rice",
      "salt"
    ],
    isFavorite: false
  },
  {
    id: 3,
    title: "Chicken Tacos",
    image: "images/pizza.jpg",
    readyInMinutes: 20,
    sourceUrl: "https://example.com/chicken-tacos",
    cuisine: "Mexican",
    ingredients: [
      "corn tortillas",
      "chicken breast",
      "taco seasoning",
      "lettuce",
      "tomato",
      "avocado",
      "cheddar cheese"
    ],
    isFavorite: false
  },
  {
    id: 4,
    title: "Bibimbap",
    image: "images/pizza.jpg",
    readyInMinutes: 35,
    sourceUrl: "https://example.com/bibimbap",
    cuisine: "Korean",
    ingredients: [
      "rice",
      "spinach",
      "carrots",
      "bean sprouts",
      "shiitake mushrooms",
      "egg",
      "gochujang",
      "sesame oil"
    ],
    isFavorite: false
  },
  {
    id: 5,
    title: "Spaghetti Carbonara",
    image: "images/pizza.jpg",
    readyInMinutes: 25,
    sourceUrl: "https://example.com/spaghetti-carbonara",
    cuisine: "Italian",
    ingredients: [
      "spaghetti",
      "eggs",
      "parmesan cheese",
      "pancetta",
      "black pepper",
      "garlic"
    ],
    isFavorite: false
  },
  {
    id: 6,
    title: "Chicken Tikka Masala",
    image: "images/pizza.jpg",
    readyInMinutes: 50,
    sourceUrl: "https://example.com/chicken-tikka-masala",
    cuisine: "Indian",
    ingredients: [
      "chicken",
      "yogurt",
      "tomato puree",
      "cream",
      "garam masala",
      "ginger",
      "garlic",
      "onion"
    ],
    isFavorite: false
  }
]

const showRecipes = (recipesArray) => {
  recipesContainer.innerHTML = ""

  if (recipesArray.length === 0) {
    recipesContainer.innerHTML = `<p class="placeholder-output">😢 No recipes match your filter, try choosing another one</p>`
    return
  }

  recipesArray.forEach(recipe => {
    recipesContainer.innerHTML += `
  <div class="recipe-card" data-url="${recipe.sourceUrl}">
  <img class="card-image" src="${recipe.image}" alt="${recipe.title}" />
    <h2>${recipe.title}</h2>
    <hr class="solid">
    <p><strong>Cuisine:</strong> ${recipe.cuisine}<br>
       <strong>Time:</strong> ${recipe.readyInMinutes} minutes<br>
    </p>
    <hr class="solid">
    <p><strong class="ingredients-title">Ingredients</strong><br>
       ${recipe.ingredients.join("<br>")}
    </p>
      <button class="btn-fav ${recipe.isFavorite ? "active" : ""}" data-id="${recipe.id}">
        <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                   2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
                   4.5 2.09C13.09 3.81 14.76 3 
                   16.5 3 19.58 3 22 5.42 
                   22 8.5c0 3.78-3.4 6.86-8.55 
                   11.54L12 21.35z"/>
        </svg>
      </button>
  </div>
`

  })

  addFavoriteListeners()

  document.querySelectorAll(".recipe-card").forEach(card => {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".btn-fav")) return
      const url = card.dataset.url
      if (url) window.open(url, "_blank")
    })
  })
}


const addFavoriteListeners = () => {
  const favoriteButtons = document.querySelectorAll(".btn-fav")

  favoriteButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      event.stopPropagation()

      const recipeId = parseInt(button.dataset.id)
      const recipe = recipes.find(r => r.id === recipeId)

      if (recipe.isFavorite === false) {
        recipe.isFavorite = true
        button.classList.add("active")
      } else {
        recipe.isFavorite = false
        button.classList.remove("active")
      }
      if (showFavoritesOnly === true) {
        updateRecipes()
      }
    })
  })
}

const updateRecipes = () => {
  let filteredRecipes = recipes

  if (selectedFilters.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      selectedFilters.includes(recipe.cuisine.toLowerCase())
    )
    console.log("Filtered recipes:", filteredRecipes)
  }

  if (showFavoritesOnly === true) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.isFavorite === true)
  }

  filteredRecipes = sortRecipes(filteredRecipes)
  console.log("Sorted recipes:", filteredRecipes)
  showRecipes(filteredRecipes)
}


const sortRecipes = (recipesArray) => {
  if (selectedSort === "ascending") {
    return recipesArray.sort((a, b) => a.readyInMinutes - b.readyInMinutes)
  }
  if (selectedSort === "descending") {
    return recipesArray.sort((a, b) => b.readyInMinutes - a.readyInMinutes)
  }
  return recipesArray
}



//Eventlistener
favBtn.addEventListener("click", () => {
  if (showFavoritesOnly === false) {
    showFavoritesOnly = true
    favBtn.classList.add("active")
  } else {
    showFavoritesOnly = false
    favBtn.classList.remove("active")
  }
  updateRecipes()
})



filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value

    //If "All" is chosen -> clear everything else
    if (value === "all") {
      selectedFilters = []
      selectedSort = null
      showFavoritesOnly = false
      favBtn.classList.remove("active")
      filterButtons.forEach(btn => btn.classList.remove("selected"))
      button.classList.add("selected")
      randomButtons.classList.remove("selected")
      updateRecipes()


      console.log("Selected filters cleared")
      console.log("Random button deselected")

      return

    } else {
      //Remove "All" if any other filter is chosen
      const allButton = document.querySelector('.btn-filter[data-value="all"]')
      allButton.classList.remove("selected")

      button.classList.toggle("selected")

      // Maintain order of clicks
      if (button.classList.contains("selected")) {

        // Add filter if it's not already chosen
        if (selectedFilters.includes(value) === false) {
          selectedFilters.push(value);
        }

      } else {
        // Remove filter when unclicked
        selectedFilters = selectedFilters.filter(f => f !== value);
      }

      console.log("Updated selected filters:", selectedFilters)
    }
    updateRecipes()
  })
})

sortButtons.forEach(button => {
  button.addEventListener("click", () => {
    console.log("Sort button clicked:", button.dataset.value)

    if (selectedSort === button.dataset.value) {
      selectedSort = null
      button.classList.remove("selected")
      console.log("Sort cleared")

    } else {
      selectedSort = button.dataset.value
      sortButtons.forEach(btn => btn.classList.remove("selected"))
      button.classList.add("selected")
    }

    let filteredRecipes = recipes
    if (selectedFilters.length > 0) {
      filteredRecipes = recipes.filter(recipe => selectedFilters.includes(recipe.cuisine.toLocaleLowerCase()))
    }
    updateRecipes()
  })
})

randomButtons.addEventListener("click", () => {
  randomButtons.classList.toggle("selected")

  // Deselect all kitchen filters
  filterButtons.forEach(btn => btn.classList.remove("selected"))
  sortButtons.forEach(btn => btn.classList.remove("selected"))

  //Clear internal filter selection
  selectedFilters = []
  selectedSort = null

  const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]

  showRecipes([randomRecipe])
})

updateRecipes()





