// 提供了用户相关的功能，包括创建账户、登录、修改用户信息、获取用户详细信息和密码重置等功能

/* User-related operations */
import axios from 'axios';

const rootURL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';
async function createUser(
  countryCode,
  phoneNumber,
  email,
  password,
  firstName,
  lastName,
  interests,
  callback,
) {
  const response = await axios.post(`${rootURL}/createUser`, {
    phone: { countryCode: `${countryCode}`, phoneNumber: `${phoneNumber}` },
    email: `${email}`,
    firstName: `${firstName}`,
    lastName: `${lastName}`,
    posts: [],
    wishList: [],
    interests,
    password: `${password}`,
    createdAt: new Date(),
    lastCheckNotification: null,
  });
  const result = response.data;
  return callback(result.success, result.error);
}

async function forgetPassword(
  countryCode,
  phoneNumber,
  email,
  newPassword,
  callback,
) {
  const response = await axios.post(`${rootURL}/forget`, {
    phone: { countryCode: `${countryCode}`, phoneNumber: `${phoneNumber}` },
    email: `${email}`,
    newPassword: `${newPassword}`,
  });
  const result = response.data;
  return callback(result.success, result.error);
}

async function loginUserWithPhone(
  countryCode,
  phoneNumber,
  password,
  callback,
) {
  const response = await axios.post(`${rootURL}/loginUserWithPhone`, {
    phone: { countryCode: `${countryCode}`, phoneNumber: `${phoneNumber}` },
    password: `${password}`,
  });
  const result = response.data;
  return callback(result.success, result.id, result.error);
}

async function loginUserWithEmail(
  email,
  password,
  callback,
) {
  const response = await axios.post(`${rootURL}/loginUserWithEmail`, {
    email: `${email}`,
    password: `${password}`,
  });
  const result = response.data;
  return callback(result.success, result.id, result.error);
}
// newvalue postid wishlist
async function modifyUser(id, fieldToChange, newValue, oldPassword, callback) {
  const response = await axios.put(`${rootURL}/modify`, {
    userId: id,
    fieldToChange,
    newValue,
    oldPassword,
  });
  const result = response.data;
  return callback(result.success, result.error);
}

async function getPassword(
  id,
  callback,
) {
  const response = await axios.get(`${rootURL}/getPassword?id=${id}`, {});
  const result = response.data;
  return callback(result.success, result.data, result.error);
}

async function getUserDetails(
  id,
  callback,
) {
  const response = await axios.get(`${rootURL}/getUserDetails?id=${id}`, {});
  const result = response.data;
  return callback(result.success, result.data, result.error);
}

export {
  createUser,
  loginUserWithPhone,
  loginUserWithEmail,
  modifyUser,
  getUserDetails,
  getPassword,
  forgetPassword,
};
