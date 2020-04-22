import { State } from "../script.js";
function scrollToBottom(id) {
	document.getElementById(id).scrollIntoView({behavior: 'smooth', block: 'end'})
}

function messageTemplate(message) {
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

	if (message.pause) {
		transcript.insertAdjacentHTML('beforeend', `<div class="pause"></div>`)
	} else {
		transcript.insertAdjacentElement('beforeend', messageTemplate(message))
	}
	State.previousTalking = message.talking
	return scrollToBottom('transcript')
}

export function startMessageRotation() {
	if (State.currentMessage < State.transcript.length && State.autoplay) { // Check if there are still messages, and autoplay is on.
		const thisMessage = State.transcript[State.currentMessage]
		let wordCount

		if (thisMessage.pause) { // If this message is a pause block, then timeout the rotation for this amount of time.
			wordCount = thisMessage.pause / State.wordSpeed
		} else {
			wordCount = thisMessage.message.split(' ').length
		}

		pushMessage(thisMessage)
		console.log('wordCount:' + wordCount, thisMessage)

		State.currentMessage++ // Add up one to currentMessage
		setTimeout(() => {
			startMessageRotation()
		}, wordCount * State.wordSpeed);
	}
}