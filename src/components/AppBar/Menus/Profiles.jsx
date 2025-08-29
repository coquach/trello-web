import Logout from '@mui/icons-material/Logout';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { useConfirm } from 'material-ui-confirm';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice';

function Profiles() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const confirmLogout = useConfirm();
  const handleLogout = () => {
    confirmLogout({
      title: 'Logout',
      description: 'Are you sure you want to logout?',
      confirmationText: 'Logout',
      confirmationButtonProps: { color: 'error' },
    })
      .then(() => {
        // Handle logout logic here
        dispatch(logoutUserAPI());
      })
      .catch(() => {});
  };
  return (
    <Box>
      <Tooltip title='Account settings'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36, objectFit: 'cover' }}
            alt='Profile picture'
            src={currentUser?.avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        // id="basic-menu-profiles"
        // anchorEl={anchorEl}
        // open={open}
        // onClose={handleClose}
        // MenuListProps={{
        //   "aria-labelledby": "basic-button-profiles",
        // }}
        anchorEl={anchorEl}
        id='basic-menu-profiles'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
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
              '&::before': {
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
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link to='/settings/account' style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem
            sx={{
              '&:hover': {
                color: 'success.light',
                '& .profile-avatar': {
                  color: 'success.light',
                },
              },
            }}
          >
            <Avatar
              src={currentUser?.avatar}
              className='profile-avatar'
              sx={{ width: 28, height: 28, mr: 2 }}
            />
            Profile
          </MenuItem>
        </Link>

        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize='small' />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            '&:hover': {
              color: 'error.light',
              '& .logout-icon': {
                color: 'error.light',
              },
            },
          }}
        >
          <ListItemIcon>
            <Logout className='logout-icon' fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Profiles;
