import React from 'react';
import WIcon from './WIcon';
import { Button } from 'semantic-ui-react';

const WeatherDetail = ({ cityname, date, data, fetching, visible, onHide, onReload }) => {
	const daytime = (data.BASETIME > 500 && data.BASETIME < 2000) ? 'day' : 'night';
	
	let btime = ''+data.BASETIME;

	const basetime = (data.BASETIME < 1300) ? '오전 '+parseInt(btime.substr(0, 2), 10)+':'+btime.substr(2, 2)
							: '오후 '+(parseInt(btime.substr(0, 2), 10)-12)+':'+btime.substr(2, 2);

	const basedate = (''+data.BASEDATE).substr(4, 2)+'/'+(''+data.BASEDATE).substr(6, 2);

	const wind = data.WIND.replace(/N/gi, "북")
						.replace(/S/gi, "남")
						.replace(/W/gi, "서")
						.replace(/E/gi, "동");

	return (
		<div className={`weather-detail-wrapper ${daytime}`}>
			<div className={`weather-light-info ${visible ? 'over' : ''}`}  onClick={onHide}>
				<b>
					{date} 현재 {cityname}의 날씨는
				</b>
				<WIcon time={daytime} name={data.SKY_ICO} />
			</div>
			{ visible && (
				<div>
					<div className="weather-detail-info">
						<div className="weather-detail">
							<div className="weather-sky">
								<WIcon time={daytime} name={data.SKY_ICO} size="huge" />
								<div>{data.SKY_KOR}</div>
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
							<div className="weather-extras">
								<div className="extra"><WIcon time={daytime} name="strong-wind" /> {wind}풍 {data.WSPEED}m/s</div>
							</div>
						</div>
					</div>
					<div className="weather-date">
						<div className="weather-basetime">
							<span className="reload-time">Updated from {basedate} {basetime}</span>
							<Button
								className={`reload-btn ${daytime}`}
								basic
								circular
								//color='orange'
								icon="refresh"
								loading={fetching}
								onClick={() => {
									onReload();
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
