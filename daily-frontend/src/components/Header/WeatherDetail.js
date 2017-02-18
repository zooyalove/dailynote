import React from 'react';
import WIcon from './WIcon';

const WeatherDetail = ({cityname, date, data, visible, onClick}) => {
	return (
		<div onClick={onClick}>
			<b style={{marginRight:'0.5rem'}}>
				{date} 현재 {cityname}의 날씨는
			</b>
			<WIcon name="day-rain" />
			{ visible && (
				<div className="weather-detail">
					<div className="detail-wrapper">
						<div className="weather-sky">
							<WIcon name="day-rain" size="huge" />
						</div>
						<div className="weather-temp">
							<div>
								<p><WIcon name="thermometer" size="big" /> <span>25</span><WIcon name="celsius" size="big" /></p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default WeatherDetail;
