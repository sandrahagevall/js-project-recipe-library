// Get elements from HTML
const filterButtons = document.querySelectorAll(".btn-filter")
const sortButtons = document.querySelectorAll(".btn-sort")
const randomButton = document.getElementById("randomBtn")
const recipesContainer = document.getElementById("recipeContainer")
const favBtn = document.getElementById("favBtn")
const API_KEY = "dd6e45be84ea4b5ca75f926ee451806c"
const URL = `https://api.spoonacular.com/recipes/complexSearch?number=30&apiKey=${API_KEY}&cuisine=Thai,Mexican,Mediterranean,Indian&addRecipeInformation=true&addRecipeInstructions=true&fillIngredients=true`
const loadingIndicator = document.getElementById("loading")


// Global state variables
let selectedFilters = [] // All chosen filter-btns
let selectedSort = null // Chosen sort-method
let showFavoritesOnly = false
let allRecipes = []


// Fetch data from API or localStorage
const fetchData = async () => {
  const lastFetch = localStorage.getItem("lastFetch")
  const now = Date.now()

  // If it's been less than 24 hours since the last fetch → use cache
  if (lastFetch && (now - lastFetch < 24 * 60 * 60 * 1000)) {
    const cachedRecipes = localStorage.getItem("allRecipes")
    if (cachedRecipes) {
      try {
        allRecipes = JSON.parse(cachedRecipes)
        console.log("Loaded recipes from cache")
        updateRecipes()
        loadingIndicator.style.display = "none"
        return
      } catch (e) {
        console.warn("Could not parse cached recipes", e)
        localStorage.removeItem("allRecipes")
        localStorage.removeItem("lastFetch")
      }
    }
  }
  loadingIndicator.style.display = "block"
  try {
    console.log("Fetching recipes from API...")
    const response = await fetch(URL)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    console.log("API response data:", data)

    allRecipes = data.results.map(recipe => {
      console.log("Processing recipe:", recipe)

      let ingredients = []

      if (recipe.extendedIngredients && recipe.extendedIngredients.length > 0) {
        ingredients = recipe.extendedIngredients.map(ing =>
          ing.original.toLowerCase().trim() // ← Makes all ingredients lowercase and trims whitespace
        )
      } else if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
        ingredients = recipe.analyzedInstructions.flatMap(instr =>
          instr.steps?.flatMap(step =>
            step.ingredients?.map(ing =>
              ing.name.toLowerCase().trim() // ← Makes all ingredient names lowercase and trims whitespace
            ) || []
          ) || []
        )
      }

      console.log("Extracted ingredients:", ingredients)

      return {
        id: recipe.id,
        title: recipe.title,
        cuisine: ((recipe.cuisines?.[0] || "Unknown").charAt(0).toUpperCase() +
          (recipe.cuisines?.[0] || "Unknown").slice(1).toLowerCase()),
        readyInMinutes: recipe.readyInMinutes,
        image: recipe.image,
        sourceUrl: recipe.sourceUrl,
        ingredients: [...new Set(ingredients)], // ta bort dubbletter
        isFavorite: false
      }
    })

    localStorage.setItem("allRecipes", JSON.stringify(allRecipes))
    localStorage.setItem("lastFetch", now.toString())

    updateRecipes()

  } catch (err) {
    const cachedRecipes = localStorage.getItem("allRecipes")
    if (cachedRecipes) {
      try {
        allRecipes = JSON.parse(cachedRecipes)
        console.log("Loaded recipes from cache due to error")
        updateRecipes()
      } catch (e) {
        console.error("Could not parse cached recipes", e)
        recipesContainer.innerHTML = "Could not load recipes 😢"
        localStorage.removeItem("allRecipes")
        localStorage.removeItem("lastFetch")
      }
    } else {
      recipesContainer.innerHTML = "Could not load recipes 😢"
    }
    console.error(err)
  } finally {
    loadingIndicator.style.display = "none"
  }
}

// Functions
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
}

const updateRecipes = () => {
  let filteredRecipes = [...allRecipes]

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
  const sorted = [...recipesArray]
  if (selectedSort === "ascending") {
    return sorted.sort((a, b) => a.readyInMinutes - b.readyInMinutes)
  }
  if (selectedSort === "descending") {
    return sorted.sort((a, b) => b.readyInMinutes - a.readyInMinutes)
  }
  return sorted
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
      randomButton.classList.remove("selected")
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
    updateRecipes()
  })
})

randomButton.addEventListener("click", () => {
  randomButton.classList.toggle("selected")

  // Deselect all kitchen filters
  filterButtons.forEach(btn => btn.classList.remove("selected"))
  sortButtons.forEach(btn => btn.classList.remove("selected"))

  //Clear internal filter selection
  selectedFilters = []
  selectedSort = null
  showFavoritesOnly = false
  favBtn.classList.remove("active")

  const randomRecipe = allRecipes[Math.floor(Math.random() * allRecipes.length)]

  showRecipes([randomRecipe])
})

recipesContainer.addEventListener("click", (event) => {
  const favButton = event.target.closest(".btn-fav")
  if (favButton) {
    event.stopPropagation()
    const recipeId = parseInt(favButton.dataset.id)
    const recipe = allRecipes.find(r => r.id === recipeId)
    if (!recipe) return
    recipe.isFavorite = !recipe.isFavorite
    favButton.classList.toggle("active", recipe.isFavorite)
    localStorage.setItem("allRecipes", JSON.stringify(allRecipes))
    if (showFavoritesOnly) updateRecipes()
    return
  }

  const recipeCard = event.target.closest(".recipe-card")
  if (recipeCard) {
    const url = recipeCard.dataset.url
    if (url) window.open(url, "_blank", "noopener noreferrer")
  }
})

//Initial fetch
fetchData()





