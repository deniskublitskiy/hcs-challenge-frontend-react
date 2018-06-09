import { decorate, observable } from 'mobx'
import get from 'lodash/get'
import User from './User'

class UserProfile {
    user = new User()
    isLoggedIn = !!localStorage.getItem('token')
    dataLayer
    isLoading
    signUpErrors = {}
    signInErrors = {}

    constructor(dataLayer) {
        this.dataLayer = dataLayer
    }

    async loadUser() {
        try {
            const user = await this.dataLayer.fetchUser()
            this.user = observable(new User(user))
        } catch (e) {
            console.error(e)
        }
    }

    async logOut() {
        localStorage.removeItem('token')
        // eslint-disable-next-line no-restricted-globals
        location.reload()
    }

    signIn = async (props) => {
        this.isLoading = true
        this.signInErrors = {}

        try {
            const { token } = await this.dataLayer.signIn(new User(props))
            localStorage.setItem('token', token)
            this.isLoggedIn = true
        } catch (e) {
            console.error(e)

            switch (get(e, 'errors.0.code')) {
                case 'INVALID_NAME':
                    this.signInErrors = { name: 'Invalid name'}
                    break;
                case 'INVALID_PASSWORD':
                    this.signInErrors = { password: 'Invalid password'}
                    break;
                default:
            }
        }

        this.isLoading = false
    }

    signUp = async (props) => {
        this.isLoading = true
        this.signUpErrors = {}

        try {
            const { token } = await this.dataLayer.signUp(new User(props))
            localStorage.setItem('token', token)
            this.isLoggedIn = true
        } catch (e) {
            console.error(e)
            this.signUpErrors = get(e, 'errors.0.code') === 'DUPLICATE_ERROR' ? {name: 'User with current name already exists'} : {}
        }

        this.isLoading = false
    }
}

export default decorate(UserProfile, {
    user: observable,
    isLoggedIn: observable,
    isLoading: observable,
    signUpErrors: observable,
    signInErrors: observable,
})
