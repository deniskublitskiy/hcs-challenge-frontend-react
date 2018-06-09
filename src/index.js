import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react'

import App from './App';
import TodoList from './Todos/models/TodoList'
import UserProfile from './models/UserProfile'
import DataLayer from './DataLayer'

import registerServiceWorker from './registerServiceWorker';

const dataLayer = new DataLayer(process.env.REACT_APP_API_URL)
const todoList = new TodoList(dataLayer)
const userProfile = new UserProfile(dataLayer)

ReactDOM.render(
    <Provider todoList={todoList} userProfile={userProfile}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
