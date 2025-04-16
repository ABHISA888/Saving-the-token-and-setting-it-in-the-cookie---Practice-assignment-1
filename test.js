const { encrypt, decrypt } = require('./script');
const keyManager = require('./keyManager');

// Test data
const testPayload = {
  userId: 123,
  username: 'testuser',
  role: 'admin',
  email: 'test@example.com'
};

// Test encryption and decryption
function runTests() {
  console.log('\n=== Starting Encryption/Decryption Tests ===\n');

  // Test 1: Basic encryption and decryption
  console.log('Test 1: Basic Encryption/Decryption');
  const token = encrypt(testPayload);
  console.log('Encrypted Token:', token);
  
  const decrypted = decrypt(token);
  console.log('Decrypted Payload:', decrypted);
  console.log('Test 1 Result:', JSON.stringify(decrypted) === JSON.stringify(testPayload) ? '✅ PASSED' : '❌ FAILED');

  // Test 2: Invalid token
  console.log('\nTest 2: Invalid Token Handling');
  const invalidResult = decrypt('invalid.token.here');
  console.log('Invalid Token Result:', invalidResult === null ? '✅ PASSED' : '❌ FAILED');

  // Test 3: Key Rotation
  console.log('\nTest 3: Key Rotation');
  const oldKeys = keyManager.getCurrentKeys();
  console.log('Old Keys:', oldKeys);
  
  const newKeys = keyManager.rotateKeys();
  console.log('New Keys:', newKeys);
  console.log('Test 3 Result:', JSON.stringify(oldKeys) !== JSON.stringify(newKeys) ? '✅ PASSED' : '❌ FAILED');

  console.log('\n=== Tests Completed ===\n');
}

// Run the tests
runTests(); 