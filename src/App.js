import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import MainApp from './MainApp'
import Auth from './Auth'

import './styles.css'

class App extends Component {
    render() {
        return this.props.userProfile.isLoggedIn
            ? <MainApp />
            : <Auth />
    }
}

export default inject('userProfile')(observer(App))
