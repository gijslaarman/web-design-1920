import StateManager from "./js/StateManager.js"
const controlPanel = document.getElementById('controls')
var images = []

controlPanel.querySelector('[autoplay_control]').addEventListener('click', function () {
	// Toggle play
	const buttonState = this.getAttribute('state')

	if (buttonState == 'play') {
		this.setAttribute('state', 'paused')
		State.autoplay = false
	} else {
		this.setAttribute('state', 'play')
		State.autoplay = true
	}
})

// State setup
const State = new StateManager({
	scrollLock: false,
	autoplay: false,
	transcript: [],
	started: false,
	hosts: [],
	wordSpeed: 150
})

function createPerson(person) {
	return `
	<li>
		<img style="border-color: ${person.color}" src="${person.img}" alt="Foto van ${person.name}"/>
		<div>
			<h3>${person.name}</h3>
			<h4>${person.subtitle}</h4>
		</div>
	</li>`
}

fetch(window.location.href + '/podcast.json').then(res => res.json())
	.then(podcast => {
		const h1 = document.querySelector('h1')
		h1.innerText = podcast.title

		podcast.summary.forEach(paragraph => document.querySelector('#summary').insertAdjacentHTML('beforeend', `<p>${paragraph}</p>`))

		podcast.hosts.forEach(host => {
			document.getElementById(host.role).insertAdjacentHTML('beforeend', createPerson(host))
		})

		State.hosts = podcast.hosts
		State.transcript = podcast.transcript

		// After all the data is fetched and filled in, start preloading the images of the podcast.
		podcast.transcript.forEach(block => {
			if (block.type === 'image') {
				// pre load image in state array
				const image = new Image()
				image.src = block.imageSrc

				images.push(image)
			}
		})

		console.log(images)
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
		'scrollLock': function () { toggleScroll() },
		'autoplay': function () { startMessageRotation() }
	}

	const keys = Object.keys(stateListeners)
	const values = Object.values(stateListeners)

	keys.forEach((listener, i) => State.addListener(listener, values[i]))
})()

function toggleScroll() {
	if (State.scrollLock) {
		document.body.classList.add('no-scroll')
	} else {
		document.body.classList.remove('no-scroll')
	}
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
	State.scrollLock = true
	// Expand transcript div, Scroll to the transcript part
	document.getElementById('transcript').classList.add('started')
	document.getElementById(this.getAttribute('link')).scrollIntoView({
		behavior: 'smooth'
	})

	document.getElementById('controls').classList.remove('hidden')

	// Tell the browser to start transforming the transcript into messages, after each other.
	// Keep track of what the currentMessage is in my state manager. (a global variable that serves as a session cache).
	State.addNew('currentMessage', 0)
	State.addNew('previousTalking', '')
	State.autoplay = true
}

function scrollToBottom(id) {
	document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'end' })
}

function addMessage(message) {
	const who = State.hosts.find(host => host.name === message.talking)

	const div = document.createElement('div')
	div.classList.add(typeof message.message)
	div.setAttribute('alignment', who.role)
	div.setAttribute('messageKey', State.currentMessage)

	if (State.previousTalking !== message.talking && typeof message.message === 'string') {
		const h5 = document.createElement('h5')
		h5.setAttribute('style', `color: ${who.color}`)
		h5.innerText = message.talking
		div.classList.add('marginTop')
		div.appendChild(h5)
	}

	if (typeof message.message === 'string') {
		const p = document.createElement('p')
		p.innerText = message.message
		div.appendChild(p)
	}

	return div
}

function pushMessage(message) {
	const transcript = document.getElementById('transcript')

	switch(message.type) {
		case 'message':
			transcript.insertAdjacentElement('beforeend', addMessage(message))
		break;
		case 'image':
			transcript.insertAdjacentHTML('beforeEnd', `<img src="${message.imageSrc}" §/>`)
		break;
		case 'pause':
			transcript.insertAdjacentHTML('beforeend', `<div class="pause"><div style="animation-duration: ${message.length}ms" class="loadbar"></div><p>${message.message ? message.message : 'ff pauze.' }</p></div>`)
		break;
		default:
			console.error('Message type not found!')
	}

	State.previousTalking = message.talking
	return scrollToBottom('transcript')
}

function getMessageDelay(message, multiplier) {
	let speed

	if (message.type === "pause" || message.type === "image") { // If this message is a pause block, then timeout the rotation for this amount of time.
		speed = message.length / State.wordSpeed
	} else {
		speed = message.message.split(' ').length
	}

	console.log('wordCount:' + speed, 'Delay:' + speed * State.wordSpeed * multiplier, message)
	return speed * State.wordSpeed * multiplier
}

function startMessageRotation() {
	if (State.currentMessage < State.transcript.length && State.autoplay) { // Check if there are still messages, and autoplay is on.
		const thisMessage = State.transcript[State.currentMessage]
		const nextMessage = State.transcript[State.currentMessage + 1]
		let multiplier = 1

		if (nextMessage && thisMessage.talking && nextMessage.talking && thisMessage.talking !== nextMessage.talking) {
			console.log('Added multiplier of 1.5 to next message')
			multiplier = 1.5
		}

		pushMessage(thisMessage)
		State.currentMessage++ // Add up one to currentMessage

		setTimeout(() => {
			startMessageRotation()
		}, getMessageDelay(thisMessage, multiplier));
	} else {
		// If can't autoplay don't scroll lock.
		State.scrollLock = false
	}
}