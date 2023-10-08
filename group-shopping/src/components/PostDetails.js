// 特定帖子的详细信息，包括其商品信息、团购详情、相关评论等。同时，它还提供了一些互动功能，如加入或离开团购、添加评论和收藏帖子。

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import '../assets/PostDetails.css';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Divider from '@mui/material/Divider';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import { v4 as uuid } from 'uuid';
import Comment from './Forms/Comment';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 300,
  bgcolor: 'white',
  boxShadow: 100,
  p: 4,
};

const PostDB = require('../modules/PostDB');
const UserDB = require('../modules/UserDB');
const ChatDB = require('../modules/ChatDB');
const NotifDB = require('../modules/NotificationDB');

const storage = window.localStorage;

export default function PostDetails() {
  const postID = window.location.href.split('/').pop();
  const userID = storage.getItem('UserID');
  const [postDetails, setPostDetails] = React.useState(null);
  const [newComment, setNewComment] = React.useState('');
  const [flag, setFlag] = React.useState(0);
  const [chatId, setChatId] = React.useState(null);
  const [quantity, setQuantity] = React.useState(null);
  const [ownerId, setOwnerId] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [joined, setJoined] = React.useState(false);
  const [collected, setCollected] = React.useState(false);
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    UserDB.getUserDetails(userID, (success, data) => {
      if (success) {
        if (data.wishList.some((e) => e === postID)) {
          setCollected(true);
        } else {
          setCollected(false);
        }
      } else {
        // handle error
      }
    });
  }, [userID, postID]);

  React.useEffect(() => {
    PostDB.getPost(postID, (success, data, error) => {
      if (success) {
        console.log(data);
        setPostDetails(data);
        setChatId(data.chatId);
        // get the ownerId of current post
        setOwnerId(data.ownerId);
        if (data.group.some((e) => e.userId === userID)) {
          setJoined(true);
        } else {
          setJoined(false);
        }
      } else {
        // handle error
        console.log(error);
      }
    });
  }, [postID, userID, flag]);

  const handleAddComment = async () => {
    await PostDB.addComment(userID, postID, newComment, (success, error) => {
      if (success) {
        // handle success
        setNewComment('');
        setFlag(flag + 1);
      } else {
        // handle error
        console.log(error);
      }
    });
  };

  const handleJoinGroup = async () => {
    await PostDB.joinGroup(userID, postID, quantity, (firstSuccess, error) => {
      if (firstSuccess) {
        // handle success
        ChatDB.addChatGroupMember(userID, chatId, (secondSuccess) => {
          if (secondSuccess) {
            console.log('successfully add chat group member');
            NotifDB.createNotification([ownerId], 'someone join your group', (thirdSuccess) => {
              if (thirdSuccess) {
                console.log('successfully notify the owner');
              } else {
                //
              }
            });
          } else {
            //
          }
        });
        setFlag(flag + 1);
        handleClose();
      } else {
        // handle error
        console.log(error);
      }
    });
  };

  const handleLeaveGroup = async () => {
    await PostDB.leaveGroup(userID, postID, (success, error) => {
      if (success) {
        // handle success
        ChatDB.leaveChatGroupMember(userID, chatId, (secondSuccess) => {
          NotifDB.createNotification([ownerId], 'someone leave your group', (thirdSuccess) => {
            if (thirdSuccess) {
              console.log('successfully notify the owner');
            } else {
              //
            }
          });
          if (secondSuccess) {
            console.log('successfully leave chat group member');
          } else {
            //
          }
        });

        if (userID === postDetails.ownerId) {
          PostDB.deletePost(postID, (deleteSuccess, deleteErr) => {
            if (deleteSuccess) {
              //
              console.log('delete successfully');
            } else {
              //
              console.log('failed to delete post');
              console.log(deleteErr);
            }
          });
        }
        setFlag(flag + 1);
        handleClose();
      } else {
        // handle error
        console.log(error);
      }
    });
    navigate('/');
  };

  const handleCollect = async () => {
    // the current post has not been collected
    if (collected === false) {
      await UserDB.modifyUser(userID, 'wishList', postID, '', (success, error) => {
        if (success) {
          setCollected(true);
        } else {
          // handle error
          console.log(error);
        }
      });
    } else {
      // the current post has been collected, and
      // this will triger that the post being removed from the wish list
      // of the current user
      await UserDB.modifyUser(userID, 'wishList-withdraw', postID, '', (success, error) => {
        if (success) {
          setCollected(false);
        } else {
          // handle error
          console.log(error);
        }
      });
    }
  };
  if (postDetails === null) {
    return null;
  }

  return (
    <div>

      <div className="back-button-postDetails">
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
        >
          <HomeIcon fontSize="large" />
        </Link>
      </div>

      <div className="post-details-card">
        <div className="left-part">
          <h1 style={{ fontWeight: 'bold' }}>{postDetails.itemName}</h1>
          <h4 className="title">Item Details</h4>
          <div className="items-details-container">

            <div className="items-details">
              Target Quantity:
              {' '}
              {postDetails.itemNumTarget}
            </div>

            <div className="items-details">
              Current Quantity:
              {' '}
              {postDetails.itemNumCurrent}
            </div>

            <div className="items-details">
              Price/Item:
              {' '}
              {postDetails.pricePerItem}
            </div>

            <div className="items-details">
              Item Link:
              {' '}
              {postDetails.itemURL}
            </div>

            <div className="items-details">
              Description:
              {' '}
              {postDetails.itemDescription}
            </div>

          </div>
          <h4 className="title">Tags</h4>
          {postDetails.tags.map((tag) => (
            <div className="tags" key={tag}>{tag}</div>
          ))}
        </div>

        <div className="right-part">
          <h4 className="title" style={{ marginTop: '35%' }}>
            Group Details
          </h4>

          <div className="items-details-container">

            <div className="items-details">
              Group Size:
              {' '}
              {postDetails.group.length}
            </div>

            {/* <mdiCartCheck /> */}
            <div className="icon-position">

              {collected ? (
                <Button onClick={handleCollect}>
                  <FavoriteIcon sx={{ fontSize: 50 }} style={{ color: 'red' }} />
                </Button>
              )
                : (
                  <Button onClick={handleCollect}>
                    <FavoriteIcon sx={{ fontSize: 50 }} />
                  </Button>
                )}

              {joined ? (
                <Button onClick={handleOpen}>
                  {' '}
                  <ShoppingBasketIcon sx={{ fontSize: 50 }} style={{ color: 'red' }} />
                </Button>
              )
                : (
                  <Button onClick={handleOpen}>
                    {' '}
                    <ShoppingBasketIcon sx={{ fontSize: 50 }} />
                  </Button>
                )}

              {joined ? (
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >

                  <Box sx={modalStyle}>

                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      {postDetails.itemName}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      You have join group would you like to leave this group?
                    </Typography>

                    <Button style={{ float: 'right', marginTop: '20%' }} onClick={handleClose}>No</Button>
                    <Button style={{ float: 'right', marginTop: '20%' }} onClick={handleLeaveGroup}>Yes</Button>

                  </Box>
                </Modal>
              )

                : (
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={modalStyle}>

                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        {postDetails.itemName}
                      </Typography>

                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        How many
                        {' '}
                        {postDetails.itemName}
                        {' '}
                        you would like to buy.
                      </Typography>

                      <TextField
                        label="quantity"
                        multiline
                        minRows={1}
                        maxRows={1}
                        fullWidth
                        style={{ marginTop: '5%' }}
                        onChange={(e) => setQuantity(e.target.value)}
                      />

                      <Button style={{ float: 'right' }} onClick={handleJoinGroup}>Submit</Button>

                    </Box>
                  </Modal>
                )}

            </div>
          </div>
        </div>
      </div>

      <Divider style={{ width: '80%', marginLeft: '10%' }} />

      <div style={{ marginTop: '3%' }}>
        {postDetails.comments.map((comment) => (
          <Comment
            author={`${comment.author.firstName} ${comment.author.lastName}`}
            content={comment.content}
            time={comment.createdAt}
            key={uuid()}
          />
        ))}
      </div>

      <div className="comment-button-container">
        <div className="text-container">
          <TextField
            label="comment"
            multiline
            minRows={3}
            maxRows={3}
            fullWidth
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
          />
        </div>
        <div className="comment-button">
          <Button variant="contained" onClick={handleAddComment}>Comment</Button>
        </div>
      </div>

    </div>
  );
}
