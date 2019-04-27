import React from 'react';
import AppLoading from "./components/AppLoading";
import { View, Image, Dimensions } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import {cacheAssets,cacheFonts} from "./helpers/AssetsCaching";

import Main from './stacks/main';
import Login from './stacks/login';

const WINDOW_WIDTH = Dimensions.get('window').width;

const MainRoot = createAppContainer(createStackNavigator(
  {
    Login: {
      path: '/login',
      screen: Login,
    },
    Main: {
      path: '/',
      screen: Main,
    },
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
));

export default class AppContainer extends React.Component {
  state = {
    isReady: false,
  };s

  async initApp() {
    const imageAssets = cacheAssets([
      require("../assets/images/login.jpg"),
    ]);

    const fontAssets = cacheFonts({
      "FontAwesome": require("@expo/vector-icons/fonts/FontAwesome.ttf"),
      "Ionicons": require("@expo/vector-icons/fonts/Ionicons.ttf"),
      "Entypo": require("@expo/vector-icons/fonts/Entypo.ttf"),
      "SimpleLineIcons": require("@expo/vector-icons/fonts/SimpleLineIcons.ttf"),
      "MaterialIcons": require("@expo/vector-icons/fonts/MaterialIcons.ttf"),
    });

    await Promise.all([imageAssets, fontAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.initApp}
          onFinish={() => this.setState({ isReady: true })}
        />
      );
    }

    return <MainRoot />;
  }
}