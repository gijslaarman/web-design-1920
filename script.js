const start = document.querySelector('[HOOK_START]')

// Event Listeners
window.addEventListener('keypress', function (event) {
    switch (event.code) {
        case 'Space':
            handleSpacebar()
            break
        default:
            // If the key pressed is not space
            return
    }
})

start.addEventListener('click', startPodcast)


// Functions
function startPodcast() {
    const startScreen = document.querySelector('.start')

    startScreen.classList.add('animate')
}

function handleSpacebar() {
    // Toggle autoplay
}