import State from './State.js'

const scrollManager = {
    toggleScroll() {
        if (State.scrollLock) {
            document.body.classList.add('no-scroll')
        } else {
            document.body.classList.remove('no-scroll')
        }
    },
    scrollToBottom(id) {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
}

export default scrollManager