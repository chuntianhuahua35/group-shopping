// 允许用户查看他们创建的帖子和他们添加到愿望清单的帖子。

/* eslint-disable no-underscore-dangle */
import React from 'react';
import '../assets/Profiles.css';
import HomeIcon from '@mui/icons-material/Home';
import Link from '@mui/material/Link';
import Post from './Post';
import { Link as RouterLink } from "react-router-dom";
import AccountMenu from './AccountMenu';

const UserDB = require('../modules/UserDB');
const PostDB = require('../modules/PostDB');

const storage = window.localStorage;

export default function Profiles() {
  const [ownPost, setOwnPost] = React.useState([]);
  const [wishListPost, setWishListPost] = React.useState([]);
  const userID = storage.getItem('UserID');

  React.useEffect(() => {
    UserDB.getUserDetails(userID, (success, userInfo) => {
      if (success) {
        userInfo.posts.forEach((singleId) => {
          PostDB.getPost(singleId, (successful, postData) => {
            if (successful) {
              setOwnPost((arr) => [...arr, postData]);
            } else {
              //
            }
          });
        });
        userInfo.wishList.forEach((wishListId) => {
          PostDB.getPost(wishListId, (successful, postData) => {
            if (successful) {
              setWishListPost((arr) => [...arr, postData]);
            } else {
              //
            }
          });
        });
      }
    });
  }, [userID]);

  if (ownPost === null) {
    return null;
  }

  const dropDuplicate = (arr) => {
    const uniqueId = [];
    const uniqueArr = [];
    arr.forEach((elem) => {
      if (elem !== null && !uniqueId.includes(elem._id)) {
        uniqueArr.push(elem);
        uniqueId.push(elem._id);
      }
    });

    return uniqueArr;
  };

  return (
    <div>
      <div className="back-button-profiles">
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
        >
          <HomeIcon fontSize="large" />
        </Link>
      </div>

      <h1 className="title-layout">Profile</h1>
      <div style={{ marginLeft: '92%' }}><AccountMenu /></div>

      <div className="profiles-post-container">
        <div className="profiles-post">
          <h2>Your post:</h2>
          {dropDuplicate(ownPost).map((post) => (
            <Post
              title={post.itemName}
              content={`This post is created by ${post.ownerInfo.firstName} ${post.ownerInfo.lastName} 
                      for ${post.itemName} with price $${post.pricePerItem}`}
              createdAt={post.createdAt}
              id={post._id}
              key={post._id}
            />
          ))}
        </div>
        <div className="profiles-wishlist">
          <h2>Your wish list:</h2>
          {dropDuplicate(wishListPost).map((post) => (
            <Post
              title={post.itemName}
              content={`This post is created by ${post.ownerInfo.firstName} ${post.ownerInfo.lastName} 
                      for ${post.itemName} with price $${post.pricePerItem}`}
              createdAt={post.createdAt}
              id={post._id}
              key={post._id}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
