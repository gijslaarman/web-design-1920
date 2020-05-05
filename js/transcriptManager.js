import State from "./State.js"
import scrollManager from './scrollManager.js'

const transcriptManager = {}

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

	switch (message.type) {
		case 'message':
			transcript.insertAdjacentElement('beforeend', addMessage(message))
			break;
		case 'image':
			transcript.insertAdjacentHTML('beforeEnd', `<div class="margin-top"><img src="${message.imageSrc}" /></div>`)
			break;
		case 'pause':
			transcript.insertAdjacentHTML('beforeend', `<div class="pause"><div style="animation-duration: ${message.length}ms" class="loadbar"></div><p>${message.message ? message.message : 'ff pauze.'}</p></div>`)
			break;
		default:
			console.error('Message type not found!')
	}

	State.previousTalking = message.talking
	return scrollManager.scrollToBottom('transcript')
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

transcriptManager.startMessageRotation = function() {
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
			this.startMessageRotation()
		}, getMessageDelay(thisMessage, multiplier));
	} else {
		// If can't autoplay don't scroll lock.
		State.scrollLock = false
	}
}

transcriptManager.startPodcast = function() {
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

export default transcriptManager