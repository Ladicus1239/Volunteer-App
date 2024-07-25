import CryptoJS from "crypto-js";

const secretKey = "RlcZq8rGV19k50wxAyr10XHQM";

const encryptData = (data) => {
  console.log(`Encrypting: ${data}`);
  const ciphertext = CryptoJS.AES.encrypt(data, secretKey).toString();
  console.log(`Encrypted data: ${ciphertext}`);
  console.log(`Length of encrypted data: ${ciphertext.length}`);
  return ciphertext;
};

const decryptData = (cipherText) => {
  console.log(`Decrypting: ${cipherText}`);
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  console.log(`Decrypted data: ${decryptedData}`);
  return decryptedData;
};

export { encryptData, decryptData };
