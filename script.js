// Get elements from HTML
const filterButtons = document.querySelectorAll(".btn-filter")
const sortButtons = document.querySelectorAll(".btn-sort")
const randomButtons = document.getElementById("randomBtn")
const userSelection = document.getElementById("userSelection")

// Messages for kitchen
const filterMessages = {
  italian: "How about spaghetti carbonara?",
  thai: "Maybe some Pad Thai?",
  mexican: "Up for spicy?",
  korean: "Cold noodles are popular on TikTok"
}

// Messages for sort
const sortMessages = {
  ascending: "Are you in a hurry?",
  descending: "Nice, let's take it chill"
}

//Messages for surprise me
const surpriseMessages = [
  "🍣 Sushi bowl",
  "🍝 Creamy chicken pasta",
  "🌮 Beef tacos",
  "🍛 Vegan curry",
  "🥪 BBQ pulled pork sandwich",
  "🥚 Shakshuka",
  "🥗 Greek salad",
  "🍜 Ramen noodles",
  "🍫 Chocolate lava cake"
]

let selectedFilters = [] // All chosen filter-btns
let selectedSort = null // Chosen sort-method


const updateUserSelection = () => {
  console.log("Updating user selection")
  let messages = []

  // Add message for chosen filter
  if (selectedFilters.length > 0) {
    selectedFilters.forEach(f => {
      if (filterMessages[f]) messages.push(filterMessages[f])
    })
  }

  // Add message for chosen sort
  if (selectedSort) {
    messages.push(sortMessages[selectedSort])
  }

  // Show message or empty the text if nothing is chosen
  if (messages.length === 0) {
    userSelection.textContent = ""

  } else {
    userSelection.innerHTML = messages.join("<br>")
  }

  console.log("Current messages:", messages)
  console.log("Selected filters:", selectedFilters)
  console.log("Selected sort:", selectedSort)
}


//Eventlistener
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value

    //If "All" is chosen -> clear everything else
    if (value === "all") {
      console.log("All button clicked = clear filters")

      filterButtons.forEach(btn => btn.classList.remove("selected"))
      button.classList.add("selected")
      selectedFilters = []
      randomButtons.classList.remove("selected")
      userSelection.textContent = "You seem to like everything — why not try the 'Surprise Me' button?"

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

        // Add filter if not chosen
        if (selectedFilters.includes(value) === false) {
          selectedFilters.push(value);
        }

      } else {
        // Remove filter when unclicked
        selectedFilters = selectedFilters.filter(f => f !== value);
      }

      console.log("Updated selected filters:", selectedFilters)
    }
    updateUserSelection()
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
    updateUserSelection()
  })
})

randomButtons.addEventListener("click", () => {
  randomButtons.classList.toggle("selected")

  // Deselect all kitchen filters
  filterButtons.forEach(btn => btn.classList.remove("selected"))

  //Clear internal filter selection
  selectedFilters = []

  const randomIndex = Math.floor(Math.random() * surpriseMessages.length)
  const randomMessage = surpriseMessages[randomIndex]

  console.log("Random selection:", randomMessage)

  userSelection.innerHTML = `🎉 Surprise! How about: <strong>${randomMessage}</strong>?`
})




