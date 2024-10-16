// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import{getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

function showMessage(mTitle, mDesc, divId, stat){
    var messageDiv=document.getElementById(divId);
    var messageTitle=document.getElementById('titleMessage');
    var messageDesc=document.getElementById('descMessage');
    var alert=document.querySelector('.redAlert')
    var check=document.querySelector('.greenCheck')
    messageDiv.style.display="block";
    messageTitle.innerHTML=mTitle;
    messageDesc.innerHTML=mDesc;
    messageDiv.style.opacity=1;
    if(stat==1){
        alert.style.display="none";
        check.style.display="block";
    }
    else{
        check.style.display="none";
        alert.style.display="block";
    }
    setTimeout(function(){
        messageDiv.style.opacity=0;
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
                'signUpMessage',
                1
            );
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
            const errorCode=error.code;
            console.log(errorCode);
            if(errorCode=='auth/email-already-in-use'){
                showMessage(
                    'Error',
                    'Email Addres Already Exist !',
                    'signUpMessage',
                    0
                )
            }
            else{
                showMessage(
                    'Error',
                    'Unable to create user',
                    'signUpMessage',
                    0
                )
            }
        })
    }
    else{
        showMessage(
            'Error',
            "Password and Retyped Password didn't match",
            'signUpMessage',
            0
        );
    }
})