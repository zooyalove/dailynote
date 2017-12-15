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

// 오늘의 장부자료 가져오기
export const getTodayNotes = () => {
    return axios.get('/api/note/today');
}

// 특정 검색어로 장부 검색하기
export const searchNotes = (searchTxt) => {
    return axios.get(`/api/note/search/${searchTxt}`);
}

export const getMonthNotes = (month) => {
    return axios.get(`/api/note/month/${month}`);
}