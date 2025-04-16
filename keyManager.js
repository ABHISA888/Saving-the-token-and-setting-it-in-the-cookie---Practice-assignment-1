const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class KeyManager {
  constructor() {
    // Use a simpler path that doesn't contain spaces
    this.keysPath = path.join(process.cwd(), '.keys');
    this.ensureKeysDirectory();
  }

  ensureKeysDirectory() {
    if (!fs.existsSync(this.keysPath)) {
      try {
        fs.mkdirSync(this.keysPath, { recursive: true });
        console.log('Created keys directory at:', this.keysPath);
      } catch (error) {
        console.error('Error creating keys directory:', error);
        // Fallback to a simpler path if the first attempt fails
        this.keysPath = path.join(__dirname, 'keys');
        fs.mkdirSync(this.keysPath, { recursive: true });
      }
    }
  }

  generateNewKeys() {
    return {
      jwtSecret: crypto.randomBytes(32).toString('hex'),
      encryptionKey: crypto.randomBytes(32).toString('hex')
    };
  }

  rotateKeys() {
    const newKeys = this.generateNewKeys();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    try {
      // Save old keys with timestamp
      if (fs.existsSync(path.join(this.keysPath, 'current.json'))) {
        const oldKeys = JSON.parse(fs.readFileSync(path.join(this.keysPath, 'current.json')));
        const oldKeysPath = path.join(this.keysPath, `keys-${timestamp}.json`);
        fs.writeFileSync(oldKeysPath, JSON.stringify(oldKeys, null, 2));
        console.log('Saved old keys to:', oldKeysPath);
      }

      // Save new keys
      const currentKeysPath = path.join(this.keysPath, 'current.json');
      fs.writeFileSync(currentKeysPath, JSON.stringify(newKeys, null, 2));
      console.log('Saved new keys to:', currentKeysPath);

      return newKeys;
    } catch (error) {
      console.error('Error during key rotation:', error);
      throw error;
    }
  }

  getCurrentKeys() {
    try {
      const keysFile = path.join(this.keysPath, 'current.json');
      if (fs.existsSync(keysFile)) {
        return JSON.parse(fs.readFileSync(keysFile));
      }
      return this.rotateKeys();
    } catch (error) {
      console.error('Error reading keys:', error);
      return this.rotateKeys();
    }
  }
}

module.exports = new KeyManager(); 