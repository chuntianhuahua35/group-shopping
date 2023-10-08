// 与聊天相关的前端操作。它使用 axios 进行 HTTP 请求来与后端 API 交互

/* eslint-disable import/prefer-default-export */
/* Post and comment operations */
import axios from 'axios';

// const PostDB = require('./PostDB');
// const UserDB = require('./UserDB');

const rootURL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

async function addChat(groupName, callback) {
  const response = await axios.post(`${rootURL}/addChat`, {
    groupName: `${groupName}`,
  });
  const result = response.data;
  return callback(result.success, result.data, result.error);
}

async function getChat(chatId, callback) {
  const response = await axios.get(`${rootURL}/getChat/${chatId}`, {
  });
  const result = response.data;
  return callback(result.success, result.data, result.error);
}

async function addChatGroupMember(userId, chatId, callback) {
  const response = await axios.post(`${rootURL}/addChatGroupMember`, {
    userId: `${userId}`,
    chatId: `${chatId}`,
  });
  const result = response.data;
  return callback(result.success, result.error);
}

async function leaveChatGroupMember(userId, chatId, callback) {
  const response = await axios.post(`${rootURL}/leaveChatGroupMember`, {
    userId: `${userId}`,
    chatId: `${chatId}`,
  });
  const result = response.data;
  return callback(result.success, result.error);
}

async function postComment(userName, chatId, comment, callback) {
  console.log(userName);
  console.log('ChatDb');
  const response = await axios.post(`${rootURL}/postComment`, {
    userName: `${userName}`,
    chatId: `${chatId}`,
    comment: `${comment}`,
  });
  const result = response.data;
  return callback(result.success, result.error);
}

export {
  addChat,
  addChatGroupMember,
  leaveChatGroupMember,
  getChat,
  postComment,
};
