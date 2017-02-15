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

const weatherHelper = (function() {

	return {

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
		// getWeatherInfo: async (cityname) => {

		// 	const geocode = await getGoogleMapGeometry(cityname);
		// 	console.log(geocode);
		// 	if (geocode.data.status === "OK") {
		// 		const { nx, ny } = ;

		// 		const weather_info = await getKmaWeatherInfo(nx, ny);
		// 		console.log(weather_info);
		// 	}
		// }
	};
})();

export default weatherHelper;