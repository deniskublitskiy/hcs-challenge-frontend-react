import { decorate, observable } from 'mobx'
import Todo from './Todo'

class TodoList {
    todos = []
    dataLayer
    isLoading

    constructor(dataLayer) {
        this.dataLayer = dataLayer
    }

    async loadTodos() {
        this.isLoading = true

        const todos = await this.dataLayer.fetchTodos()
        this.todos.push(...todos.map(todo => new Todo(todo)))

        this.isLoading = false
    }

    async createTodo(props) {
        let todo = new Todo({...props, isSaved: false})

        try {
            this.todos.unshift(todo)
            const createdTodo = await this.dataLayer.createTodo(todo)
            this._deleteById(todo.id, new Todo(createdTodo))

        } catch (e) {
            console.error(e)
            this._deleteById(todo.id)
        }
    }

    async deleteTodo(id) {
        try {
            this._deleteById(id)
            await this.dataLayer.deleteTodo(id)
        } catch(e) {
            console.error(e)
        }
    }

    async deleteAllTodos() {
        const todos = this.todos.splice(0, this.todos.length)

        try {
            await this.dataLayer.deleteAllTodos()
        } catch(e) {
            console.error(e)
            this.todos.push(...todos)
        }
    }

    _deleteById(id, ...todos) {
        const index = this.todos.findIndex(x => x.id === id)
        if (Number.isInteger(index)) {
            this.todos.splice(index, 1, ...todos)
        }
    }
}

export default decorate(TodoList, {
    todos: observable,
    isLoading: observable,
})
