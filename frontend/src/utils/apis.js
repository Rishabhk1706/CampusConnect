import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const AUTH_TOKEN_KEY = 'peerconnect-' + 'token';

export const authConfig = () => ({
  headers: {
    Authorization: 'Bearer ' + (localStorage.getItem(AUTH_TOKEN_KEY) || ''),
  },
});

export async function getColleges() { return (await axios.get(`${API_BASE_URL}/colleges`)).data; }
export async function getCourses() { return (await axios.get(`${API_BASE_URL}/courses`)).data; }
export async function getBranches(courseId) { return (await axios.get(`${API_BASE_URL}/branches${courseId ? `?courseId=${courseId}` : ''}`)).data; }
export async function getCompanies() { return (await axios.get(`${API_BASE_URL}/companies`)).data; }
export async function addCompany(name) { return (await axios.post(`${API_BASE_URL}/companies`, { name })).data; }
export async function getRoles() { return (await axios.get(`${API_BASE_URL}/roles`)).data; }
export async function addRole(name) { return (await axios.post(`${API_BASE_URL}/roles`, { name })).data; }
export async function registerUserApi(data) { return (await axios.post(`${API_BASE_URL}/auth/register`, data)).data; }
export async function verifyOtpApi(data) { return (await axios.post(`${API_BASE_URL}/auth/verify-otp`, data)).data; }
export async function resendOtpApi(data) { return (await axios.post(`${API_BASE_URL}/auth/send-otp`, data)).data; }
export async function loginUserApi(data) { return (await axios.post(`${API_BASE_URL}/auth/login`, data)).data; }
export async function forgotPasswordApi(data) { return (await axios.post(`${API_BASE_URL}/auth/forgot-password`, data)).data; }
export async function resetPasswordApi(data) { return (await axios.post(`${API_BASE_URL}/auth/reset-password`, data)).data; }
export function getCollegesByState(state) { return axios.get(`${API_BASE_URL}/colleges?state=${state}`).then((res) => res.data); }

export async function getMyProfile() { return (await axios.get(`${API_BASE_URL}/users/profile`, authConfig())).data; }
export async function getStudentProfile(id) { return (await axios.get(`${API_BASE_URL}/users/${id}`, authConfig())).data; }
export async function updateMyProfile(data) { return (await axios.patch(`${API_BASE_URL}/users/profile`, data, authConfig())).data; }
export async function getDirectoryOptions() { return (await axios.get(`${API_BASE_URL}/users/directory-options`, authConfig())).data; }
export async function getDirectory(relation, filters = {}) {
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value != null));
  return (await axios.get(`${API_BASE_URL}/users/${relation}${query.size ? `?${query}` : ''}`, authConfig())).data;
}
