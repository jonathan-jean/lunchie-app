import React from 'react';
import { createStackNavigator } from 'react-navigation';

import colors from '../config/colors';
import Search from '../screens/search';
import Lunch from '../screens/lunch';

const SearchStack = createStackNavigator(
  {
    Search: {
      screen: Search,

      navigationOptions: ({ navigation }) => ({
        title: 'Search',
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.title,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }),
    },
    Lunch: {
      screen: Lunch,

      navigationOptions: ({ navigation }) => ({
        title: 'Lunch',
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.title,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }),
    },
  }
);

export default SearchStack;
