// 表示单个帖子的预览或摘要，用户可以点击帖子以查看其详细内容。

import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/Post.css';

export default function Post({
  // eslint-disable-next-line react/prop-types
  title, content, createdAt, id,
}) {
  return (
    <Link to={`/PostDetails/${id}`} style={{ textDecoration: 'none', color: 'black' }}>
      <div className="post">
        <h2 className="post-title">
          {title}
        </h2>

        <div className="post-summary">
          {content}
        </div>

        <br />

        <div className="post-time">
          {createdAt}
        </div>

      </div>
    </Link>
  );
}
