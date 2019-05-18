/**
 * @format
 */
import React from "react"
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./src/reducers";
import { watcherSaga,workerSaga } from "./src/sagas/apisaga";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";
import ModelContext from "./src/components/ModelContext"
const sagaMiddleware = createSagaMiddleware();

let store = createStore(
    reducers,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(watcherSaga)

const Application = (props)=> <Provider store={store}>
    <ModelContext>
        <App />
    </ModelContext>
</Provider>

AppRegistry.registerComponent(appName, () => Application);
