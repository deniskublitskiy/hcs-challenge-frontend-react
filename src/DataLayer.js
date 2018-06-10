import * as HttpStatus from 'http-status'

class DataLayer {

    constructor(url) {
        this.apiUrl = url
    }

    async post(path, body) {
        const headers = new Headers()

        headers.set('Content-Type', 'application/json')

        return this.fetch(path, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })
    }

    async delete(path) {
        return this.fetch(path, {
            method: 'DELETE',
        })
    }

    async fetch(path, options = {}) {
        const headers = options.headers || new Headers()
        const token = localStorage.getItem('token');

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }

        const response = await fetch(`${this.apiUrl}/${path}`, {
            ...options,
            headers,
        })

        let res = null
        const text = await response.text()

        try {
            res = JSON.parse(text)
        } catch(e) {
            res = text
        }

        if (response.status === HttpStatus.UNAUTHORIZED) {
            localStorage.removeItem('token')
            // eslint-disable-next-line no-restricted-globals
            location.reload()
        }

        if (!response.ok) {
            return Promise.reject(res)
        }

        return res
    }

    fetchTodos = () => this.fetch('tasks')
    createTodo = todo => this.post('tasks', todo)
    deleteTodo = id => this.delete(`tasks/${id}`)
    deleteAllTodos = () => this.delete(`tasks`)

    fetchUser = () => this.fetch('user')
    signIn = user => this.post('auth/signin', user)
    signUp = user => this.post('auth/signup', user)
    logOut = () => this.post('auth/logout')
}

export default DataLayer
