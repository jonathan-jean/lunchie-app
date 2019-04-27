import React from 'react';
import { createStackNavigator } from 'react-navigation';

import Lunches from '../screens/lunches';
import Lunch from '../screens/lunch';
import colors from '../config/colors';
import NewLunch from '../screens/new_lunch';

const LunchStack = createStackNavigator(
  {
    Lunches: {
      screen: Lunches,

      navigationOptions: ({ navigation }) => ({
        title: 'Scheduled lunches',
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
    NewLunch: {
      screen: NewLunch,

      navigationOptions: ({ navigation }) => ({
        title: 'Create lunch',
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

export default LunchStack;
