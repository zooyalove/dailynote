import axios from 'axios';

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

export const getOrdererAll = () => {
	return axios.get('/api/orderer');
};

export const getOrdererStatistics = () => {
	return axios.get('/api/orderer/stat');
};

export const getOrdererById = ({id}) => {
	// console.log('api : ', id);
	return axios.get('/api/orderer/' + id);
};

export const deleteOrderer = ({id}) => {
	return axios.delete('/api/orderer/' + id);
};