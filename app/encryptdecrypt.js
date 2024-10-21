// Import CryptoJS
import cryptoJs from 'https://cdn.skypack.dev/crypto-js';

const passphrase = "LnDJr";

export function encrypt(text) {
    return cryptoJs.AES.encrypt(text, passphrase).toString();
}

export function decrypt(ciphertext) {
    let bytes = cryptoJs.AES.decrypt(ciphertext, passphrase);
    return bytes.toString(cryptoJs.enc.Utf8);
}