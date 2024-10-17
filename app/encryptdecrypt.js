// Import CryptoJS
import CryptoJS from "https://cdn.skypack.dev/crypto-js";

const passphrase = "LnDJr";

export function encrypt(text) {
    return CryptoJS.AES.encrypt(text, passphrase).toString();
}

export function decrypt(ciphertext) {
    let bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
}