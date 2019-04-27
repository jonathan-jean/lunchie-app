import _ from 'lodash';

import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, ListView } from 'react-native';

import {
  Text,
  Button,
  Tile,
  Icon,
  Avatar,
} from 'react-native-elements';
import {ListItem} from "../components/ListItem";

import moment from "moment";
import colors from '../config/colors';
import api, { alertError } from '../config/api';
import DateTimePicker from "react-native-modal-datetime-picker";

class Search extends Component {
  constructor() {
    super();

    this.state = {
      date: moment(),
      restaurant: null,
      loading: false,
      restaurants: [],
      results: [],
      isDateTimePickerVisible: false,
      isSelectingRestaurant: false
    };

    this.search = this.search.bind(this);
    this.showDateTimePicker = this.showDateTimePicker.bind(this);
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.handleDatePicked = this.handleDatePicked.bind(this);
    this.showRestaurants = this.showRestaurants.bind(this);
    this.hideRestaurants = this.hideRestaurants.bind(this);
    this.handleRestaurantSelected = this.handleRestaurantSelected.bind(this);
  }

  componentWillMount() {
    this.didBlurSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.search(true);
      }
    );
  }

  componentDidMount() {
    
    api.get('/api/restaurants').then((res) => {
      this.setState({ restaurants: res.data });
    })
  }

  componentWillUnmount() {
    this.didBlurSubscription.remove();
  }
  
  search(silent = false) {
    if (!this.state.restaurant) {
      if (silent === false)
        alertError("Please choose a restaurant");
      return;
    }

    this.setState({ loading: true, results: [] });

    const url = "/api/lunches?restaurant=" + this.state.restaurant.id + "&date=" + this.state.date.format();

    api.get(url).then((res) => {
      if (res.data.length === 0 && !silent)
        alertError("Cannot find any results");
      this.setState({ results: res.data, loading: false});
    }).catch((err) => {
      alertError(err.response.data.message);
      this.setState({ results: [], loading: false });
    });
  }

  showDateTimePicker() {
    this.setState({ isDateTimePickerVisible: true });
  };
 
  hideDateTimePicker() {
    this.setState({ isDateTimePickerVisible: false });
  };
 
  showRestaurants() {
    if (this.state.restaurants.length > 0)
      this.setState({ isSelectingRestaurant: true });
  };
 
  hideRestaurants() {
    this.setState({ isSelectingRestaurant: false });
  };

  handleRestaurantSelected(restaurant) {
    this.setState({ restaurant });
    this.hideRestaurants();
  }

  handleDatePicked(date) {
    this.setState({ date: moment(date) });
    this.hideDateTimePicker();
  };

  render() {
    const { results, loading, date, restaurant, restaurants, isDateTimePickerVisible, isSelectingRestaurant } = this.state;

    return (
      <ScrollView>
        <DateTimePicker
            isVisible={isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode={"datetime"}
          />
        { !isSelectingRestaurant && <View>
          <View style={styles.list}>
              <ListItem
                key={"1"}
                onPress={this.showDateTimePicker}
                subtitle={"Date and time"}
                titleStyle={{ fontWeight: 'bold' }}
                title={date.calendar()}
                chevron
                leftIcon={{ name: "av-timer" }}
                bottomDivider
              />
              <ListItem
                key={"2"}
                onPress={this.showRestaurants}
                subtitle={"Restaurant"}
                titleStyle={{ fontWeight: 'bold' }}
                title={restaurant ? restaurant.name : "Choose a restaurant"}
                chevron
                leftIcon={{ name: "restaurant" }}
              />
              <Button
                title="Search"
                loading={loading}
                buttonStyle={{
                  borderRadius: 0,
                  backgroundColor: colors.primary,
                }}
                titleStyle={{
                  fontWeight: 'bold'
                }}
                onPress={() => this.search()}
              />
          </View>

          <View style={styles.results}>
            {
              results.length === 0 ? <Text style={styles.heading}>No results</Text> : null
            }
              {results.map((l, i) => (
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
            ))}
          </View>
        </View> }
        { isSelectingRestaurant && <View style={styles.results}>
            {
              restaurants.map((l, i) => (
                <ListItem
                  key={i}
                  title={l.name}
                  bottomDivider
                  onPress={() => this.handleRestaurantSelected(l)}
                />
              ))
            }
          </View>
        }
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

export default Search;
