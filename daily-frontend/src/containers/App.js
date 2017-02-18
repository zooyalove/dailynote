import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Loader } from 'semantic-ui-react';

import * as weather from '../redux/modules/header/weather';
import weatherHelper from '../helpers/header/weather';

import Header, { Weather, Logo, WeatherDetail } from '../components/Header';


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

    handleHide = (e) => {
        const { WeatherActions, status: { weather } } = this.props;

        if (!weather.get('visible')) {
            WeatherActions.openWeatherDetail();
        } else {
            WeatherActions.closeWeatherDetail();
        }
    }

    render() {
    	const { children, status: { weather } } = this.props;
        const { handleHide } = this;

        const cityname = weather.get('cityname');
        var last_cityname;

        if (cityname.indexOf(' ') > -1) last_cityname = cityname.split(' ').reverse();

        last_cityname = last_cityname ? last_cityname[0] : cityname;

        return (
        	<div>
            	<Header>
            		<Logo />
            		<Weather cn={weather.get('visible') ? 'over' : ''}>
						{
                            (!weather.getIn(['weatherDetail', 'data']) || weather.get('fetching')) && (
                                <Loader size='mini' inverted />
                            )
                        }
                        {
                            ( !!weather.getIn(['weatherDetail', 'data']) && !weather.get('fetching')) && (
                                <WeatherDetail
                                    cityname={last_cityname}
                                    date={weather.get('date')}
                                    data={weather.getIn(['weatherDetail', 'transData'])}
                                    visible={weather.get('visible')}
                                    onClick={handleHide}
                                />
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
