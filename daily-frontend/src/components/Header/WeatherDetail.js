import React from 'react';
import WIcon from './WIcon';

const WeatherDetail = ({cityname, date, data, visible, onClick}) => {
	return (
		<div onClick={onClick}>
			<b style={{marginRight:'0.5rem'}}>
				{date} 현재 {cityname}의 날씨는
			</b>
			<WIcon name="day-rain"/>
			{ visible && (
				<div className="weather-detail">여기는 날씨상세정보입니다.<br/>ㅋㅋㅋ</div>
			)}
		</div>
	);
};

export default WeatherDetail;
