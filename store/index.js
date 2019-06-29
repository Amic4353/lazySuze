import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import diners from './reducer/diners'
import receipt from './reducer/receipt'

const reducer = combineReducers({
  diners,
  receipt,
})

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)

const store =
  process.env.NODE_ENV === 'production'
    ? createStore(reducer, applyMiddleware(thunkMiddleware))
    : createStore(reducer, middleware)

export default store
