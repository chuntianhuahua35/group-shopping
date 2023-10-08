// 它定义了一系列API端点，比如关于用户、通知和聊天的操作
// 定义了服务器应该如何响应来自客户端的请求，而那四个operation提供了实现那些响应所需要的数据库操作。这分层结构就像spring boot项目中的 controller，Service和数据访问层。但是这里把业务逻辑都写在了一个文件里所以这个server.js就像controller加service，其他几个operation就是DAO层


// Create express app
const moment = require('moment-timezone');
const express = require('express');

const webapp = express();
const cors = require('cors');
const path = require('path');

const userlib = require('./userdbOperation');
const postlib = require('./postdbOperations');
const notiflib = require('./notifydbOperation');
const chatlib = require('./chatdbOperation');

require('dotenv').config();
let db;

webapp.use(express.json());
webapp.use(
  express.urlencoded({
    extended: true,
  }),
);

webapp.use(cors({ credentials: true, origin: true }));

const url = 'mongodb+srv://cis350coding:cis350coding@cluster0.gptlr.mongodb.net/purchase-app';
webapp.use(express.static(path.join(__dirname, './group-shopping/build')));

webapp.post('/addPost', async (req, resp) => {
  // check the name was provided
  if (!req.body.itemName || req.body.itemName.length === 0) {
    resp.status(404).json({ error: 'itemName not provided' });
  }
  if (!req.body.itemNumTarget) {
    resp.status(404).json({ error: 'itemNumTarget not provided' });
  }
  if (!req.body.itemNumCurrent) {
    resp.status(404).json({ error: 'itemNumCurrent  not provided' });
  }
  if (!req.body.pricePerItem) {
    resp.status(404).json({ error: 'pricePerItem  not provided' });
  }
  if (!req.body.itemURL || req.body.itemURL.length === 0) {
    resp.status(404).json({ error: 'itemURL not provided' });
  }
  if (!req.body.itemDescription || req.body.itemDescription.length === 0) {
    resp.status(404).json({ error: 'itemDescription not provided' });
  }
  if (!req.body.ownerId || req.body.ownerId.length === 0) {
    resp.status(404).json({ error: 'ownerId  not provided' });
  }
  if (!req.body.tags || req.body.tags.length === 0) {
    resp.status(404).json({ error: 'itemURL not provided' });
  }
  if (!req.body.chatId || req.body.chatId.length === 0) {
    resp.status(404).json({ error: 'chatId not provided' });
  }
  try {
    moment.tz.setDefault('America/Los_Angeles');
    const myDate = moment(new Date()).format('DD/MMM/YYYY HH:mm');
    const userDetails = await userlib.getUserDetails(db, req.body.ownerId);
    const member = {
      userId: req.body.ownerId,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      quantity: req.body.itemNumCurrent,
    };
    const ownerInfo = {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      phone: userDetails.phone,
      email: userDetails.email,
    };
    const post = {
      ...req.body,
      ownerInfo,
      comments: [],
      createdAt: myDate,
      status: 0,
      group: [member],
    };
    const result = await postlib.addPost(db, post);
    const currentUser = { userId: member.userId, fieldToChange: "posts", newValue: String(result), oldPassword: null, };
    console.log(currentUser);
    await userlib.modifyUser(db, currentUser);
    // send the response
    return resp.status(201).json({ success: true, data: result, error: null });
  } catch (err) {
    return resp.status(500).json({ success: false, data: null, error: err });
  }
});

webapp.delete('/deletePost/:postId', async (req, resp) => {
  const { postId } = req.params;
  try {
    const result = await postlib.deletePost(db, postId);
    if (result) {
      return resp.status(201).json({ success: true, error: null });
    } else {
      return resp.status(201).json({ success: false, error: null });
    }
  } catch (err) {
    return resp.status(500).json({ success: false, error: err });
  }
});

webapp.post('/addComment', async (req, resp) => {
  // check the name was provided
  if (!req.body.authorId || req.body.authorId.length === 0) {
    resp.status(404).json({ error: 'username not provided' });
  }
  if (!req.body.postId || req.body.postId.length === 0) {
    resp.status(404).json({ error: 'username not provided' });
  }
  if (!req.body.content || req.body.content.length === 0) {
    resp.status(404).json({ error: 'username not provided' });
  }
  try {
    const userDetails = await userlib.getUserDetails(db, req.body.authorId);
    await postlib.addComment(
      db,
      { ...req.body, firstName: userDetails.firstName, lastName: userDetails.lastName },
    );
    // send the response
    return resp.status(201).json({ success: true, error: null });
  } catch (err) {
    return resp.status(500).json({ success: false, error: err });
  }
});

webapp.get('/getPost/:postId', async (req, resp) => {
  // check the name was provided
  const { postId } = req.params;
  try {
    const result = await postlib.getPost(db, postId);
    // send the response
    return resp.status(201).json({ success: true, data: result, error: null });
  } catch (err) {
    return resp.status(500).json({ success: false, data: null, error: err });
  }
});

webapp.get('/getSortedPostBySearch/:startIdx/:endIdx', async (req, resp) => {
  // check the name was provided
  const {
    startIdx, endIdx,
  } = req.params;
  const keywords = req.query.keywords ? req.query.keywords : '';
  const tags = req.query.tags ? req.query.tags : [];
  try {
    const result = await postlib.getSortedPostBySearch(db, startIdx, endIdx, keywords, tags);
    // send the response
    return resp.status(201).json({ success: true, data: result, error: null });
  } catch (err) {
    return resp.status(500).json({ success: false, data: null, error: err });
  }
});

webapp.post('/joinGroup', async (req, resp) => {
  // check the name was provided
  if (!req.body.userId || req.body.userId.length === 0) {
    resp.status(404).json({ error: 'userId not provided' });
  }
  if (!req.body.postId || req.body.postId.length === 0) {
    resp.status(404).json({ error: 'postId not provided' });
  }
  if (!req.body.quantity) {
    resp.status(404).json({ error: 'quantity not provided' });
  }
  try {
    const userDetails = await userlib.getUserDetails(db, req.body.userId);

    await postlib.joinGroup(db, {
      ...req.body,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
    });
    // send the response
    return resp.status(201).json({ success: true, error: null });
  } catch (err) {
    return resp.status(500).json({ success: false, error: err });
  }
});

webapp.post('/leaveGroup', async (req, resp) => {
  // check the name was provided
  if (!req.body.userId || req.body.userId.length === 0) {
    resp.status(404).json({ error: 'userId not provided' });
  }
  if (!req.body.postId || req.body.postId.length === 0) {
    resp.status(404).json({ error: 'postId not provided' });
  }
  try {
    await postlib.leaveGroup(db, req.body);
    // send the response
    resp.status(201).json({ success: true, error: null });
  } catch (err) {
    resp.status(500).json({ success: false, error: err });
  }
});

webapp.post('/changePostStatus', async (req, resp) => {
  // check the name was provided
  if (!req.body.userId || req.body.userId.length === 0) {
    resp.status(404).json({ error: 'userId not provided' });
  }
  if (!req.body.postId || req.body.postId.length === 0) {
    resp.status(404).json({ error: 'postId not provided' });
  }
  if (req.body.newStatus == null || !typeof (req.body.newStatus) === 'number') {
    resp.status(404).json({ error: 'status not provided' });
  }
  try {
    const post = await postlib.getPost(db, req.body.postId);
    await postlib.changePostStatus(db, { ...req.body, ownerId: post.ownerId });
    // send the response
    resp.status(201).json({ success: true, error: null });
  } catch (err) {
    resp.status(500).json({ success: false, error: err });
  }
});

// # ---------------------------------------- Below is user db ----------------------- #
// registration endpoint

webapp.post('/createUser', async (req, resp) => {
  if (!req.body.firstName || req.body.firstName.length === 0) {
    resp.status(404).json({ error: 'firstName not provided' });
  } else if (!req.body.phone.countryCode || req.body.phone.countryCode === 0) {
    resp.status(404).json({ error: 'country code not provided' });
  } else if (!req.body.phone.phoneNumber || req.body.phone.phoneNumber === 0) {
    resp.status(404).json({ error: 'phone number not provided' });
  } else if (!req.body.email || req.body.email === 0) {
    resp.status(404).json({ error: 'phone number not provided' });
  } else if (!req.body.password || req.body.password === 0) {
    resp.status(404).json({ error: 'password not provided' });
  } else if (!req.body.interests) {
    resp.status(404).json({ error: 'interests not provided' });
  }
  // add the other argument checks
  try {
    await userlib.createUser(db, req.body);
    // send the response
    resp.status(201).json({ success: true, error: null });
  } catch (err) {
    resp.status(500).json({ success: false, error: err });
  }
});

webapp.post('/forget', async (req, resp) => {
  if (!req.body.email || req.body.email.length === 0) {
    resp.status(404).json({ error: 'firstName not provided' });
  } else if (!req.body.phone.countryCode || req.body.phone.countryCode === 0) {
    resp.status(404).json({ error: 'country code not provided' });
  } else if (!req.body.phone.phoneNumber || req.body.phone.phoneNumber === 0) {
    resp.status(404).json({ error: 'phone number not provided' });
  } else if (!req.body.newPassword || req.body.newPassword.length === 0) {
    resp.status(404).json({ error: 'new password not provided' });
  }

  try {
    const res = await userlib.forgetPassword(db, req.body.phone, req.body.email, req.body.newPassword);
    // send the response
    if (res) {
      resp.status(201).json({ success: true, error: null });
    } else {
      resp.status(201).json({ success: false, error: null });
    }
  } catch (err) {
    resp.status(500).json({ success: false, error: err });
  }

})
// login with email endpoint
webapp.post('/loginUserWithEmail', async (req, resp) => {
  if (!req.body.email || req.body.email.length === 0) {
    resp.status(404).json({ error: 'email not provided' });
  } else if (!req.body.password || req.body.password.length === 0) {
    resp.status(404).json({ error: 'password not provided' });
  }
  try {
    const res = await userlib.loginUserWithEmail(db, req.body);
    // send the response
    if (res) {
      resp.status(201).json({ success: true, id: res, error: null });
    } else {
      resp.status(201).json({ success: false, id: res, error: null });
    }
  } catch (err) {
    resp.status(500).json({ success: false, id: null, error: err });
  }
});

// login with phone endpoint
webapp.post('/loginUserWithPhone', async (req, resp) => {
  if (!req.body.phone.countryCode || req.body.phone.countryCode.length === 0) {
    resp.status(404).json({ error: 'country code not provided' });
  } else if (!req.body.phone.phoneNumber || req.body.phone.phoneNumber.length === 0) {
    resp.status(404).json({ error: 'phone number not provided' });
  } else if (!req.body.password || req.body.password.length === 0) {
    resp.status(404).json({ error: 'password not provided' });
  }
  try {
    const res = await userlib.loginUserWithPhone(db, req.body);
    // send the response
    if (res) {
      resp.status(201).json({ success: true, id: res, error: null });
    } else {
      resp.status(201).json({ success: false, id: res, error: null });
    }
  } catch (err) {
    resp.status(500).json({ success: false, id: null, error: err });
  }
});

// modify user endpoint
webapp.put('/modify', async (req, resp) => {
  try {
    const res = await userlib.modifyUser(db, req.body);
    // send the response
    if (res) {
      resp.status(201).json({ success: true, error: null }); 
    } else {
      resp.status(201).json({ success: false, error: null });
    }
  } catch (err) {
    resp.status(500).json({ success:false, error: 'try again later' });
  }
});

// get user details endpoint
webapp.get('/getUserDetails', async (req, resp) => {
  try {
    const id = req.query.id ? req.query.id : '';
    const result = await userlib.getUserDetails(db, id);
    // send the response
    resp.status(201).json({ success: true, data: result, error: null});
  } catch (err) {
    resp.status(500).json({ success: true, data: null, error: 'try again later' });
  }
});

// get password endpoint
webapp.get('/getPassword', async (req, resp) => {
  let result;
  try {
    const id = req.query.id ? req.query.id : '';
    result = await userlib.getPassword(db, id);
    resp.status(201).json({ success: true, data: result, error: null });
  } catch (err) {
    resp.status(500).json({ success: false, data: null, error: 'try again later' });
  }
});

// # ---------------------------------------- Below is notif db ----------------------- #

webapp.post('/addNotification', async (req, resp) => {
  if (!req.body.userIds || req.body.userIds.length === 0) {
    resp.status(404).json({ error: 'userIds not provided' });
  } else if (!req.body.content || req.body.content.length === 0) {
    resp.status(404).json({ error: 'content not provided' });
  } 
  try {
    const res = await notiflib.addNotif(db, req.body.userIds, req.body.content);
    // send the response
    if (res) {
      resp.status(201).json({ success: true, data: res, error: null });
    } 
  } catch (err) {
    resp.status(500).json({ success: false, id: null, error: err });
  }
});

webapp.get('/getNotificationForUser/:userId', async (req, resp) => {
  const { userId } = req.params;
  try {
    const result = await notiflib.getNotifForUser(db, userId);
    // send the response
    resp.status(201).json({ success: true, data: result, error: null });
  } catch (err) {
    resp.status(500).json({ success: false, data: null, error: err });
  }
});

webapp.delete('/deletNotifForUser/:notifId', async (req, resp) => {
  const { notifId } = req.params;
  try {
    await notiflib.deletNotifForUser(db, notifId);
    // send the response
    resp.status(201).json({ success: true,  error: null });
  } catch (err) { 
    resp.status(500).json({ success: false, error: err });
  }
});

// # -------------------------------- Below is Chat db -------------------------------- #

webapp.post('/addChat', async (req, resp) => {
  //check the name was provided
  if (!req.body.groupName || req.body.groupName.length  === 0){
    resp.status(404).json( {error: 'groupName was not provided' });
  }
  try {
    const result = await chatlib.addChat(db, req.body.groupName)
    // send the response
    if (result){
      resp.status(201).json({ success: true, data: result, error: null });
    } else {
      resp.status(201).json({ success: false, data: null, error: null });
    }
  } catch (err) {
    resp.status(500).json({ success: false, data: null, error: err });
  }

});

webapp.post('/addChatGroupMember', async (req, resp) => {
  //check the userid was provided
  if (!req.body.userId || req.body.userId.length === 0){
    resp.status(404).json( {error: 'userId was not provided'});
  }

  //check the postid was provided
  if (!req.body.chatId || req.body.chatId.length === 0){
    resp.status(404).json( {error: 'chatId was not provided'});
  }

  try {
    const result = await chatlib.addChatGroupMember(db, req.body.userId, req.body.chatId)
    // send the response
    if (result){
      resp.status(201).json({ success: true, data: result, error: null });
    } else {
      resp.status(201).json({ success: false, data: null, error: null });
    }
  } catch (err) {
    resp.status(500).json({ success: false, data: null, error: err });
  }
})

webapp.post('/leaveChatGroupMember', async (req, resp) => {
  //check the userid was provided
  if (!req.body.userId || req.body.userId.length === 0){
    resp.status(404).json( {error: 'userId was not provided'});
  }

  //check the postid was provided
  if (!req.body.chatId || req.body.chatId.length === 0){
    resp.status(404).json( {error: 'chatId was not provided'});
  }

  try {
    const result = await chatlib.leaveChatGroupMember(db, req.body.userId, req.body.chatId)
    // send the response
    if (result){
      resp.status(201).json({ success: true, data: result, error: null });
    } else {
      resp.status(201).json({ success: false, data: null, error: null });
    }
  } catch (err) {
    resp.status(500).json({ success: false, data: null, error: err });
  }
})

webapp.get('/getChat/:chatId', async (req, resp) => {
  // check the name was provided
  const { chatId } = req.params;
  try {
    const result = await chatlib.getChat(db, chatId)
    // send the response
    if (result){
      resp.status(201).json({ success: true, data: result, error: null });
    } else {
      resp.status(201).json({ success: false, data: null, error: null });
    }
  } catch (err) {
    resp.status(500).json({ success: false, data: null, error: err });
  }
});

webapp.post('/postComment', async (req, resp) => {
  // check the userId was provided
  if (!req.body.userName || req.body.userName.length === 0){
    resp.status(404).json( {error: 'userName was not provided'});
  }

  //check the postid was provided
  if (!req.body.chatId || req.body.chatId.length === 0){
    resp.status(404).json( {error: 'chatId was not provided'});
  }

  if (!req.body.comment || req.body.comment.length === 0){
    resp.status(404).json( {error: 'comment was not provided'});
  }

  try {
    console.log('server')
    const result = await chatlib.postComment(db, req.body.userName, req.body.chatId, req.body.comment)
    // send the response
    if (result){
      resp.status(201).json({ success: true, data: result, error: null });
    } else {
      resp.status(201).json({ success: false, data: null, error: null });
    }
  } catch (err) {
    resp.status(500).json({ success: false, data: null, error: err });
  }

})


// wildcard endpoint - send react app
webapp.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './group-shopping/build'));
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});

// Start server
const port = process.env.PORT || 8080;
webapp.listen(port, async () => {
  db = await userlib.connect(url);
  console.log(`Server running on port:${port}`);
});
