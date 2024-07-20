import React from 'react';

const useAuth = () => ({
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
  currentUser: null,
});

const AuthProvider = ({ children }) => <>{children}</>;

export { useAuth, AuthProvider };
