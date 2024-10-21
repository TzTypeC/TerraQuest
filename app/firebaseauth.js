// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import{getAuth, sendPasswordResetEmail, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"
import{getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"
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

const date = new Date();
const formatDate = date.toLocaleDateString();

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
    const docRef=doc(db, "users", username);

    // Ambil dokumen
    getDoc(docRef)
    .then((docSnap)=>{
        // Cek Apakah username sudah di pakai
        if(docSnap.exists()){
            //Bila Username terpakai maka beri alert
            showMessage(
                'Username Already Registered',
                'Already registered? Try Login or Use Another Username',
                'Up',
                false
            )
        }
        else{
            //Cek Apakah Password = Re-Typed Password
            if(password==rePassword){
                //Buat User dengan Email Dan Password
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential)=>{
                    // Masukkan UserData Awal
                    const userData = {
                        email: email,
                        username: username,
                        exp: 0,
                        post: [],
                        guild: 0,
                        dateJoin: formatDate,
                        followers: [],
                        following: [],
                    };
                    // Alert Regist Sukses
                    showMessage(
                        'Success',
                        'Account Created Successfully',
                        'Up',
                        true
                    );
                    // Membuat Database Di Firestore
                    setDoc(docRef,userData)
                    .then(()=>{
                        // Kembali Ke Mode Login
                        document.querySelector(".container").classList.remove("sign-up-mode");
                        document.title = "Sign In"; 
                    })
                    .catch((error)=>{
                        console.error("error writing document", error);
                    });
                    const auth = getAuth();
                    const user = auth.currentUser; 
                    // Update Display Name sesua dengan username
                    updateProfile(user, {
                        displayName: username
                    }).then(() => {
                        console.log("Display name berhasil diupdate");
                    }).catch((error) => {
                        console.error("Gagal mengupdate display name:", error);
                    });
                })
                .catch((error)=>{
                    // Menampilkan Pesan Error
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
        }
    })
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
        console.log(userCredential)
        localStorage.setItem('loggedInUserId',user.uid)
        console.log(user.displayName);
        const docRef = doc(db, "users", user.displayName);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                const encryptedUsn = encrypt(userData.username);
                console.log(userData.username);
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