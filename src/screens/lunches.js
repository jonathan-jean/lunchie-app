import _ from 'lodash';

import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';

import {
  Text,
  Button,
} from 'react-native-elements';
import {ListItem} from "../components/ListItem";

import moment from "moment";
import colors from '../config/colors';
import api, { alertError } from '../config/api';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Lunches extends Component {
  constructor() {
    super();

    this.state = {
      date: moment(),
      loading: false,
      results: [],
    };

    this.search = this.search.bind(this);
  }

  componentWillMount() {
    this.didBlurSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.search(true);
      }
    );
  }

  componentWillUnmount() {
    this.didBlurSubscription.remove();
  }

  search() {
    this.setState({ loading: true, results: [] });

    const url = "/api/user/lunches"

    api.get(url).then((res) => {
      this.setState({ results: res.data, loading: false});
    }).catch((err) => {
      alertError(err.response.data.message);
      this.setState({ results: [], loading: false });
    });
  }

  render() {
    const { results, loading } = this.state;

    return (
      <ScrollView>
        <View
          style={{
            flex: 1,
            marginTop: 20,
            width: SCREEN_WIDTH - 80,
            marginLeft: 40,
          }}
        >
        <Button
          title="Create lunch"
          buttonStyle={{
            backgroundColor: colors.primary,
          }}
          titleStyle={{
            fontWeight: 'bold'
          }}
          loading={loading}
          onPress={() => this.props.navigation.push("NewLunch")}
        />
        </View>
        <View style={styles.results}>
          {
            (results.length === 0 && !loading) ? <Text style={styles.heading}>No scheduled lunch in the future</Text> : null
          }
          { !loading && results.map((l, i) => (
              <ListItem
                leftAvatar={{ source: { uri: 'http://i.pravatar.cc/400?u=' + l.author.name } }}
                key={i}
                title={l.restaurant.name + " with " + l.author.name}
                subtitle={moment.utc(l.date).format("L [at] hh:mm a")}
                chevron
                bottomDivider
                onPress={() => this.props.navigation.push("Lunch", {
                  lunch: l
                })}
              />
          ))
        }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    backgroundColor: '#fff',
  },
  results: {
    marginTop: 15,
    backgroundColor: '#fff',
  },
  heading: {
    color: colors.primary,
    marginTop: 10,
    fontSize: 22,
    marginLeft: 15,
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  social: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
  },
  ratingImage: {
    height: 19.21,
    width: 100,
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey',
  },
});

export default Lunches;
