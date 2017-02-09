import express from 'express';
import axios from 'axios';

const router = express.Router();

const KMA_SERVICE_KEY = 'aw3xn0u0Hfkz1yEMglMRUl4SHtDNVqNm6zH9VyTfBZA4MZPEbNVQKPKCJI8qkRgdcaVa%2FFd9vb4B9ScCyFcxCQ%3D%3D';

const getKmaWeatherInfo = (nx, ny, res) => {
	let today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth()+1;
	let yyyy = today.getFullYear();
	let hours = today.getHours();
	let minutes = today.getMinutes();
	console.log("time " + minutes)
	
	if(minutes < 30) {
		// 30분보다 작으면 한시간 전 값
		hours -= 1;
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
	
	let _nx = nx,
		_ny = ny,
		Today = yyyy+""+mm+""+dd,
		basetime = hours + "00",
		url = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib";

	url += '?serviceKey='+KMA_SERVICE_KEY;
	url += '&base_date='+Today;
	url += '&base_time='+basetime;
	url += '&nx='+_nx;
	url += '&ny='+_ny;
	url += '&pageNo=1';
	url += '&numOfRows='+100;
	url += '&_type=json';
	console.log(url);

    axios.get(url)
        .then(response => {
            if( response.status === 200 ) {
                let data = response.data;
                res.json(data);
            }
        });
};

router.get('/info', (req, res) => {
    let nx = req.query.x,
        ny = req.query.y;

    getKmaWeatherInfo(nx, ny, res);
});

export default router;