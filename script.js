function createPerson(person) {
	return `
	<li>
		<img src="${person.img}" alt="Foto van ${person.name}"/>
		<div>
			<h3>${person.name}</h3>
			<h4>${person.subtitle}</h4>
		</div>
	</li>`
}

fetch(window.location.origin + '/podcast.json').then(res => res.json())
.then(podcast => {
	const h1 = document.querySelector('h1')
	h1.innerText = podcast.title

	podcast.summary.forEach(paragraph => document.querySelector('#summary').insertAdjacentHTML('beforeend', `<p>${paragraph}</p>`))

	podcast.hosts.forEach(host => {
		document.getElementById(host.role).insertAdjacentHTML('beforeend', createPerson(host))
	})
})

const State = new StateManager({
	scrollLock: true,
	autoplay: false,
	started: false
})
var start = document.querySelector('button')

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

(function stateInit() {
	// State initilization
	const stateListeners = {
		'scrollLock': function() { toggleScroll() },
		'autoplay': function() { console.log('Toggle Autoplay', State.autoplay) }
	}

	const keys = Object.keys(stateListeners)
	const values = Object.values(stateListeners)

	keys.forEach((listener, i) => State.addListener(listener, values[i]))
})()

function toggleScroll() {
    document.body.classList.remove('no-scroll')
}

// Event Listeners
window.addEventListener('keypress', function (event) {
    switch (event.code) {
        case 'Space':
			event.preventDefault()
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
    State.scrollLock = false
    document.getElementById('hosts').scrollIntoView({
        behavior: 'smooth'
    })
}

function handleSpacebar() {
	// Toggle autoplay
	if (State.autoplay) {
		State.autoplay = false
	} else {
		State.autoplay = true
	}
}