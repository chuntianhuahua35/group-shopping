// 用户通知功能

const { MongoClient, ObjectId } = require('mongodb');
const moment = require('moment-timezone');

const addNotif = async (
  db,
  userList,
  content,
) => {
  const notifList = [];
  moment.tz.setDefault('America/Los_Angeles');
  const mydate = moment(new Date()).format('DD/MMM/YYYY HH:mm');
  userList.forEach((user) =>
  { notifList.push({ userId: ObjectId(user), content: content, creatAt: mydate }) })
  try {
    await db.collection('notifDB').insertMany(notifList);
  } catch (e) {
    return ('fail to add new notif');
  }
};

const getNotifForUser = async (
  db,
    userId,
) => {
  try {
    const result = await db.collection('notifDB').find({ userId: ObjectId(userId) }).toArray();
    return result;
  } catch (e) {
    return ('fail to get notif for user');
  }
};

const deletNotifForUser = async (
  db,
  notifId,
) => {
  try {
    await db.collection('notifDB').deleteOne({ _id: ObjectId(notifId) });
  } catch (e) {
    return ('fail to delete notif for user');
  }
};

module.exports = {
  addNotif,
  getNotifForUser,
  deletNotifForUser,
};
