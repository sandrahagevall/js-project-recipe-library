console.log("Hello js")

//Get element
const filterButtons = document.querySelectorAll(".btn-filter")
const sortButtons = document.querySelectorAll(".btn-sort")
const randomButtons = document.getElementById("randomBtn")
const userSelection = document.getElementById("userSelection")
//Messages for kitchen filter
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

let selectedFilters = []
let selectedSort = null

const updateUserSelection = () => {
  let messages = []

  if (selectedFilters.length > 0) {
    selectedFilters.forEach(f => {
      if (filterMessages[f]) messages.push(filterMessages[f])
    })
  }

  if (selectedSort) {
    messages.push(sortMessages[selectedSort])
  }

  if (messages.length === 0) {
    userSelection.textContent = ""
  } else {
    userSelection.innerHTML = messages.join("<br>")
  }
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value

    if (value === "all") {
      filterButtons.forEach(btn => btn.classList.remove("selected"))

      button.classList.add("selected")
      selectedFilters = []
      userSelection.textContent = "You like everything, maybe try choosing the surprise me button?"
      console.log(userSelection.textContent)
      return

    } else {
      const allButton = document.querySelector('.btn-filter[data-value="all"]')
      allButton.classList.remove("selected")

      button.classList.toggle("selected")

      selectedFilters = Array.from(filterButtons)
        .filter(btn => btn.classList.contains("selected"))
        .map(btn => btn.dataset.value)

      if (selectedFilters.length === 0) {
        userSelection.textContent = ""

      } else {
        const messages = selectedFilters.map(f => filterMessages[f]).filter(Boolean)

        userSelection.innerHTML = messages.join("<br>")
      }
    }
    updateUserSelection()
  })
})

sortButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (selectedSort === button.dataset.value) {
      selectedSort = null
      button.classList.remove("selected")
    } else {
      selectedSort = button.dataset.value
      sortButtons.forEach(btn => btn.classList.remove("selected"))
      button.classList.add("selected")
    }
    updateUserSelection()
  })
})

randomButtons.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * surpriseMessages.length)
  const randomMessage = surpriseMessages[randomIndex]
  userSelection.innerHTML = `🎉 Surprise! How about: <strong>${randomMessage}</strong>?`
})




