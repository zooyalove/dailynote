import React from 'react';
import WIcon from './WIcon';

const WeatherDetail = ({cityname, date, data, visible, onClick}) => {
	return (
		<div className="weather-detail-wrapper" onClick={onClick}>
			<div className="weather-light-info">
				<b>
					{date} 현재 {cityname}의 날씨는
				</b>
				<WIcon name="day-rain" />
			</div>
			{ visible && (
				<div className="weather-detail-info">
					<div className="weather-detail">
						<div className="weather-sky">
							<WIcon name="day-rain" size="huge" />
						</div>
						<div className="weather-temp-hum">
							<div className="temperature">
								<p>
									<WIcon name="thermometer" size="middle" />
									<span>{data.TEMP}</span>
									<WIcon name="celsius" size="middle" />
								</p>
							</div>
							<div className="humidity">
								<p>
									<WIcon name="humidity" size="middle" />
									<span>{data.HUM}%</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default WeatherDetail;
