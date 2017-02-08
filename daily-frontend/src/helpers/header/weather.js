import axios from 'axios';
import urlencode from 'urlencode';

const GOOGLE_MAP_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_MAP_API_KEY = 'AIzaSyCBtxU6oknSRXToFIFH1e4dcxs_bmd8RyA';
const KMA_SERVICE_KEY = 'aw3xn0u0Hfkz1yEMglMRUl4SHtDNVqNm6zH9VyTfBZA4MZPEbNVQKPKCJI8qkRgdcaVa%2FFd9vb4B9ScCyFcxCQ%3D%3D';

const weatherHelper = (function() {
	var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)

    const getGoogleMapGeometry = (cityname) => {
		return axios.get(GOOGLE_MAP_URL, {
			params: {
				address: '',
				key: GOOGLE_MAP_API_KEY
			}
		});
	};

	const convertGoogleMapToKmaGrid = ({lat, lng}) => {
		var DEGRAD = Math.PI / 180.0;
	    //var RADDEG = 180.0 / Math.PI;
	 
	    var re = RE / GRID;
	    var slat1 = SLAT1 * DEGRAD;
	    var slat2 = SLAT2 * DEGRAD;
	    var olon = OLON * DEGRAD;
	    var olat = OLAT * DEGRAD;
	 
	    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
	    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

	    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
	    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;

	    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
	    ro = re * sf / Math.pow(ro, sn);

	    var rs = {};

        rs['lat'] = lat;
        rs['lng'] = lng;

        var ra = Math.tan(Math.PI * 0.25 + (lat) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);

        var theta = lng * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;

        rs['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

        console.log(rs);
	    return rs;
	};

	const getKmaWeatherInfo = (nx, ny) => {
		var today = new Date();
	    var dd = today.getDate();
	    var mm = today.getMonth()+1;
	    var yyyy = today.getFullYear();
	    var hours = today.getHours();
	    var minutes = today.getMinutes();
	    console.log("time " + minutes)
	 
	    if(minutes < 30) {
	        // 30분보다 작으면 한시간 전 값
	        hours = hours-1;
	        if(hours < 0) {
	            // 자정 이전은 전날로 계산
	            today.setDate(today.getDate() - 1);
	            dd = today.getDate();
	            mm = today.getMonth()+1;
	            yyyy = today.getFullYear();
	            hours = 23;
	        }
	    }
	    if(hours<10) {
	        hours='0'+hours
	    }
	    if(mm<10) {
	        mm='0'+mm
	    }
	    if(dd<10) {
	        dd='0'+dd
	    } 
	 
	    var _nx = nx,
	    _ny = ny,
	    Today = yyyy+""+mm+""+dd,
	    basetime = hours + "00",
	    url = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2";
	 
	    axios.get(url, {
	    	params: {
	    		ServiceKey: KMA_SERVICE_KEY,
	    		base_date: Today,
	    		base_time: basetime,
	    		nx: _nx,
	    		ny: _ny,
	    		pageNo: 1,
	    		numOfRows: 6
	    		//_type: 'json'
	    	}
	    })
	    .then(response => {
	    	console.log(response);
	    });	 
	};

	return {
		getWeatherInfo: (cityname) => {
			cityname = urlencode(cityname);

			const result = getGoogleMapGeometry(cityname);

			if (result.status === "OK") {
				const { nx, ny } = convertGoogleMapToKmaGrid(result.results.geometry.location)
				getKmaWeatherInfo(nx, ny);
			}
		}
	};
})();

export default weatherHelper;