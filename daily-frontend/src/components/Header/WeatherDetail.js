import React from 'react';
import WIcon from './WIcon';
import { Button } from 'semantic-ui-react';

const WeatherDetail = ({ cityname, date, data, visible, onHide, onReload }) => {
	const daytime = (data.BASETIME > 500 && data.BASETIME < 2000) ? 'day' : 'night';
	let btime = (data.BASETIME < 1000) ? '0'+data.BASETIME : ''+data.BASETIME;
	const basetime = (data.BASETIME < 1300) ? '오전 '+parseInt(btime.substr(0, 2), 10)+':'+btime.substr(2, 2)
							: '오후 '+(parseInt(btime.substr(0, 2), 10)-12)+':'+btime.substr(2, 2);
	return (
		<div className="weather-detail-wrapper">
			<div className="weather-light-info" onClick={onHide}>
				<b>
					{date} 현재 {cityname}의 날씨는
				</b>
				<WIcon time={daytime} name="day-rain" />
			</div>
			{ visible && (
				<div>
					<div className="weather-detail-info">
						<div className="weather-detail">
							<div className="weather-sky">
								<WIcon time={daytime} name="day-rain" size="huge" />
							</div>
							<div className="weather-temp-hum">
								<div className="temperature">
									<p>
										<WIcon time={daytime} name="thermometer" size="middle" />
										<span>{data.TEMP}</span>
										<WIcon time={daytime} name="celsius" size="middle" />
									</p>
								</div>
								<div className="humidity">
									<p>
										<WIcon time={daytime} name="humidity" size="middle" />
										<span>{data.HUM}%</span>
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="weather-date">
						<div className="weather-basetime">
							Update {basetime}
							<Button
								className="reload-btn"
								circular
								basic
								size="mini"
								icon="refresh"
								onClick={(e) => {
									onReload();
									console.log('Reload click');
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default WeatherDetail;
