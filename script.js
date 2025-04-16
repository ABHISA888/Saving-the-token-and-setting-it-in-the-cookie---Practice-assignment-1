const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const keyManager = require('./keyManager');

// Get current keys
const { jwtSecret, encryptionKey } = keyManager.getCurrentKeys();

const encrypt = (payload) => {
  // First encrypt the payload using AES
  const encryptedPayload = CryptoJS.AES.encrypt(
    JSON.stringify(payload),
    encryptionKey
  ).toString();

  // Then create a JWT token with the encrypted payload
  const token = jwt.sign(
    { data: encryptedPayload },
    jwtSecret,
    { expiresIn: '1h' }
  );

  return token;
}

const decrypt = (token) => {
  try {
    // First verify and decode the JWT token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Then decrypt the payload using AES
    const bytes = CryptoJS.AES.decrypt(decoded.data, encryptionKey);
    const decryptedPayload = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedPayload;
  } catch (error) {
    console.error('Decryption failed:', error.message);
    return null;
  }
}

// Test the implementation
const testPayload = { userId: 123, role: 'admin' };
const token = encrypt(testPayload);
console.log('Encrypted Token:', token);

const decrypted = decrypt(token);
console.log('Decrypted Payload:', decrypted);

module.exports = {
  encrypt,
  decrypt
}
