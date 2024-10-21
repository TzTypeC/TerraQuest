// Import Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { decrypt } from './encryptdecrypt.js';

const firebaseConfig = {
    apiKey: "AIzaSyAyTreQ2OdbCgct4t_y3OENaweKHwEQGKg",
    authDomain: "terraquest-911.firebaseapp.com",
    projectId: "terraquest-911",
    storageBucket: "terraquest-911.appspot.com",
    messagingSenderId: "470393944809",
    appId: "1:470393944809:web:333de35677e95d5c7ace78"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getLastPostId() {
    const counterRef = doc(db, "posts", "postData");
    const docSnap = await getDoc(counterRef);

    if (docSnap.exists()) {
        const docSnapData = docSnap.data();
        const lastPostId = docSnapData.lastPost;
        return lastPostId;
    } else {
        console.error("Dokumen postData tidak ditemukan.");
        return null;
    }
}

function updatePostIdUser(newDatas, usn) {
    const docRef = doc(db, "users", usn);
    
    // Update dokumen user dengan arrayUnion
    const updateData = {
        postId: arrayUnion(newDatas)
    };

    // Update dokumen
    updateDoc(docRef, updateData)
        .then(() => {
            console.log("Data berhasil ditambahkan ke array");
        })
        .catch((error) => {
            console.error("Error menambahkan data:", error);
        });
}

function updateLastPostId(lastPostId) {
    // Update dokumen lastPost di "postData"
    updateDoc(doc(db, "posts", "postData"), {
        lastPost: lastPostId
    })
    .then(() => {
        console.log("lastPost berhasil diupdate!");
    })
    .catch((error) => {
        console.error("Terjadi kesalahan saat mengupdate lastPost: ", error);
    });
}
    
export async function newPost(titlePost, descPost, fsImagePost, scImagePost) {
    const username = decrypt(localStorage.getItem('USFwxmJoxR'));
    const date = new Date();
    const formatDate = date.toLocaleDateString();

    const postData = {
        author: username,
        datePosted: formatDate,
        title: titlePost,
        desc: descPost,
        upVote: 0,
        downVote: 0,
        fsImg: fsImagePost,
        scImg: scImagePost
    };

    // Tunggu hasil dari getLastPostId
    let lastPostId = await getLastPostId();

    if (lastPostId !== null) {
        const docRef = doc(db, "posts", lastPostId.toString());
        setDoc(docRef, postData)
        .then(() => {
            updatePostIdUser(lastPostId, username);
            updateLastPostId(lastPostId + 1);
        })
        .catch((error) => {
            console.error("Error menulis dokumen", error);
        });
    }
}
