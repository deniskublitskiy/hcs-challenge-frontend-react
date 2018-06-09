import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import TodoList from '../Todos/components/TodoList'
import TopBar from '../TopBar'

class MainApp extends Component {
    componentDidMount() {
        this.props.userProfile.loadUser()
    }

    render() {
        return <Fragment>
            <TopBar userProfile={this.props.userProfile}/>
            <TodoList/>
        </Fragment>
    }
}

TopBar.defaultProps = {
    userProfile: PropTypes.shape({
        loadUser: PropTypes.func.isRequired,
    }),
}

export default inject('userProfile')(observer(MainApp))
