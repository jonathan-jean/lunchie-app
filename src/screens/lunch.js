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
  AsyncStorage,
  Alert
} from 'react-native';
import { cacheFonts } from '../helpers/AssetsCaching';
import { Button, ListItem } from "react-native-elements"
import colors from '../config/colors';
import api, { alertError } from '../config/api';
import moment from 'moment';
import TouchableScale from 'react-native-touchable-scale';
import {LinearGradient} from "../components/LinearGradient";

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH - 120;

export default class Lunch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      deleting: false,
      leaving: false,
      joining: false,
      confirming: false,
      user: {},
      lunch: this.props.navigation.state.params.lunch,
    };

    this.delete = this.delete.bind(this);
    this.refresh = this.refresh.bind(this);
    this.leave = this.leave.bind(this);
    this.join = this.join.bind(this);
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

  async refresh() {
    const l = this.state.lunch

    return api
    .get("/api/lunches/" + l.id)
  }

  async join() {
    const l = this.state.lunch

    this.setState({ joining: true });

    api
    .post("/api/lunches/" + l.id + "/join")
    .then((res) => {
      this.refresh().then((res) => {
        this.setState({ joining: false, lunch: res.data });
      })
      .catch(err => {
        alertError("Error while joining lunch");
        this.setState({
          joining: false,
        });
      });
    })
    .catch(err => {
      alertError("Error while joining lunch");
      this.setState({
        joining: false,
      });
    });
  }

  async confirm(el) {
    if (el.accepted || this.state.confirming)
      return;

    const l = this.state.lunch
    this.setState({ confirming: true });

    Alert.alert(
      'Confirm user',
      'Do you want to accept ' + el.name + ' to your lunch?',
      [
        {
          text: 'Yes', 
          onPress: () => {
            api
            .post("/api/lunches/" + l.id + "/accept/" + el.id)
            .then((res) => {
              this.refresh().then((res) => {
                this.setState({ lunch: res.data, confirming: false });
              })
              .catch(err => {
                this.setState({ confirming: false });
                alertError("Error while confirming user");
              });
            })
            .catch(err => {
              this.setState({ confirming: false });
              alertError("Error while confirming user");
            });
          }
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );


  }


  async leave() {
    const l = this.state.lunch

    this.setState({ leaving: true });

    api
    .post("/api/lunches/" + l.id + "/leave")
    .then((res) => {
      this.refresh().then((res) => {
        this.setState({ leaving: false, lunch: res.data });
      })
      .catch(err => {
        alertError("Error while leaving lunch");
        this.setState({
          leaving: false,
        });
      });
    })
    .catch(err => {
      alertError("Error while leaving lunch");
      this.setState({
        leaving: false,
      });
    });
  }

  async delete() {
    const l = this.state.lunch

    this.setState({ deleting: true });

    api
    .delete("/api/lunches/" + l.id)
    .then((res) => {
    this.setState({ deleting: false });
      this.props.navigation.goBack();
    })
    .catch(err => {
      alertError("Error while delete lunch");
      this.setState({
        deleting: false,
      });
    });
  }

  render() {
    const { user } = this.state;
    const l = this.state.lunch

    const isAuthor = user.id === l.author.id;
    const participation = l.participants.find(el => el.id === user.id);
    const isParticipant = participation ? true : false;
    
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        {this.state.fontLoaded && l ? (
          <View style={{ flex: 1 }}>
            <View style={styles.statusBar} />
            <View style={styles.navBar}>
              <Text style={styles.nameHeader}>{ l.restaurant.name + " with " + l.author.name }</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{
                    uri:
                      'http://i.pravatar.cc/400?u=' + l.author.name,
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
                    fontSize: 15,
                    color: colors.primary,
                    fontFamily: 'bold',
                  }}
                >
                  { moment.utc(l.date).format("L [at] hh:mm a") }
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
                  { l.description }
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  marginHorizontal: 40,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: colors.primary,
                    fontFamily: 'bold',
                  }}
                >
                  Participants{"\n"}
                </Text>
                { l.participants.length === 0 && <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: colors.primary,
                    fontFamily: 'regular',
                  }}
                >
                  No other participant yet.
                </Text>}
              </View>
              { l.participants.map((el, i) => (
                  <ListItem
                    component={TouchableScale}
                    friction={90}
                    tension={100}
                    activeScale={0.95}
                    leftAvatar={{ rounded: true, source: { uri: 'http://i.pravatar.cc/100?u=' + el.name,} }}
                    key={i}
                    style={{
                      marginHorizontal: 40,
                    }}
                    linearGradientProps={{
                      colors: [el.accepted ? colors.primary : colors.secondary, el.accepted ? colors.primary : colors.secondary],
                      start: [1, 0],
                      end: [0.2, 0],
                    }}
                    ViewComponent={LinearGradient}
                    title={el.name}
                    titleStyle={{ color: 'white', fontWeight: 'bold' }}
                    subtitleStyle={{ color: 'white' }}
                    subtitle={el.accepted ? "Confirmed" : "Waiting approval"}
                    chevronColor="white"
                    onPress={() => { this.confirm(el)}}
                    chevron={isAuthor && !el.accepted}
                    checkmark={el.accepted}
                    containerStyle={{
                      marginVertical: 4,
                      borderRadius: 8,
                    }}
                  />
                )) }
              { (!isAuthor && !isParticipant) && <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  width: SCREEN_WIDTH - 80,
                  marginLeft: 40,
                }}
              >
              <Button
                title="Ask to join"
                buttonStyle={{
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                }}
                titleStyle={{
                  fontWeight: 'bold'
                }}
                loading={this.state.joining}
                onPress={this.join}
              />
              </View> }
              { isAuthor && <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  width: SCREEN_WIDTH - 80,
                  marginLeft: 40,
                }}
              >
              <Button
                title="Cancel lunch"
                buttonStyle={{
                  backgroundColor: colors.secondary,
                  borderRadius: 8,
                }}
                loading={this.state.deleting}
                titleStyle={{
                  fontWeight: 'bold'
                }}
                onPress={this.delete}
              />
              </View> }
              { (isParticipant && participation.accepted) && <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  width: SCREEN_WIDTH - 80,
                  marginLeft: 40,
                }}
              >
              <Button
                title="Leave lunch"
                buttonStyle={{
                  backgroundColor: colors.secondary,
                  borderRadius: 8,
                }}
                loading={this.state.leaving}
                titleStyle={{
                  fontWeight: 'bold'
                }}
                onPress={this.leave}
              />
              </View> }
              { (isParticipant && !participation.accepted) && <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  width: SCREEN_WIDTH - 80,
                  marginLeft: 40,
                }}
              >
              <Button
                title="Withdraw request"
                buttonStyle={{
                  backgroundColor: colors.secondary,
                  borderRadius: 8,
                }}
                loading={this.state.leaving}
                titleStyle={{
                  fontWeight: 'bold'
                }}
                onPress={this.leave}
              />
              </View> }
              
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
