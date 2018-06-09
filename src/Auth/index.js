import React, { Component } from 'react'
import { observer } from 'mobx-react'

import SignInUp from './components/SignInUp'
import TopBar from '../TopBar'
import PropTypes from 'prop-types'
import { inject } from 'mobx-react/index'

class Auth extends Component {
    auth = (user, isSignIn) => {
        const { userProfile } = this.props

        if (isSignIn) {
            userProfile.signIn(user)
            return
        }

        userProfile.signUp(user)
    }

    render() {
        const { userProfile } = this.props

        return <SignInUp
            onSubmit={this.auth}
            isLoading={userProfile.isLoading}
            signUpErrors={userProfile.signUpErrors}
            signInErrors={userProfile.signInErrors}
        />
    }
}

TopBar.defaultProps = {
    userProfile: PropTypes.shape({
        signIn: PropTypes.func.isRequired,
        signUp: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        signUpErrors: PropTypes.object,
        signInErrors: PropTypes.object,
    }),
}

export default inject('userProfile')(observer(Auth))