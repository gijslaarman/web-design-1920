import State from "./State.js"
import { images } from "../script.js"
import scrollManager from "./scrollManager.js"
import transcriptManager from "./transcriptManager.js"

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

async function loadPodcast() {
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
}

function init() {
    // Add listeners to state objects, on change do this function.
    const stateListeners = {
        'scrollLock': function () { scrollManager.toggleScroll() },
        'autoplay': function () { transcriptManager.startMessageRotation() }
    }

    const keys = Object.keys(stateListeners)
    const values = Object.values(stateListeners)

    keys.forEach((listener, i) => State.addListener(listener, values[i]))

    console.log(State)
    loadPodcast()
}

export default init