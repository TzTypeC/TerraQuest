import {decrypt} from './encryptdecrypt.js'
const username = localStorage.getItem('USFwxmJoxR');
const loginButton = document.getElementById('loginButton');
const accountPageBtn = document.getElementById('accountPageBtn');
console.log(username)
if(username){
    accountPageBtn.style.display='contents';
    document.getElementById('usnNavbar').innerText=decrypt(username);
    loginButton.style.display='none';
}else{
    loginButton.style.display='block';
    accountPageBtn.style.display='none';
}