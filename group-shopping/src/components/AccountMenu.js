// 从头像触发的下拉菜单，用户可以通过此菜单进行导航，进行发帖、聊天、修改个人资料,注销等操作

/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import { deepOrange } from '@mui/material/colors';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Logout from '@mui/icons-material/Logout';
import Link from '@mui/material/Link';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CommentIcon from '@mui/icons-material/Comment';
import { Link as RouterLink } from "react-router-dom";

const storage = window.localStorage;
// const NotifDB = require('../modules/NotificationDB');

// eslint-disable-next-line react/prop-types
export default function AccountMenu({ setLoginStatus }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const author = storage.getItem('UserName');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    storage.clear();
    setLoginStatus(false);
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

  if (author === null) {
    return null;
  }

  return (
    <div>

      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              {...stringAvatar(author)}
              sx={{ width: 40, height: 40, backgroundColor: deepOrange[500] }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/NewPost"
        >
          <MenuItem>
            <ListItemIcon>
              <PostAddIcon fontSize="small" />
            </ListItemIcon>
            New Post
          </MenuItem>
        </Link>

        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/Chat"
        >
          <MenuItem>
            <ListItemIcon>
              <CommentIcon fontSize="small" />
            </ListItemIcon>
            Chat
          </MenuItem>
        </Link>

        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/Profiles"
        >
          <MenuItem>
            <ListItemIcon>
              <AccountBoxIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
        </Link>

        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/SettingProfile"
        >
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings profile
          </MenuItem>
        </Link>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
