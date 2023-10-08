/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Avatar from '@mui/material/Avatar';
import '../../assets/Comment.css';

// eslint-disable-next-line react/prop-types
export default function Comment({ author, content, time }) {
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

  return (
    <div className="comment-container">

      <div className="comment-avatar">
        <Avatar {...stringAvatar(author)} />
      </div>

      <div className="comment">

        <div className="author-time-container">

          <div className="comment-author">
            {author}
          </div>
          <div>
            {time}
          </div>

        </div>

        <div className="comment-body">
          {content}
        </div>

      </div>

    </div>
  );
}
