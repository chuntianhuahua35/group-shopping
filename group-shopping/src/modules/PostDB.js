// 定义了与帖子和评论相关的各种前端操作，如添加、评论、获取、加入团购、离开团购、更改帖子状态和删除等 
/* Post and comment operations */
import axios from 'axios';

const rootURL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';
async function addPost(
  itemName,
  itemNumTarget,
  itemNumCurrent,
  pricePerItem,
  itemURL,
  itemDescription,
  ownerId,
  tags,
  chatId,
  callback,
) {
  const response = await axios.post(`${rootURL}/addPost`, {
    itemName: `${itemName}`,
    itemNumTarget: Number(itemNumTarget),
    itemNumCurrent: Number(itemNumCurrent),
    pricePerItem: Number(pricePerItem),
    itemURL: `${itemURL}`,
    itemDescription: `${itemDescription}`,
    ownerId: `${ownerId}`,
    tags,
    chatId,
  });
  const result = response.data;
  return callback(result.success, result.data, result.error);
}

async function addComment(authorId, postId, content, callback) {
  const response = await axios.post(`${rootURL}/addComment`, {
    authorId: `${authorId}`,
    postId: `${postId}`,
    content: `${content}`,
  });
  const result = response.data;
  return callback(result.success, result.error);
}

async function getPost(id, callback) {
  const response = await axios.get(`${rootURL}/getPost/${id}`, {
  });
  const result = response.data;
  return callback(result.success, result.data, result.error);
}

async function getSortedPostBySearch(startIdx, endIdx, keywords, tags, callback) {
  let url = `${rootURL}/getSortedPostBySearch/${startIdx}/${endIdx}/?keywords=${keywords}`;
  tags.forEach((tag) => { url += `&tags[]=${tag}`; });
  const response = await axios.get(url);
  const result = response.data;
  return callback(result.success, result.data, result.error);
}

async function joinGroup(userId, postId, quantity, callback) {
  const response = await axios.post(`${rootURL}/joinGroup`, {
    userId: `${userId}`,
    postId: `${postId}`,
    quantity: Number(quantity),
  });
  const result = response.data;
  return callback(result.success, result.error);
}

async function leaveGroup(userId, postId, callback) {
  const response = await axios.post(`${rootURL}/leaveGroup`, {
    userId: `${userId}`,
    postId: `${postId}`,
  });
  const result = response.data;
  return callback(result.success, result.error);
}

async function changePostStatus(userId, postId, newStatus, callback) {
  const response = await axios.post(`${rootURL}/changePostStatus`, {
    userId: `${userId}`,
    postId: `${postId}`,
    newStatus: Number(newStatus),
  });
  const result = response.data;
  return callback(result.success, result.error);
}

async function deletePost(postId, callback) {
  const response = await axios.delete(`${rootURL}/deletePost/${postId}`, {
  });
  const result = response.data;
  return callback(result.success, result.error);
}

export {
  addPost,
  addComment,
  getPost,
  joinGroup,
  leaveGroup,
  changePostStatus,
  getSortedPostBySearch,
  deletePost,
};
