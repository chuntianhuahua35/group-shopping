// 一个通知中心按钮，允许用户查看他们收到的通知，并提供了删除每条通知的选项

/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Box from '@mui/material/Box';
import '../assets/Message.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
// import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ClearIcon from '@mui/icons-material/Clear';

const storage = window.localStorage;
const NotifDB = require('../modules/NotificationDB');

// eslint-disable-next-line react/prop-types
export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  //   const [numMsg, setNumMsg] = React.useState(null);
  const [notes, setnotes] = React.useState([]);
  const [flag, setFlag] = React.useState(0);
  const userId = storage.getItem('UserID');
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    NotifDB.getNotificationsForUser(userId, (success, data) => {
      if (success) {
        setnotes([]);
        data.forEach((notif) => {
          setnotes((arr) => [...arr, notif]);
        });
        // setNumMsg(notes.length);
      }
    });
  }, [flag, userId]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (notes === null) {
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

  const handleDelete = async (messageId) => {
    await NotifDB.deleteNotifications(messageId, (firstSuccess) => {
      if (firstSuccess) {
        setFlag(flag + 1);
      }
    });
  };

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
            <Badge badgeContent={dropDuplicate(notes).length} color="primary">
              <NotificationsActiveIcon
                sx={{
                  width: 40, height: 40, color: 'black', marginLeft: '1%',
                }}
              />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        style={{ height: '350px', width: '300px' }}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflowY: 'scroll',
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
              right: 17,
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
        {dropDuplicate(notes).map((note) => (
          <div className="message-cancel-container">
            <MenuItem>
              {note.content}
            </MenuItem>

            <button type="button" className="cancel-button" onClick={() => handleDelete(note._id)}>
              <ClearIcon />
            </button>

          </div>
        ))}
      </Menu>
    </div>
  );
}
