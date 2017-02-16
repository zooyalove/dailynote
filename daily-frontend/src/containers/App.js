import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dimmer, Loader } from 'semantic-ui-react';

import * as weather from '../redux/modules/header/weather';
import weatherHelper from '../helpers/header/weather';

import Header, { Weather, Logo, WIcon } from '../components/Header';


class App extends Component {
    componentWillMount() {
        const { handleWeatherData } = this;

        handleWeatherData();
    }

    handleWeatherData = async () => {
        const { WeatherActions, status: { weather } } = this.props;
        const weekends = ['일', '월', '화', '수', '목', '금', '토'];

        WeatherActions.fetchingWeatherDetail();
        
        const today = new Date();
        let month = ''+(today.getMonth()+1);
        let day = ''+today.getDate();
        let week = today.getDay();

        if (month.length === 1) month = '0'+month;
        if (day.length === 1) day = '0'+day;

        let date = month+'.'+day+'.('+weekends[week]+')';

        let weather_data = null;
        let geometry_loc;

        if (!weather.getIn(['weatherDetail', 'data'])) {
            const geocode = await weatherHelper.getGoogleMapGeometry(weather.get('cityname'));
            //console.log(geocode);

            if (geocode.data.status === "OK") {
                geometry_loc = geocode.data.results[0].geometry.location;
                weather_data = await weatherHelper.getKmaWeatherInfo(geometry_loc);
            } else { // Error occurred

            }
        } else { // Reload
            geometry_loc = weather.get('location');
            weather_data = await weatherHelper.getKmaWeatherInfo(geometry_loc);
        }

        let data = weatherHelper.translateData(weather_data.data.response.body.items.item);
        console.log(data);
        

        WeatherActions.setWeatherDetail({ geometry_loc, date, data });
    }

    render() {
    	const { children, status: { weather } } = this.props;

        const cityname = weather.get('cityname');
        var last_cityname;

        if (cityname.indexOf(' ') > -1) last_cityname = cityname.split(' ').reverse();

        last_cityname = last_cityname ? last_cityname[0] : cityname;

        return (
        	<div>
            	<Header>
            		<Logo />
            		<Weather>
						{
                            (!weather.getIn(['weatherDetail', 'data']) || weather.get('fetching')) && (
                                <Dimmer active inverted>
                                    <Loader size='mini' inverted />
                                </Dimmer>
                            )
                        }
                        { 
                            ( !!weather.getIn(['weatherDetail', 'data']) && !weather.get('fetching')) && (
                                <div>
                                    <b style={{marginRight:'0.5rem'}}>{weather.get('date')} 현재 {last_cityname}의 날씨는</b>
                                    <WIcon name="day-rain"/>
                                </div>
                            )
                        }
					</Weather>
            	</Header>
            	<div className="content-wrapper">
            		{children}
            	</div>
            </div>
        );
    }
}

App = connect(
    state => ({
        status: {
            weather: state.header.weather
        }
    }),
    dispatch => ({
        WeatherActions: bindActionCreators(weather, dispatch)
    })
)(App);

export default App;
