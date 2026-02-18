import axios from "axios";

const BASE_URL = "http://89.116.20.215:9095/api";

export const getDepartments = async () => {
  return await axios.get(`${BASE_URL}/Department`);
};

export const createDepartment = async (data) => {
  return await axios.post(`${BASE_URL}/Department`, data);
};

export const updateDepartment = async (id, data) => {
  return await axios.put(`${BASE_URL}/Department/${id}`, data);
};

export const deleteDepartment = async (id) => {
  return await axios.delete(`${BASE_URL}/Department/${id}`);
};
