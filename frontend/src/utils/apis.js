import axios from 'axios';

const API_BASE_URL = "http://localhost:3000/api";

export async function getColleges() {
  const res = await axios.get(`${API_BASE_URL}/colleges`);
  return res.data;
}

export async function getCourses() {
  const res = await axios.get(`${API_BASE_URL}/courses`);
  return res.data;
}

export async function getBranches(courseId) {
  const url = courseId
    ? `${API_BASE_URL}/branches?courseId=${courseId}`
    : `${API_BASE_URL}/branches`;
  const res = await axios.get(url);
  return res.data;
}

export async function registerUserApi(userData) {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return res.data;
}

export async function verifyOtpApi({ email, otp }) {
  const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });
  return res.data;
}

export async function resendOtpApi({ email }) {
  const res = await axios.post(`${API_BASE_URL}/auth/send-otp`, { email });
  return res.data;
}

export async function loginUserApi({ email, password }) {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return res.data;
}

export async function forgotPasswordApi({ email }) {
  const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
  return res.data;
}

export async function resetPasswordApi({ email, otp, newPassword }) {
  const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, { email, otp, newPassword });
  return res.data;
}

export function getCollegesByState(state) {
  return axios.get(`${API_BASE_URL}/colleges?state=${state}`).then((res) => res.data);
}