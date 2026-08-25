import api from './api';
export const register=async data=>(await api.post('/auth/register',data)).data;
export const login=async data=>(await api.post('/auth/login',data)).data;
