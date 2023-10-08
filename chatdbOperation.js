// 提供了实时聊天的功能

const { MongoClient, ObjectId } = require('mongodb');

// Connect to the DB and return the connection object

const connect = async (url) => {
    try {
      const conn = (await MongoClient.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
      )).db();
      console.log(`Connected to the database: ${conn.databaseName}`);
      return conn;
    } catch (err) {
      console.error(err);
      throw new Error('could not connect to the db');
    }
  };


const addChat = async (db, groupName) => {
  try {
    const result = await db.collection('chatDB').insertOne({groupName: groupName});
    console.log(`Create chat with name: ${result.insertedId}`);
    return result.insertedId;
  } catch (e) {
    throw new Error('fail to add new chat')
  }
};

const getChat = async (
  db,
  chatId,
) => {
  try {
    const result = await db.collection('chatDB').findOne({ _id: ObjectId(chatId) });
    return result;
  } catch (e) {
    throw new Error('fail to get chat');
  }
};

const addChatGroupMember = async (db, userId, chatId) => {
  try {
    await db.collection('chatDB').updateOne (
      {
        _id: ObjectId(chatId),
      },
      {
        $push: {
          groupMember: {
            userId,
          },
        },
      },
    );
    return true;
  } catch (e) {
    return false;
  }
};

const leaveChatGroupMember = async (db, userId, chatId) => {
  try {
    await db.collection('chatDB').updateOne (
      {
        _id: ObjectId(chatId),
      },
      {
        $pull: {
          groupMember: {
            userId,
          },
        },
      },
    );
    return true;
  } catch (e) {
    return false;
  }
};

const postComment = async (db, userName, chatId, comment) => {
  console.log('operation');
  try {
    await db.collection('chatDB').updateOne (
      {
        _id: ObjectId(chatId),
      },
      {
        $push: {
          messages: [
            userName, comment
          ],
        },
      },
    );
    return true;
  } catch (e) {
    return false;
  }
  
}

module.exports = {
    connect,
    addChat,
    getChat,
    addChatGroupMember,
    leaveChatGroupMember,
    postComment,
  };

