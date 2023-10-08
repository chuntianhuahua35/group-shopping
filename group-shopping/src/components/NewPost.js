// 新建帖子，输入商品相关信息，并选择相关标签，并自动创建一个与该帖子关联的聊天组，让其他用户或买家能够与卖家进行沟通

import * as React from 'react';
import '../assets/NewPost.css';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import Link from '@mui/material/Link';
import { Link as RouterLink } from "react-router-dom";
import tagsList from './Data/tags.json';

const PostDB = require('../modules/PostDB');
const ChatDB = require('../modules/ChatDB');

const storage = window.localStorage;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const tags = tagsList.map((tag) => tag.label);

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect() {
  const navigate = useNavigate();

  const [itemName, setItemName] = React.useState(null);
  const [priceItem, setPriceItem] = React.useState(null);
  const [targetQuantity, setTargetQuantity] = React.useState(null);
  const [currentQuantity, setCurrentQuantity] = React.useState(null);
  const [itemLink, setItemLink] = React.useState(null);
  const [description, setDescription] = React.useState(null);
  const [groupName, setGroupName] = React.useState(null);
  const [interests, setInterests] = React.useState([]);
  const ownerId = storage.getItem('UserID');

  const handleNewPost = async (e) => {
    e.preventDefault();

    await ChatDB.addChat(
      groupName,
      (firstSuccess, chatId, error) => {
        if (firstSuccess) {
          ChatDB.addChatGroupMember(ownerId, chatId, (thirdSuccess) => {
            if (thirdSuccess) {
              console.log('you successfully add chat group member');
            } else {
              //
            }
          });
          console.log('successfully add new chat');
          PostDB.addPost(
            itemName,
            targetQuantity,
            currentQuantity,
            priceItem,
            itemLink,
            description,
            ownerId,
            interests,
            chatId,
            (secondSuccess, data) => {
              if (secondSuccess) {
                console.log('you successfully post new post', data);
                navigate(`/PostDetails/${data}`);
              } else {
                //
              }
            },
          );
        } else {
          console.log(error);
        }
      },
    );
  };

  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setInterests(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>

      <div className="back-button-newPost">
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
        >
          <HomeIcon fontSize="large" />
        </Link>
      </div>

      <h1 className="new-post-title">New Post</h1>

      <div className="new-post-card">
        <form className="new-post-form" onSubmit={handleNewPost}>
          <Stack spacing={3}>
            <TextField
              label="Item Name"
              required
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              label="Price/Item"
              required
              onChange={(e) => setPriceItem(e.target.value)}
            />
            <TextField
              label="Target Quantity"
              required
              onChange={(e) => setTargetQuantity(e.target.value)}
            />
            <TextField
              label="Current Quantity"
              required
              onChange={(e) => setCurrentQuantity(e.target.value)}
            />
            <TextField
              label="Item Link"
              required
              onChange={(e) => setItemLink(e.target.value)}
            />
            <TextField
              label="Description"
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              label="GroupName"
              required
              onChange={(e) => setGroupName(e.target.value)}
            />

            <FormControl sx={{ m: 1 }} fullWidth>
              <InputLabel id="demo-multiple-name-label">Tags</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={interests}
                onChange={handleChange}
                input={<OutlinedInput label="Name" />}
                MenuProps={MenuProps}
              >
                {tags.map((tag) => (
                  <MenuItem
                    key={tag}
                    value={tag}
                    style={getStyles(tag, interests, theme)}
                  >
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="post-cancel">
              <Button type="variant" onClick={() => navigate('/')}>Cancel</Button>
            </div>

            <Button type="submit" variant="contained" color="primary">
              submit
            </Button>

          </Stack>
        </form>
      </div>

    </div>
  );
}
