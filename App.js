import React, { Component } from "react";
import { Platform, StatusBar, StyleSheet, View, } from 'react-native';
import { AppLoading, Asset, Font, Icon} from 'expo';

import AuthStore from './stores/AuthStore'
import {mapState} from './stores/MapStore'
import {Suggession} from './stores/SuggesionStore'
import {RideState} from "./stores/RideStore"
import ModelContext from "./components/ModelContext"
import { observable, action, computed, extendObservable, KeepAwake } from "mobx";
import { Provider, inject, observer } from "mobx-react";
import ApplicationState from "./stores/Application.State.Mobx";
import {NavigationContextProvider} from "./navigation/NavigationContext"
/*import {
  Navigator
} from './navigation'
*/

import {AppWithLocalization} from "./navigation"

const stores = {
  ApplicationState,
  auth:AuthStore,
  map:mapState,
  suggession:Suggession,
  rides:RideState
}

console.disableYellowBox = true;

@observer
export default class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      loaded:false
    }
  }
  async componentDidMount() {
     await this._loadResourcesAsync()
     this.setState({loaded:true})

  }
  
  render() {
    const {loaded} = this.state
    if (loaded) {
      return (
        <Provider {...stores}>
          <NavigationContextProvider>
                <ModelContext>
                  {/* <Navigator /> */}
                  <AppWithLocalization />
                </ModelContext>
          </NavigationContextProvider>
        </Provider>
      )
    } else {
      return <AppLoading />
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
        //    require('./assets/translate.json'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'GothamMedium': require('./assets/fonts/GothamMedium.ttf'),
        'GothamBold': require('./assets/fonts/GothamBold.ttf')
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
