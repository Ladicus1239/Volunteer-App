import CryptoJS from "crypto-js";

const secretKey = "RlcZq8rGV19k50wxAyr10XHQM"; 

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

const decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export { encryptData, decryptData };
