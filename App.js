import React from 'react';
import { StyleSheet, Text, View, Animated, TextInput, Button } from 'react-native';
import Weather from './components/Weather'
import { weatherConditions } from './utils/WeatherConditions';

import { API_KEY } from './utils/WeatherAPIKey';

export default class App extends React.Component {
  state = {
    isLoading: true,
    temperature: 0,
    weatherCondition: null,
    cityName: null,
    text: '',
    lat: 0,
    lon: 0,
    valid: 0,
    error: null
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchWeather(position.coords.latitude, position.coords.longitude);
        this.setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
      },
      error => {
        this.setState({
          error: 'Error Getting Weather Conditions'
        });
      }
    );
  }

  fetchWeather(lat, lon) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=imperial`
    )
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          cityName: json.name,
          isLoading: false,
        });
      });
  }

  fetchWeatherZip(zipcode) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&APPID=${API_KEY}&units=imperial`
    )
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          cityName: json.name,
          valid: json.weather[0].main,
          isLoading: false,
        });
      });
  }

  render() {
    const { isLoading, weatherCondition, temperature, cityName, valid } = this.state;
    return (
      <View style={{flex: 1,
              padding: 10,
              backgroundColor: this.state.isLoading ? 'white' : weatherConditions[weatherCondition].color,
              alignItems: 'center',
              justifyContent: 'center'}}>
        {isLoading ? <Text>Fetching The Weather</Text> : <Weather weather={weatherCondition} temperature={temperature} city={cityName} valid={valid} />}
          <TextInput
            style={{height: 80, textAlign: 'right'}}
            placeholder='enter a zip code!'
            onChangeText={(text) => this.setState({text})}
            />
        <Button
          onPress={
            () => this.fetchWeatherZip(this.state.text)
          }
          title="Get weather by zipcode!"
        />
        <Button
          onPress={
            () => this.fetchWeather(this.state.lat, this.state.lon)
          }
          title="Get weather by current location!"
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
