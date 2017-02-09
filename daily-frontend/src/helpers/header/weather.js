import axios from 'axios';

const GOOGLE_MAP_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_MAP_API_KEY = 'AIzaSyCBtxU6oknSRXToFIFH1e4dcxs_bmd8RyA';

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

const getKmaWeatherInfo = (nx, ny) => {
	axios.get('/api/weather/info', {
		params: {
			x: nx,
			y: ny
		}
	}).then(response => {
		let data = response.data.response;
		
		if(data.header.resultMsg === "OK") {
			let body = data.body;
			console.log(body);
		}
	});
};

const getGoogleMapGeometry = (cityname) => {
	axios.get(GOOGLE_MAP_URL, {
		params: {
			key: GOOGLE_MAP_API_KEY,
			address: cityname
		}
	}).then((response) => {
		let data = response.data;

		if (data.status === "OK") {
			const { nx, ny } = convertGoogleMapToKmaGrid(data.results[0].geometry.location);

			getKmaWeatherInfo(nx, ny);
		}
	});
};


const weatherHelper = (function() {

	return {
		getWeatherInfo: (cityname) => {
			getGoogleMapGeometry(cityname);
		}
	};
})();

export default weatherHelper;