import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


// export const  baseUrl = 'http://121.43.178.109:8110/ser';// 测试服务器
 // export const  baseUrl = 'http://123.206.115.18:8083';// 正式服务器
export const  baseUrl = '/apis';// 正式服务器
// export const  baseUrl = 'http://192.168.2.246:8080';




 