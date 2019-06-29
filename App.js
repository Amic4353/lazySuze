import React from 'react';
// import './App.css';
import { Provider } from 'react-redux';
import AppContainer from './AppNavigator';
import store from './store';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
