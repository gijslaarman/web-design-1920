import State from "./State.js"

// Catch key presses.
// window.addEventListener('keypress', function (event) {
// 	switch (event.code) {
// 		case 'Space':
// 			event.preventDefault()
// 			handleSpacebar()
// 			break
// 		default:
// 			// If the key pressed is not space
// 			return
// 	}
// })

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

const controlPanel = document.getElementById('controls')