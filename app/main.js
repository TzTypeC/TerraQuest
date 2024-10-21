import {decrypt} from './encryptdecrypt.js'
import { newPost } from './firestore.js';

document.addEventListener("DOMContentLoaded", function() {
    const username = localStorage.getItem('USFwxmJoxR');
    const loginButton = document.getElementById('loginButton');
    const accountPageBtn = document.getElementById('accountPageBtn');
    
    if(username){
        accountPageBtn.style.display='block';
        document.getElementById('usnNavbar').innerText=decrypt(username);
        loginButton.style.display='none';
    }else{
        loginButton.style.display='block';
        accountPageBtn.style.display='none';
    }
    
    const submitPostButton = document.getElementById('submitPostButton');
    
    submitPostButton.addEventListener("click", (event) => {
        event.preventDefault();
        const postContentTitle = document.getElementById('postContentTitle').value;
        const postContentDesc = document.getElementById('postContentDesc').value;
    
        newPost(postContentTitle, postContentDesc, "test", "test")
        
    })
});