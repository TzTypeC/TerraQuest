import {decrypt} from './encryptdecrypt.js'

document.addEventListener("DOMContentLoaded", function() {
    const username = localStorage.getItem('USFwxmJoxR');
    const loginButton = document.getElementById('loginButton');
    const accountPageBtn = document.getElementById('accountPageBtn');
    
    if(username){
        accountPageBtn.style.display='block';
        accountPageBtnMobile.style.display='block';
        document.getElementById('usnNavbar').innerText=decrypt(username);
        document.getElementById('usnNavbarMobile').innerText=decrypt(username);
        loginButton.style.display='none';
        loginButtonMobile.style.display='none';
    }else{
        loginButton.style.display='block';
        accountPageBtn.style.display='none';
        loginButtonMobile.style.display='block';
        accountPageBtnMobile.style.display='none';
    }

    // open
    const burger = document.querySelectorAll('.navbar-burger');
    const menu = document.querySelectorAll('.navbar-menu');
    
    if (burger.length && menu.length) {
        for (var i = 0; i < burger.length; i++) {
            burger[i].addEventListener('click', function() {
                for (var j = 0; j < menu.length; j++) {
                    menu[j].style.transform = "translate(0%)";
                    menu[j].style.display ="flex"
                }
            });
        }
    }
    
    // close
    const close = document.querySelectorAll('.navbar-close');
    const backdrop = document.querySelectorAll('.navbar-backdrop');
    
    if (close.length) {
        for (var i = 0; i < close.length; i++) {
            close[i].addEventListener('click', function() {
                for (var j = 0; j < menu.length; j++) {
                    menu[j].style.transform = "translate(-100%)";
                }
            });
        }
    }
    
    if (backdrop.length) {
        for (var i = 0; i < backdrop.length; i++) {
            backdrop[i].addEventListener('click', function() {
                for (var j = 0; j < menu.length; j++) {
                  menu[j].style.transform = "translate(-100%)";
                }
            });
        }
    }
});
