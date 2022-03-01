import React from 'react';
import './Header.scss';

import StyledEngineProvider from '@mui/material/StyledEngineProvider';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  console.log('header!');
  return (
    <header>
      <StyledEngineProvider injectFirst>
        <IconButton color="primary" aria-label="upload picture" component="span">
          <MenuIcon />
        </IconButton>
      </StyledEngineProvider>
    </header>
  );
};

export default () => <Header />;
