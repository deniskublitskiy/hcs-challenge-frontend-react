import { observable, decorate, toJS } from 'mobx'
import forEach from 'lodash/forEach'
import pick from 'lodash/pick'
import uuidv4 from 'uuid/v4'

class Todo {

    constructor(props) {
        forEach(
            pick(props, Object.getOwnPropertyNames(this)),
            (value, key) => {
                this[key] = value
            },
        )
    }

    id = uuidv4()
    isSaved = true

    title
    description
    dueDate
    isDone

    toJSON() {
        return toJS(this)
    }
}

export default decorate(Todo, {
    id: observable,
    isSaved: observable,
    title: observable,
    description: observable,
    dueDate: observable,
    isDone: observable,
})