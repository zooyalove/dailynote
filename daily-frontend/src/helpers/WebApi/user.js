import axios from 'axios';

const user = {};

user.signIn = ({userid, password}) => {
	return axios.post('/api/user/signin', {
        userid,
        password
    });
};

user.getInfo = () => {
    return axios.get('/api/user/getinfo');
};

export default user;