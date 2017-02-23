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
	'1000': ['?-sunny', '?-clear'], '1001': '?-light-wind', '1002': '?-windy',
	'1010': '?-lighting', 		'1011': '?-lighting',   '1012': '?-lighting',

	'1100': '?-rain', '1101': '?-rain-wind', '1102': '?-rain-wind',
	'1110': '?-thunderstorm', '1111': '?-thunderstorm', '1112': '?-thunderstorm',
	'1200': '?-sleet', '1201': '?-sleet', '1202': '?-sleet',
	'1210': '?-sleet-storm', '1211': '?-sleet-storm', '1212': '?-sleet-storm',
	'1300': '?-snow', '1301': '?-snow-wind', '1302': '?-snow-wind',
	'1310': '?-snow-thunderstorm', '1311': '?-snow-thunderstorm', '1312': '?-snow-thunderstorm',

	'2000': '?-cloudy', '2001': '?-cloudy-windy', '2002': '?-cloudy-gusts',
	'2010': '?-lighting', '2011': '?-lighting', '2012': '?-lighting',
	'2100': '?-rain', '2101': '?-rain-wind', '2102': '?-rain-wind',
	'2110': '?-thunderstorm', '2111': '?-thunderstorm', '2112': '?-thunderstorm',
	'2200': '?-sleet', '2201': '?-sleet', '2202': '?-sleet',
	'2210': '?-sleet-storm', '2211': '?-sleet-storm', '2212': '?-sleet-storm',
	'2300': '?-snow', '2301': '?-snow-wind', '2302': '?-snow-wind',
	'2310': '?-snow-thunderstorm', '2311': '?-snow-thunderstorm', '2312': '?-snow-thunderstorm',

	'3000': 'cloud', '3001': 'cloudy-windy', '3002': 'cloudy-gusts',
	'3010': 'lighting', '3011': 'lighting', '3012': 'lighting',
	'3100': 'rain', '3101': 'rain-wind', '3102': 'rain-wind',
	'3110': 'thunderstorm', '3111': 'thunderstorm', '3112': 'thunderstorm',
	'3200': 'sleet', '3201': 'sleet', '3202': 'sleet',
	'3210': '?-sleet-storm', '3211': '?-sleet-storm', '3212': '?-sleet-storm',
	'3300': 'snow', '3301': 'snow-wind', '3302': 'snow-wind',
	'3310': '?-snow-thunderstorm', '3311': '?-snow-thunderstorm', '3312': '?-snow-thunderstorm',

	'4000': 'cloudy', '4001': 'cloudy-windy', '4002': 'cloudy-gusts',
	'4010': 'lighting', '4011': 'lighting', '4012': 'lighting',
	'4100': 'rain', '4101': 'rain-wind', '4102': 'rain-wind',
	'4110': 'thunderstorm', '4111': 'thunderstorm', '4112': 'thunderstorm',
	'4200': 'sleet', '4201': 'sleet', '4202': 'sleet',
	'4210': '?-sleet-storm', '4211': '?-sleet-storm', '4212': '?-sleet-storm',
	'4300': 'snow', '4301': 'snow-wind', '4302': 'snow-wind',
	'4310': '?-snow-thunderstorm', '4311': '?-snow-thunderstorm', '4312': '?-snow-thunderstorm',
};

const skyKorean = ['맑음', '구름조금', '구름많음', '흐림'];
const windStrength = [5.3, 13.8];

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

	let i=0;
	for(; i<windStrength.length; ++i) {
		if (forecast_data.data.WSD <= windStrength[i]) break;
		else continue;
	}
	console.log(i);

	const sky_ico = (''+forecast_data.data.SKY)+(''+forecast_data.data.PTY)+(''+forecast_data.data.LGT)+(''+i);
	console.log(sky_ico);
	let ws = weather_status[sky_ico];
	console.log(ws);
	const daytime = (forecast_data.baseTime > 500 && forecast_data.baseTime < 2000) ? 'day' : 'night';
	ws = (typeof ws === 'string') ? ws : ((daytime === 'day') ? ws[0] : ws[1]);
	ws = (ws.indexOf('?') > -1) ? ws.replace('?', daytime) : ws;
	console.log(ws);

	forecast_data.transData = {
		BASEDATE: forecast_data.baseDate,
		BASETIME: forecast_data.baseTime,
		SKY_KOR: skyKorean[forecast_data.data.SKY - 1],
		SKY_ICO: ws,
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