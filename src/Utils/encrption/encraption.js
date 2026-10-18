import CryptoJS from "crypto-js";
export const encrypt = ({ planetext, secret_key = process.env.SECRET_KEY }) => {
  return CryptoJS.AES.encrypt(planetext, secret_key).toString();
};
export const decrypt = ({ cipherText, secret_key = process.env.SECRET_KEY }) => {
  return CryptoJS.AES.decrypt(cipherText, secret_key).toString(CryptoJS.enc.Utf8);
};
