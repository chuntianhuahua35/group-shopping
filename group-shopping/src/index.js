// 设置了主要的前端页面结构和路由，确保用户可以通过不同的URL路径访问不同的页面或功能。

import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css';
import {
  BrowserRouter as Router, Route, Routes,
  // Navigate,
} from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import SettingProfile from './components/SettingProfile';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import SettingPassword from './components/SettingPassword';
import SettingTags from './components/SettingTags';
import HomePage from './components/HomePage';
import NewPost from './components/NewPost';
import PostDetails from './components/PostDetails';
import Profiles from './components/Profiles';
import Chat from './components/Chat';

ReactDOM.render(
  <div>
    <React.StrictMode>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/SettingPassword" element={<SettingPassword />} />
          <Route path="/SettingProfile" element={<SettingProfile />} />
          <Route path="/SettingTags" element={<SettingTags />} />
          <Route path="/NewPost" element={<NewPost />} />
          <Route path="/PostDetails/*" element={<PostDetails />} />
          <Route path="/Profiles" element={<Profiles />} />
          <Route path="/Chat" element={<Chat />} />
          {/* <Route path="*" element={<Navigate to="/HomePage" replace />} /> */}
        </Routes>
      </Router>
    </React.StrictMode>,
  </div>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
