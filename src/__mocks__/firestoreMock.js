// src/__mocks__/firebaseFirestoreMock.js
export const getFirestore = jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
    })),
    getDocs: jest.fn(() => ({
      docs: [],
    })),
    query: jest.fn(),
    where: jest.fn(),
    addDoc: jest.fn(),
  }));
  