import init from './js/init.js'
import transcriptManager from './js/transcriptManager.js'
export var images = []

// Start initialization of page.
init()

// Disable scroll restoration, it messes with the scroll lock & sets the page weirdly halfway making the startscreen look odd.
if ('scrollRestoration' in history) {
	history.scrollRestoration = 'manual'
}

// If there's a hash in the the URL make sure that the scroll lock is gone & scroll to this section.
if (window.location.hash) {
	toggleScroll()
} else {
	window.scrollTo(0, 0)
}

// When start button is pressed start podcast.
document.querySelector('[hook_start]').addEventListener('click', transcriptManager.startPodcast)