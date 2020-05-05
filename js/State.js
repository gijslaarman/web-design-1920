import StateManager from './StateManager.js'

// Create a state
const State = new StateManager({
	scrollLock: false,
	autoplay: false,
	transcript: [],
	started: false,
	hosts: [],
	wordSpeed: 200
})

export default State