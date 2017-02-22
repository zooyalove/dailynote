import axios from 'axios';
import { GOOGLE_MAP_API_KEY, GOOGLE_MAP_URL } from './google_config';

const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기1준점 Y좌표(GRID)

const convertGoogleMapToKmaGrid = ({lat, lng}) => {
	let DEGRAD = Math.PI / 180.0;
	
	let re = RE / GRID;
	let slat1 = SLAT1 * DEGRAD;
	let slat2 = SLAT2 * DEGRAD;
	let olon = OLON * DEGRAD;
	let olat = OLAT * DEGRAD;
	
	let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
	sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

	let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
	sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;

	let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
	ro = re * sf / Math.pow(ro, sn);

	let rs = {};

	rs['lat'] = lat;
	rs['lng'] = lng;

	let ra = Math.tan(Math.PI * 0.25 + (lat) * DEGRAD * 0.5);
	ra = re * sf / Math.pow(ra, sn);

	let theta = lng * DEGRAD - olon;
	if (theta > Math.PI) theta -= 2.0 * Math.PI;
	if (theta < -Math.PI) theta += 2.0 * Math.PI;
	theta *= sn;

	rs['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
	rs['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

	return rs;
};

const weather_status = {	// key 기본구조 : 하늘상태, 강수형태, 낙뢰, 바람형태(3단계)
	'1000': ['sunny', 'clear'], '1001': 'light-wind', '1002': 'windy',
	'1010': 'lighting', 		'1011': 'lighting',   '1012': 'lighting',

	'1100': 'rain', '1101': 'rain-wind', '1102': 'rain-wind',
	'1110': 'thunderstorm', '1111': 'thunderstorm', '1112': 'thunderstorm',
	'1200': 'sleet', '1201': 'sleet', '1202': 'sleet',
	'1210': 'sleet-storm', '1211': 'sleet-storm', '1212': 'sleet-storm',
	'1300': 'snow', '1301': 'snow-wind', '1302': 'snow-wind',
	'1310': 'snow-thunderstorm', '1311': 'snow-thunderstorm', '1312': 'snow-thunderstorm',

	'2000': 'cloudy', '2001': 'cloudy-windy', '2002': 'cloudy-gusts',
	'2010': 'lighting', '2011': 'lighting', '2012': 'lighting',
	'2100': 'rain', '2101': 'rain-wind', '2102': 'rain-wind',
	'2110': '', '2111': '', '2112': '',
	'2200': '', '2201': '', '2202': '',
	'2210': '', '2211': '', '2212': '',
	'2300': '', '2301': '', '2302': '',
	'2310': '', '2311': '', '2312': '',
};

const vecTo16 = (vec) => (
	parseInt(((vec + 22.5 * 0.5)/22.5), 10)
);

const translateData = (data) => {
	/**
	 * # 동네예보(ForecastSpaceData), 초단기실황(ForecastGrib) 공통사항
	 * RN1(1시간), R06(6시간) 강수량(mm) => [0(0.1미만), 1(1미만), 5(1~4), 10(5~9),
	 * 									  20(10~19), 40(20~39), 70(40~69), 100(70이상)]
	 * SKY 하늘상태			=> [1(맑음), 2(구름조금), 3(구름많음), 4(흐림)]
	 * UUU 동서바람(m/s)	=> 동(+), 서(-)
	 * VVV 남북바람(m/s)	=> 북(+), 남(-)
	 * REH 습도(%)
	 * PTY 강수형태			=> [0(없음), 1(비), 2(비/눈 - 진눈개비), 3(눈)]
	 * LGT 낙뢰			 => [0, 1]
	 * VEC 풍향			 => [0(N), 1(NNE), 2(NE), 3(ENE), 4(E), 5(ESE), 6(SE), 7(SSE), 8(S),
	 * 						  9(SSW), 10(SW), 11(WSW), 12(W), 13(WNW), 14(NW), 15(NNW), 16(N)]
	 *     16방위 계산방법   => (풍향값 + 22.5 * 0.5) / 22.5 = 변환값(소수점 이하 버림)
	 * WSD 풍속
	 * 
	 * # 동네예보
	 * POP 강수확률(%)
	 * R06 6시간 강수량(mm)
	 * S06 6시간 신 적설(cm)
	 * T3H 3시간 기온(섭씨온도)
	 * TMN 일최저기온(   "  )
	 * TMX 일최고기온(   "  )
	 * 
	 * # 초단기실황
	 * T1H 기온(섭씨온도)
	 * RN1 1시간 강수량(mm)
	 */

	// 일단 초단기실황(ForecastGrib)만 먼저 적용한다.

	/**
	 * 기본 데이터 구조
	 * 
	 * [
	 * 	  {"baseDate":20151013, "baseTime":1600,"category":"LGT","nx":55,"ny":127,"obsrValue":0},
	 * 		.
	 * 		.
	 * 		.
	 * ]
	 * 
	 * redux weatherDetail 구조
	 * 
	 * 		weatherDetail: {
	 * 			"baseDate": 20151013,
	 * 			"baseTime": 1600,
	 * 			"data": {
	 * 				"LGT": 0,
	 * 				"RN1": 5,
	 * 				"SKY": 0,
	 * 				.
	 * 				.
	 * 				.
	 * 			}
	 * 		}
	 */

	const VEC = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
				'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];

	let forecast_data = {
		baseDate: 0,
		baseTime: "",
		data: {},
		transData: {}
	};
	
	let isStart = false;
	data.forEach((items) => {
		
		if (!isStart) {
			forecast_data.baseDate = items.baseDate;
			forecast_data.baseTime = items.baseTime;
			isStart = true;
		}

		forecast_data.data[items.category] = items.obsrValue;
	});

	forecast_data.transData = {
		BASEDATE: forecast_data.baseDate,
		BASETIME: forecast_data.baseTime,
		TEMP: forecast_data.data.T1H,
		HUM: forecast_data.data.REH,
		WIND: VEC[vecTo16(forecast_data.data.VEC)],
		WSPEED: forecast_data.data.WSD
	};

	return forecast_data;
};

const weatherHelper = (function() {

	return {
		translateData: translateData,

		getGoogleMapGeometry: async (cityname) => {
			const googlemap_info = await axios.get(GOOGLE_MAP_URL, {
				params: {
					key: GOOGLE_MAP_API_KEY,
					address: cityname
				}
			});

			return googlemap_info;
		},

		getKmaWeatherInfo: async (location) => {
			const { nx, ny } = convertGoogleMapToKmaGrid(location);

			const kma_info = await axios.get('/api/weather/info', {
				params: {
					x: nx,
					y: ny
				}
			});

			return kma_info;
		}
	};
})();

export default weatherHelper;