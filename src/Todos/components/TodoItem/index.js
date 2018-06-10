import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import moment from 'moment'

import Paper from '@material-ui/core/Paper'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import DeleteIcon from '@material-ui/icons/Delete'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import './styles.css'

const TodoItem = (props) => {
    const { todo } = props

    return <Paper elevation={2} component="li">
        <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" className="todo-title">
                    {todo.title}
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Typography>
                    {todo.description}
                </Typography>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
                <Fragment>
                    <Typography align="left">
                        {moment(todo.dueDate).format('LLL')}
                    </Typography>
                    {
                        todo.isSaved
                            ? <IconButton
                                aria-label="Delete"
                                color="secondary"
                                onClick={() => props.onDelete(todo.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                            : <CircularProgress size={25}/>
                    }
                </Fragment>
            </ExpansionPanelActions>
        </ExpansionPanel>
    </Paper>
}

TodoItem.propTypes = {
    todo: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        dueDate: PropTypes.string,
        isSaved: PropTypes.bool,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default observer(TodoItem)
