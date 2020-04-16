class StateManager {
    constructor(stateObj = {}) {
        if (stateObj) return this.init(stateObj)
    }

    addListener(key, fn) {
         if (this[`${key}Internal`] == undefined) throw new Error('No such key found.')
         this[`${key}Internal`].listener = fn
    }

    addNew(key, value) {
        this[key + 'Internal'] = {}
        this[key + 'Internal'].value = value
        this[key + 'Internal'].listener = function() {}

        
        // Define getter & setter
        Object.defineProperty(this, key, {
            set(x) {
                this[key + 'Internal'].value = x
                this[key + 'Internal'].listener()
            },
            get() { return this[key + 'Internal'].value }
        })

        if (arguments[2] && typeof arguments[2] === 'function') {
            this.addListener(key, arguments[2])
        }
    }

    set(x) {
        return Error(`Please use Object.addNew('${x}', value, function) to add new keys.`)
    }

    init(stateObj) {
        const keys = Object.keys(stateObj)
        const values = Object.values(stateObj)
        keys.forEach((key, i) => this.addNew(key, values[i]))
    }
}
