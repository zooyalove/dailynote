import axios from 'axios';

// 거래처 등록
export const addOrderer = ({
	name,
	phone,
	address,
	manager,
	manager_phone,
	def_ribtext,
	description
}) => {
	return axios.post('/api/orderer', {
		name,
		phone,
		address,
		manager,
		manager_phone,
		def_ribtext,
		description
	});
};

// 모든 거래처 정보 가져오기
export const getOrdererAll = () => {
	return axios.get('/api/orderer');
};

// 거래처 통합 통계 가져오기
export const getOrdererStatistics = () => {
	return axios.get('/api/orderer/stat');
};

// 특정 거래처 정보 가져오기
export const getOrdererById = ({id}) => {
	// console.log('api : ', id);
	return axios.get('/api/orderer/' + id);
};

// 특정 거래처 정보 수정하기
export const modifyOrderer = (id, {
	name,
	phone,
	address,
	manager,
	manager_phone,
	def_ribtext,
	description
}) => {
	return axios.put('/api/orderer/' + id, {
		name,
		phone,
		address,
		manager,
		manager_phone,
		def_ribtext,
		description
	});
}

// 특정 거래처 정보 삭제하기
export const deleteOrderer = ({id}) => {
	return axios.delete('/api/orderer/' + id);
};