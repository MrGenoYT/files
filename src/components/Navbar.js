
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaClipboardList, FaPlus, FaRobot, FaComments } from 'react-icons/fa';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 0.75rem 1rem;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  text-decoration: none;
  
  img {
    height: 40px;
    margin-right: 0.5rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  max-width: 300px;
  height: 100vh;
  background-color: white;
  z-index: 1001;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
`;

const MobileLinks = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: var(--primary-color);
  }
`;

const NavButton = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-dark);
    color: white;
  }
`;

const ProfileButton = styled.div`
  position: relative;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-color);
`;

const ProfileDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  overflow: hidden;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f7fa;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f7fa;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileDropdown]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          <img src="/logo.png" alt="LostCloud Logo" />
          <span>LostCloud</span>
        </Logo>

        <NavLinks>
          {user ? (
            <>
              <NavLink to="/dashboard">
                <FaClipboardList /> Dashboard
              </NavLink>
              <NavLink to="/forum">
                <FaComments /> Forum
              </NavLink>
              <ProfileButton className="profile-dropdown" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                <ProfileImage 
                  src={
                    user.profilePicture && !user.profilePicture.includes('default') 
                      ? `${process.env.REACT_APP_API_URL}/uploads/profiles/${user.profilePicture}`
                      : '/logo.png'
                  } 
                  alt={user.username} 
                />
                {showProfileDropdown && (
                  <ProfileDropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem to="/profile">
                      <FaUser /> Profile
                    </DropdownItem>
                    <DropdownItem to="/create-bot">
                      <FaRobot /> Create Bot
                    </DropdownItem>
                    <DropdownItem to="/forum/create">
                      <FaPlus /> New Post
                    </DropdownItem>
                    <DropdownButton onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </DropdownButton>
                  </ProfileDropdown>
                )}
              </ProfileButton>
            </>
          ) : (
            <>
              <NavLink to="/forum">Forum</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavButton to="/register">Sign Up</NavButton>
            </>
          )}
        </NavLinks>

        <MobileMenuButton onClick={() => setShowMobileMenu(true)}>
          <FaBars />
        </MobileMenuButton>

        <AnimatePresence>
          {showMobileMenu && (
            <>
              <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMobileMenu}
              />
              <MobileMenu
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <CloseButton onClick={closeMobileMenu}>
                  <FaTimes />
                </CloseButton>

                <Logo to="/" onClick={closeMobileMenu}>
                  <img src="/logo.png" alt="LostCloud Logo" />
                  <span>LostCloud</span>
                </Logo>

                <MobileLinks>
                  {user ? (
                    <>
                      <NavLink to="/dashboard" onClick={closeMobileMenu}>
                        <FaClipboardList /> Dashboard
                      </NavLink>
                      <NavLink to="/create-bot" onClick={closeMobileMenu}>
                        <FaRobot /> Create Bot
                      </NavLink>
                      <NavLink to="/forum" onClick={closeMobileMenu}>
                        <FaComments /> Forum
                      </NavLink>
                      <NavLink to="/forum/create" onClick={closeMobileMenu}>
                        <FaPlus /> New Post
                      </NavLink>
                      <NavLink to="/profile" onClick={closeMobileMenu}>
                        <FaUser /> Profile
                      </NavLink>
                      <DropdownButton onClick={() => { handleLogout(); closeMobileMenu(); }}>
                        <FaSignOutAlt /> Logout
                      </DropdownButton>
                    </>
                  ) : (
                    <>
                      <NavLink to="/forum" onClick={closeMobileMenu}>Forum</NavLink>
                      <NavLink to="/login" onClick={closeMobileMenu}>Login</NavLink>
                      <NavLink to="/register" onClick={closeMobileMenu}>Sign Up</NavLink>
                    </>
                  )}
                </MobileLinks>
              </MobileMenu>
            </>
          )}
        </AnimatePresence>
      </NavContent>
    </NavbarContainer>
  );
}

export default Navbar;
