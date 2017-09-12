import axios from 'axios';

const orderer = {};

orderer.addOrderer = ({
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

orderer.getOrdererAll = () => {
	return axios.get('/api/orderer');
};

orderer.getOrdererById = ({id}) => {
	return axios.get('/api/orderer/' + id);
};

export default orderer;