import { decorate, observable } from 'mobx'
import forEach from 'lodash/forEach'
import pick from 'lodash/pick'
import { toJS } from 'mobx'

class User {

    constructor(props) {
        forEach(
            pick(props, Object.getOwnPropertyNames(this)),
            (value, key) => {
                this[key] = value
            },
        )
    }

    id
    name = ''
    password

    toJSON() {
        return toJS(this)
    }
}

export default decorate(User, {
    name: observable,
    password: observable,
})
