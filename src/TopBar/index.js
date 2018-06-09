import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'

import ExitToAppIcon from '@material-ui/icons/ExitToApp'

class TopBar extends Component {

    logOut = () => this.props.userProfile.logOut()

    render() {
        const { user } = this.props.userProfile

        return <AppBar position="static">
            <Toolbar>
                <Typography variant="title" color="inherit" style={{flex: 1}}>
                    HCS test
                </Typography>
                <Typography variant="subheading" color="inherit">
                    {user.name}
                </Typography>
                <Avatar style={{margin: '0 5px 0 20px'}}>
                    {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                <IconButton color="inherit" onClick={this.logOut}>
                    <ExitToAppIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    }
}

TopBar.defaultProps = {
    userProfile: PropTypes.shape({
        user: PropTypes.shape({
            name: PropTypes.string,
        }),
        logOut: PropTypes.func.isRequired,
    }),
}

export default observer(TopBar)