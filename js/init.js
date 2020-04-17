import { State } from "../script.js"

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
    const fetch = fetch(window.location.origin + '/podcast.json')
    const podcast = await fetch.json()
    const h1 = document.querySelector('h1')
    h1.innerText = podcast.title

    podcast.summary.forEach(paragraph => document.querySelector('#summary')
    .insertAdjacentHTML('beforeend', `<p>${paragraph}</p>`))

    podcast.hosts.forEach(host => {
        document.getElementById(host.role).insertAdjacentHTML('beforeend', createPerson(host))
    })

    State.hosts = podcast.hosts
    return State.transcript = podcast.transcript
}

function init() {
    loadPodcast()
}

export default init