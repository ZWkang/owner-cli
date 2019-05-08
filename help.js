const isPromise = (promise) => 'function' ===  (typeof promise.then)

module.exports = {
    to: (promise) => {
        if (!isPromise(promise)) return Promise.reject(new TypeError(`not a promise`))

        return promise.then(v => {
            return [null, v]
        }).catch(e => {
            return [e]
        })
    }
}