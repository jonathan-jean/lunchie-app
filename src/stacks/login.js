import React from 'react';
import {
    createStackNavigator
} from 'react-navigation';

import Login from '../screens/login';

const LoginStack = createStackNavigator({
    Login: {
        screen: Login,
    },
}, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
});

export default LoginStack;