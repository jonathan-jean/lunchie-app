import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import colors from '../config/colors';
import ProfileStack from './profile';
import LunchStack from './lunch';
import SearchStack from './search';

const Main = createBottomTabNavigator(
  {
    LunchStack: {
      screen: LunchStack,
      path: '/lunches',
      navigationOptions: {
        tabBarLabel: 'Lunches',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name={'food-fork-drink'}
            size={30}
            type="material-community"
            color={tintColor}
          />
        ),
      },
    },
    SearchStack: {
      screen: SearchStack,
      path: '/search',
      navigationOptions: {
        tabBarLabel: 'Search',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name={'magnify'}
            size={30}
            type="material-community"
            color={tintColor}
          />
        ),
      },
    },
    ProfileStack: {
      screen: ProfileStack,
      path: '/profile',
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name={'account'}
            size={30}
            type="material-community"
            color={tintColor}
          />
        ),
      },
    },
  },
  {
    initialRouteName: 'SearchStack',
    animationEnabled: false,
    swipeEnabled: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: colors.primary,
      showIcon: true,
    },
  }
);

export default Main;