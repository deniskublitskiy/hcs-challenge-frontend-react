import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'
import Tooltip from '@material-ui/core/Tooltip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import ExitToAppIcon from '@material-ui/icons/ExitToApp'

class TopBar extends Component {

    state = {
        logOutAnchorEl: null
    }

    logOut = () => {
        this.closeLogOutMenu()
        this.props.userProfile.logOut()
    }

    logOutFromAllDevices = () => {
        this.closeLogOutMenu()
        this.props.userProfile.logOutFromAllDevices()
    }

    openLogOutMenu = (e) => {
        this.setState({
            logOutAnchorEl: e.currentTarget,
        })
    }

    closeLogOutMenu = () => {
        this.setState({
            logOutAnchorEl: null,
        })
    }

    render() {
        const { user } = this.props.userProfile
        const { logOutAnchorEl } = this.state

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
                <Tooltip title="Logout">
                    <IconButton color="inherit" onClick={this.openLogOutMenu}>
                        <ExitToAppIcon/>
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={logOutAnchorEl}
                    open={Boolean(logOutAnchorEl)}
                    onClose={this.closeLogOutMenu}
                >
                    <MenuItem onClick={this.logOut}>Logout</MenuItem>
                    <MenuItem onClick={this.logOutFromAllDevices}>Logout from all devices</MenuItem>
                </Menu>
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
        logOutFromAllDevices: PropTypes.func.isRequired,
    }),
}

export default observer(TopBar)