import React from 'react';
import { createStackNavigator } from 'react-navigation';

import Profile from '../screens/profile';
import colors from '../config/colors';

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,

      navigationOptions: ({ navigation }) => ({
        title: 'Profile',
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

export default ProfileStack;
