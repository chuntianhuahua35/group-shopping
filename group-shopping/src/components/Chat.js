// 显示与交互聊天功能

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-props-no-spreading */
import '../assets/Chat.css';
import React from 'react';
// import { width } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import GroupIcon from '@mui/icons-material/Group';
import { TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import Link from '@mui/material/Link';
import { Link as RouterLink } from "react-router-dom";
import { v4 as uuid } from 'uuid';

const ChatDB = require('../modules/ChatDB');
const UserDB = require('../modules/UserDB');
const PostDB = require('../modules/PostDB');

const storage = window.localStorage;

export default function Profiles() {
  const userID = storage.getItem('UserID');
  const [comment, setComment] = React.useState([]);
  const [userName, setUserName] = React.useState('');
  const [allChat, setAllChat] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [chatTitle, setChatTitle] = React.useState([]);
  const [currentGroupName, setCurrentGroupName] = React.useState(null);
  const chatId = React.useRef('');

  function useInterval(callback, delay) {
    const savedCallback = React.useRef();

    // Remember the latest callback.
    React.useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    React.useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
      return null;
    }, [delay]);
  }

  const handleDisplay = async (currentGroup) => {
    allChat.forEach((chat) => {
      if (chat.groupName === currentGroup) {
        chatId.current = chat.id;
        setMessages(chat.messages);
        setChatTitle(chat.groupName);
      }
    });
  };

  useInterval(() => {
    UserDB.getUserDetails(userID, (firstSuccess, userDetails) => {
      if (firstSuccess) {
        setUserName(`${userDetails.firstName} ${userDetails.lastName}`);
        userDetails.posts.forEach((postId) => {
          PostDB.getPost(postId, (secondSuccess, postData) => {
            if (secondSuccess) {
              ChatDB.getChat(postData.chatId, (thirdSuccess, chatData) => {
                if (thirdSuccess) {
                  setAllChat((arr) => [...arr, {
                    groupName: chatData.groupName,
                    messages: chatData.messages,
                    id: chatData._id,
                  }]);
                } else {
                  //
                }
              });
            } else {
              //
            }
          });
        });
      } else {
        //
      }
    });
    if (currentGroupName !== null) {
      handleDisplay(currentGroupName);
    }
  }, 1000);

  const handleAddComment = async (e) => {
    if (e.keyCode === 13 && comment.length !== 0) {
      console.log('buyaoba');
      e.preventDefault();
      await ChatDB.postComment(userName, chatId.current, comment, (success, error) => {
        if (success) {
          setComment('');
          console.log('handleaddcommentSuccess');
        } else {
          console.log(error);
        }
      });
    }
  };

  React.useEffect(() => {
    handleDisplay(currentGroupName);
  }, [currentGroupName]);

  const dropDuplicate = (arr) => {
    const uniqueId = [];
    const uniqueArr = [];
    arr.forEach((elem) => {
      if (elem !== null && !uniqueId.includes(elem.groupName)) {
        uniqueArr.push(elem);
        uniqueId.push(elem.groupName);
      }
    });

    return uniqueArr;
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}`,
    };
  }

  if (allChat === null) {
    return null;
  }

  return (
    <div className="chat-body-container">

      <div className="account-container">
        <div className="account-avatar">
          <Avatar
            {...stringAvatar(userName)}
            sx={{ width: 37, height: 37, backgroundColor: deepOrange[500] }}
          />
        </div>
        <div className="back-button">
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/"
          >
            <HomeIcon fontSize="large" />
          </Link>
        </div>
      </div>

      <div className="group-container">
        { dropDuplicate(allChat).map((group) => (
          <button
            className="map-icon-group-name"
            key={group.groupName}
            type="button"
            onClick={() => setCurrentGroupName(group.groupName)}
          >
            <div className="map-icon">
              <GroupIcon sx={{ fontSize: 35 }} style={{ color: 'black' }} />
            </div>
            <div className="map-group-name">
              {group.groupName}
            </div>
          </button>
        ))}
      </div>

      <div className="chatTitle-display-text-container">

        <div className="chatTitle-container">
          {chatTitle}
        </div>

        <Divider />

        <div className="display-container" id="display-container">
          {messages === undefined ? null : messages.map((message) => (
            <div key={uuid()}>
              { (message[0] !== storage.UserName)
                ? (
                  <div className="icon-content">
                    <div className="icon-head">
                      <Avatar sx={{ bgcolor: deepOrange[500] }} {...stringAvatar(message[0])} />
                    </div>
                    <div className="content-talk">
                      {message[1]}
                    </div>
                  </div>
                )
                : (
                  <div className="my-icon-content">
                    <div className="my-content-talk">
                      {message[1]}
                    </div>
                    <div className="my-icon-head">
                      <Avatar sx={{ bgcolor: deepOrange[500] }} {...stringAvatar(message[0])} />
                    </div>
                  </div>
                )}

            </div>
          ))}

        </div>

        <form className="chat-text-container">
          <TextField
            required
            label="Message"
            multiline
            fullWidth
            minRows={4}
            maxRows={4}
            onKeyDown={(e) => handleAddComment(e)}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
        </form>

      </div>

    </div>

  );
}
