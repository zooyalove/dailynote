import axios from 'axios';

// 장부 등록
export const addNote = (formdata) => {
    return axios.post('/api/note', formdata);
};

// 전체 장부 가져오기
export const getAllNotes = () => {
    return axios.get('/api/note');
};

// 특정 장부 가져오기
export const getNote = (id, params={}) => {
    return axios.get(`/api/note/${id}`, params);
};
