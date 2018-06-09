import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/es/CircularProgress/CircularProgress'

import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import './styles.css'

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1)

class SignInUp extends Component {
    state = {
        isSignIn: true,
        name: '',
        password: '',
        errors: {},
    }

    validateAll = () => {
        return ['name', 'password'].map(field => this.validate(field, this.state[field])).every(result => result)
    }

    validatePassword = (value) => {
        const length = value.trim().length

        if (length === 0) {
            return 'Field is required'
        }

        if (length <= 6) {
            return 'Length must be greater than 6'
        }

        return null
    }
    validateName = value => this.validatePassword(value)

    validate = (field, value) => {
        const validatorFuncName = `validate${capitalizeFirstLetter(field)}`
        const validator = this[validatorFuncName]

        if (validator) {
            const result = validator(value)
            this.setState(state => ({
                errors: {
                    ...state.errors,
                    [field]: result,
                },
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

    onSubmit = (e) => {
        e.preventDefault()

        if (!this.validateAll()) {
            return
        }

        this.props.onSubmit(this.state, this.state.isSignIn)

        this.setState({
            name: '',
            password: '',
        })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (Object.keys(nextProps.signInErrors).length) {
            this.setState({ errors: { ...nextProps.signInErrors }})
        }

        if (Object.keys(nextProps.signUpErrors).length) {
            this.setState({ errors: { ...nextProps.signUpErrors }})
        }
    }

    toggleSignInUp = () => {
        this.setState(state => ({
            errors: {},
            name: '',
            password: '',
            isSignIn: !state.isSignIn,
        }))
    }

    render() {
        const { errors } = this.state

        return <form onSubmit={this.onSubmit}>
            <Paper className="auth-form">
                {
                    this.props.isLoading
                        ? <div className="auth-form-loader-container">
                            <CircularProgress />
                        </div>
                        : <Fragment>
                            <Typography align="center" variant="title">
                                {this.state.isSignIn ? 'Sign in' : 'Sign up'}
                            </Typography>
                            <FormControl margin="dense" error={!!errors.name}>
                                <InputLabel htmlFor="name" shrink>Name</InputLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                    autoComplete="false"
                                />
                                {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
                            </FormControl>
                            <FormControl margin="dense" error={!!errors.password}>
                                <InputLabel htmlFor="password" shrink>Password</InputLabel>
                                <Input
                                    id="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    autoComplete="false"
                                    type="password"
                                />
                                {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                            </FormControl>
                            <br />
                            <Button
                                variant="contained"
                                color={this.state.isSignIn ? 'primary' : 'secondary'}
                                type="submit"
                            >
                                {this.state.isSignIn ? 'Sign in' : 'Sign up'}
                                <ExitToAppIcon />
                            </Button>
                            <br />
                            <div className="change-auth-type-link">
                            {
                                this.state.isSignIn
                                    ? <Fragment>
                                        Has no account? <a onClick={this.toggleSignInUp}>Sign up</a>
                                    </Fragment>
                                    : <Fragment>
                                        Already has account? <a onClick={this.toggleSignInUp}>Sign in</a>
                                    </Fragment>
                            }
                            </div>
                        </Fragment>
                }
            </Paper>
        </form>
    }
}

SignInUp.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    signInErrors: PropTypes.object,
    signUpErrors: PropTypes.object,
}


export default SignInUp
