import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

// 测试服地址
// export const  baseUrl = 'http://192.168.10.46:83/shangfu-admin-web';
// export const  sysUrl = 'http://192.168.10.46:83/shangfu-admin-web'


//ysf

export const  sysUrl = 'http://192.168.10.18:8080/shangfu-admin-web';
// export const  baseUrl = 'http://192.168.10.18:8080/shangfu-admin-web-artAct';
export const  baseUrl = 'http://192.168.10.18:8080/shangfu-admin-web-web';

//juan

// export const  baseUrl = 'http://192.168.10.46:83/shangfu-admin-web';
// export const  sysUrl = 'http://192.168.10.46:83/shangfu-admin-web'




