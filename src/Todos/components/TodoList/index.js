import React, { Component, Fragment } from 'react'
import PropType from 'prop-types'
import { inject, observer } from 'mobx-react'
import debounce from 'lodash/debounce'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'

import TodoItem from '../TodoItem'

import './styles.css'

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

class TodoList extends Component {

    state = {
        title: '',
        description: '',
        dueDate: '',
        errors: {},
        isDeleteAllConfirmationOpen: false,
    }

    async componentDidMount() {
        await this.props.todoList.loadTodos()
    }

    get todos() {
        const { todos } = this.props.todoList
        return todos.length
            ? todos.map(todo => <TodoItem key={todo.id} todo={todo} onDelete={this.deleteTodo} />)
            : <Paper className="no-tasks-container">
                No tasks yet...
            </Paper>
    }

    get loader() {
        return <div className="loader-container">
            <CircularProgress size={50} />
        </div>
    }

    deleteTodo = (id) => {
        this.props.todoList.deleteTodo(id)
    }

    deleteAllTodos = () => {
        this.props.todoList.deleteAllTodos()
    }

    createTodo = (e) => {
        e.preventDefault()

        if (!this.validateAll()) {
            return
        }

        this.props.todoList.createTodo(this.state)

        this.setState({
            title: '',
            description: '',
            dueDate: '',
        })
    }

    validateAll = () => {
        return ['title', 'description', 'dueDate'].map(field => this.validate(field, this.state[field])).every(result => result)
    }

    validateTitle = (value) => value.trim().length <= 6 ? 'Length must be greater than 6' : null
    validateDescription = (value) => value.trim().length <= 10 ? 'Length must be greater than 10' : null
    validateDueDate = value => isNaN(new Date(value)) ? 'Required field' : null


    validate = (field, value) => {
        const validatorFuncName = `validate${capitalizeFirstLetter(field)}`;
        const validator = this[validatorFuncName];

        if (validator) {
            const result = validator(value)
            this.setState(state => ({
                errors: {
                    ...state.errors,
                    [field]: result,
                }
            }))
            return !result
        }

        return true
    }

    validateDebounced = debounce(this.validate, 500)

    handleChange = (e) => {
        const { name, value } = e.target

        this.setState({
            [name]: value,
        }, this.validateDebounced.bind(null, name, value))
    }

    toggleDeleteAllTodosConfirmation = () => {
        this.setState(state => ({
            isDeleteAllConfirmationOpen: !state.isDeleteAllConfirmationOpen,
        }))
    }

    handleDeleteAllCancel = () => {
        this.toggleDeleteAllTodosConfirmation()
    }

    handleDeleteAllConfirm = () => {
        this.toggleDeleteAllTodosConfirmation()
        this.deleteAllTodos()
    }

    get deleteAllConfirmationDialog() {
        return <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            open={this.state.isDeleteAllConfirmationOpen}
        >
            <DialogTitle>
                Confirm action
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete all tasks?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleDeleteAllCancel} variant="contained" color="secondary">
                    No
                </Button>
                <Button onClick={this.handleDeleteAllConfirm} color="primary">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    }

    render() {

        const { errors } = this.state

        return <div className="todo-list-container">
            <form onSubmit={this.createTodo}>
                <Paper className="todo-list-new-form" elevation={2}>
                    <Typography
                        align="center"
                        variant="title"
                    >
                        New tasks
                    </Typography>
                    <FormControl margin="dense" error={!!errors.title}>
                        <InputLabel htmlFor="title" shrink>Title</InputLabel>
                        <Input
                            id="title"
                            name="title"
                            value={this.state.title}
                            onChange={this.handleChange}
                            autoComplete="false"
                        />
                        { errors.title && <FormHelperText>{errors.title}</FormHelperText> }
                    </FormControl>
                    <FormControl margin="dense" error={!!errors.description}>
                        <InputLabel htmlFor="description" shrink>Description</InputLabel>
                        <Input
                            id="description"
                            name="description"
                            value={this.state.description}
                            multiline
                            rowsMax={4}
                            rows={2}
                            onChange={this.handleChange}
                            autoComplete="false"
                        />
                        { errors.description && <FormHelperText>{errors.description}</FormHelperText> }
                    </FormControl>
                    <FormControl margin="dense" error={!!errors.dueDate}>
                        <InputLabel htmlFor="dueDate" shrink>Due date</InputLabel>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            value={this.state.dueDate}
                            onChange={this.handleChange}
                            type="datetime-local"
                            autoComplete="false"
                        />
                        { errors.dueDate && <FormHelperText>{errors.dueDate}</FormHelperText> }
                    </FormControl>
                    <br />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Create
                        <CreateIcon />
                    </Button>
                    {
                        this.props.todoList.todos.length
                            ? <Fragment>
                                <br />
                                <Button
                                    onClick={this.toggleDeleteAllTodosConfirmation}
                                    variant="contained"
                                    color="secondary"
                                >
                                    Delete all
                                    <DeleteIcon />
                                </Button>
                            </Fragment>
                            : null
                    }
                </Paper>
            </form>
            <ul>
                {
                    this.props.todoList.isLoading
                        ? this.loader
                        : this.todos
                }
            </ul>
            {
                this.state.isDeleteAllConfirmationOpen && this.deleteAllConfirmationDialog
            }
        </div>
    }
}

TodoList.propTypes = {
    todoList: PropType.object.isRequired,
}

export default inject('todoList')(observer(TodoList))
