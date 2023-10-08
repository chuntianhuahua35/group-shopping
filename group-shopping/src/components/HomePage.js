// 主页搜索帖子的功能，显示当前登录的用户信息，以及列出了相关的帖子

/* eslint-disable no-underscore-dangle */
import React from 'react';
import '../assets/HomePage.css';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import AccountMenu from './AccountMenu';
import Message from './Message';
import Post from './Post';

const PostDB = require('../modules/PostDB');

const storage = window.localStorage;

export default function HomePage() {
  const navigate = useNavigate();
  const currentUser = storage.getItem('UserID');
  const [login, setLogin] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  const [keyword, setKeyword] = React.useState('');

  React.useEffect(() => {
    if (currentUser !== null) {
      setLogin(true);
    }
  }, [currentUser]);

  const loginHandler = () => {
    navigate('/Login');
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    await PostDB.getSortedPostBySearch(0, 19, keyword, [], (success, data, error) => {
      if (success) {
        setPosts(data);
      } else {
        // handle error
        console.log(error);
      }
    });
  };

  React.useEffect(() => {
    PostDB.getSortedPostBySearch(0, 19, '', [], (success, data, error) => {
      if (success) {
        setPosts(data);
      } else {
        // handle error
        console.log(error);
      }
    });
  }, []);

  return (
    <div>
      <div className="top-layout">

        <div className="search-container">
          <form className="search-self" onSubmit={(e) => searchHandler(e)}>
            <Grid container item alignItems="center" display="flex" spacing={2}>
              <Grid item alignItems="center" display="flex" xs={11}>
                <InputBase
                  fullWidth
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search"
                  style={{ marginLeft: '3%' }}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </Grid>
              <Grid item alignItems="center" display="flex" xs={1}>
                <IconButton
                  type="submit"
                  sx={{ p: '10px' }}
                  aria-label="search"
                >
                  <SearchIcon color="primary" />
                </IconButton>
              </Grid>
            </Grid>
          </form>
        </div>

        <div style={{ marginLeft: '42%', height: 40, width: 40 }}>
          {login
            ? <AccountMenu setLoginStatus={setLogin} />
            : (
              <Button onClick={() => loginHandler(true)}> Login </Button>
            )}
        </div>
        <Message />
      </div>
      <Divider style={{ marginTop: '5%' }} />
      <div className="post-layout">
        {posts.map((post) => (
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
  );
}
