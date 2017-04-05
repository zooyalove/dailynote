import axios from 'axios';

export const signIn = ({userid, password}) => {
	return axios.post('/api/user/signin', {
        userid,
        password
    });
}

export const getInfo = () => {
    return axios.get('/api/user/getinfo');
}