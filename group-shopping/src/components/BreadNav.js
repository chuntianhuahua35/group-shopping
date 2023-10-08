// 面包屑导航

import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Link as RouterLink } from "react-router-dom";

export default function ActiveLastBreadcrumb() {
  return (
    <div style={{ justifyContent: 'flex-end', display: 'flex', marginRight: '1%' }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
        >
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/SettingProfile"
        >
          Basic Information
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/SettingTags"
        >
          Interests
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/SettingPassword"
        >
          Password
        </Link>
      </Breadcrumbs>
    </div>
  );
}
