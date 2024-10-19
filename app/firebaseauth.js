// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import{getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"
import{getFirestore, setDoc, doc, getDoc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { encrypt } from './encryptdecrypt.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyTreQ2OdbCgct4t_y3OENaweKHwEQGKg",
  authDomain: "terraquest-911.firebaseapp.com",
  projectId: "terraquest-911",
  storageBucket: "terraquest-911.appspot.com",
  messagingSenderId: "470393944809",
  appId: "1:470393944809:web:333de35677e95d5c7ace78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//divId = "In"(signIn) or "Up"(signUp)
//stat = true (check), false (alert)
function showMessage(mTitle, mDesc, divId, stat){
    console.log(mTitle,mDesc,divId,stat)
    var messageDiv=document.getElementById("message"+divId);
    var messageTitle=document.getElementById('titleMessage'+divId);
    var messageDesc=document.getElementById('descMessage'+divId);
    var alert=document.querySelector('.redAlert'+divId)
    var check=document.querySelector('.greenCheck'+divId)
    messageDiv.style.display="contents";
    messageTitle.innerHTML=mTitle;
    messageDesc.innerHTML=mDesc;
    messageDiv.style.opacity=1;
    if(stat){
        alert.style.display="none";
        check.style.display="contents";
    }
    else{
        check.style.display="none";
        alert.style.display="contents";
    }
    setTimeout(function(){
        messageDiv.style.opacity=0;
        messageDiv.style.display='none';
    },5000)
}

const signUp = document.querySelector('#submitSignUp');

signUp.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const username = document.getElementById('rUsername').value;
    const rePassword = document.getElementById('rPasswordConfirm').value;

    const auth = getAuth();
    const db = getFirestore();

    if(password==rePassword){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            const user = userCredential.user;
            const userData = {
                email: email,
                username: username,
            };
            showMessage(
                'Success',
                'Account Created Successfully',
                'Up',
                true
            );
            createUser(user.uid, username);
            const docRef=doc(db, "users", user.uid);
            setDoc(docRef,userData)
            .then(()=>{
                document.querySelector(".container").classList.remove("sign-up-mode");
                document.title = "Sign In"; 
            })
            .catch((error)=>{
                console.error("error writing document", error);
            });
        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + " " + errorMessage)
            if(errorCode=='auth/email-already-in-use'){
                showMessage(
                    'Email Addres Already Exist',
                    'Diese E-Mail-Adresse wird bereits verwendet. Sie können sich anmelden oder eine andere E-Mail-Adresse verwenden',
                    'Up',
                    false
                )
            }
            else if(errorCode=='auth/invalid-email'){
                showMessage(
                    'Email Invalid',
                    'Please enter a valid email address',
                    'Up',
                    false
                )
            }
            else{
                showMessage(
                    'Error',
                    'Unable to create user',
                    'Up',
                    false
                )
            }
        })
    }
    else{
        showMessage(
            'Error',
            "Password and Retyped Password didn't match",
            'Up',
            false
        );
        document.getElementById('rPasswordConfirm').value = ''
    }
})

const signIn = document.getElementById('submitSignIn')
signIn.addEventListener('click', (event) =>{
    event.preventDefault();
    const email=document.getElementById('inEmail').value;
    const password=document.getElementById('inPassword').value;
    const auth=getAuth();
    const db=getFirestore();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        showMessage(
            'Success',
            'Login is successful, you will be redirected in a sec...',
            'In',
            true
        )
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId',user.uid)
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                const encryptedUsn = encrypt(userData.username);
                localStorage.setItem('USFwxmJoxR',encryptedUsn)
            }
        })
        setTimeout(function(){
            window.location.href='./index.html';
        },3000)
    })
    .catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " " + errorMessage)
        console.log(errorCode);
        if(errorCode==='auth/invalid-credential'){
            showMessage(
                'Error',
                'Incorrect Email or Password',
                'In',
                false
            )
            document.getElementById('inPassword').value = '';
        }
        if(errorCode==='auth/invalid-email'){
            showMessage(
                'Email Invalid',
                'Please enter a valid email address',
                'In',
                false
            )
        }
    })
})

const reset = document.getElementById("submitResetPass");
reset.addEventListener("click", (event) =>{
    event.preventDefault();

    const email = document.getElementById('fpEmail').value;
    const auth=getAuth();

    sendPasswordResetEmail(auth, email)
    .then(() => {
        showMessage(
            "Check your inbox",
            "An email with a link to reset your password was sent to the email address associated with your account",
            'FP',
            true
        )
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
        if(errorCode==='auth/invalid-email'){
            showMessage(
                'Email Invalid',
                'Please enter a valid email address',
                'FP',
                false
            )
        }
    });
})