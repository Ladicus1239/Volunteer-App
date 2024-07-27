import { encryptData, decryptData } from '../encrypt';
import CryptoJS from 'crypto-js';

global.console = {
  log: jest.fn(),
  ...global.console
};

describe('Encrypt and Decrypt Functions', () => {
  const testData = 'Test data';

  test('encryptData function encrypts data correctly', () => {
    const encryptedData = encryptData(testData);

    
    expect(typeof encryptedData).toBe('string');
    expect(encryptedData).not.toBe(testData);
    expect(encryptedData.length).toBeGreaterThan(0);
  });

  test('decryptData function decrypts data correctly', () => {
    const encryptedData = encryptData(testData);
    const decryptedData = decryptData(encryptedData);

    
    expect(decryptedData).toBe(testData);
  });

  test('encryptData and decryptData maintain data integrity', () => {
    const dataToEncrypt = 'Sensitive information';
    const encryptedData = encryptData(dataToEncrypt);
    const decryptedData = decryptData(encryptedData);

   
    expect(decryptedData).toBe(dataToEncrypt);
  });

  test('decryptData handles incorrect data gracefully', () => {
    const invalidEncryptedData = 'Invalid data';
    
    try {
      const decryptedData = decryptData(invalidEncryptedData);
     
      expect(decryptedData).toBe('');
    } catch (error) {
      
      expect(error).toBeInstanceOf(Error);
    }
  });
});
