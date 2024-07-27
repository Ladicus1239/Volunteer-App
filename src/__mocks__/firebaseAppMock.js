// src/__mocks__/firebaseAppMock.js
const initializeApp = jest.fn();
const getFirestore = jest.fn();
const getAuth = jest.fn(() => ({
  signOut: jest.fn(),
}));

export { initializeApp, getFirestore, getAuth };
