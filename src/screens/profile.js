import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  AsyncStorage
} from 'react-native';
import { cacheFonts } from '../helpers/AssetsCaching';
import { Button } from "react-native-elements"
import colors from '../config/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const IMAGE_SIZE = SCREEN_WIDTH - 80;

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      user: {}
    };

    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {

    AsyncStorage.getItem('@lunchie:session').then((data) => {
      const session = JSON.parse(data);
      if (session) {
        this.setState({ user: session.user });
      }
    })
    .catch(err => {
      // user not logged in
    });

    await cacheFonts({
      georgia: require('../../assets/fonts/Georgia.ttf'),
      regular: require('../../assets/fonts/Montserrat-Regular.ttf'),
      light: require('../../assets/fonts/Montserrat-Light.ttf'),
      bold: require('../../assets/fonts/Montserrat-Bold.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  async logout() {
    await AsyncStorage.removeItem('@lunchie:session');

    const { navigate } = this.props.navigation;

    navigate("Login");
  }

  render() {
    const { user } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        {this.state.fontLoaded && user ? (
          <View style={{ flex: 1 }}>
            <View style={styles.statusBar} />
            <View style={styles.navBar}>
              <Text style={styles.nameHeader}>{ user.name }</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{
                    uri:
                      'http://i.pravatar.cc/400?u=' + user.name,
                  }}
                  style={{
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    borderRadius: 10,
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginTop: 20,
                  marginHorizontal: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 26,
                    color: colors.primary,
                    fontFamily: 'bold',
                  }}
                >
                  { user.name }
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  width: SCREEN_WIDTH - 80,
                  marginLeft: 40,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: colors.primary,
                    fontFamily: 'regular',
                  }}
                >
                  { user.email }
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  width: SCREEN_WIDTH - 80,
                  marginLeft: 40,
                }}
              >
              <Button
                title="Logout"
                buttonStyle={{
                  backgroundColor: colors.primary,
                }}
                titleStyle={{
                  fontWeight: 'bold'
                }}
                onPress={this.logout}
              />
              </View>
              
            </ScrollView>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: 10,
  },
  navBar: {
    height: 60,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignContent: 'center',
  },
  nameHeader: {
    color: colors.primary,
    fontSize: 22,
    textAlign: 'center',
  },
  infoTypeLabel: {
    fontSize: 15,
    textAlign: 'right',
    color: 'rgba(126,123,138,1)',
    fontFamily: 'regular',
    paddingBottom: 10,
  },
  infoAnswerLabel: {
    fontSize: 15,
    color: colors.primary,
    fontFamily: 'regular',
    paddingBottom: 10,
  },
});
