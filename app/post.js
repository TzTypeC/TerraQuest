// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { decrypt } from './encryptdecrypt.js';

// Firebase configuration
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
const storage = getStorage(app);

const submitPostButton = document.getElementById('submitPostButton');

// Fungsi untuk mendapatkan post ID terakhir
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

// Fungsi untuk memperbarui postId user
function updatePostIdUser(newDatas, usn) {
    const docRef = doc(db, "users", usn);
    const updateData = {
        postId: arrayUnion(newDatas)
    };
    
    updateDoc(docRef, updateData)
    .then(() => {
        console.log("Data berhasil ditambahkan ke array");
    })
    .catch((error) => {
        console.error("Error menambahkan data:", error);
    });
}

// Fungsi untuk memperbarui lastPostId
function updateLastPostId(lastPostId) {
    updateDoc(doc(db, "posts", "postData"), {
        lastPost: lastPostId
    })
    .then(() => {
        console.log("lastPost berhasil diupdate!");
        showMessagePost(
            "Sukses",
            "Postingan mu berhasil di upload",
            1
        );
        document.getElementById('postContentTitle').value = '';
        document.getElementById('postContentDesc').value = '';
        document.getElementById('img1').value = '';
        document.getElementById('img2').value = '';
    })
    .catch((error) => {
        console.error("Terjadi kesalahan saat mengupdate lastPost: ", error);
    });
}

// Fungsi untuk membuat post baru
async function newPost(titlePost, descPost, fsImagePost, scImagePost) {
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

// Fungsi untuk mengunggah file ke Firebase Storage
async function uploadToFirebaseStorage(file, fileName) {
    const storageRef = ref(storage, 'images/' + fileName); // Path di Firebase Storage
    
    try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
}

// Fungsi untuk menampilkan pesan setelah posting
function showMessagePost(mTitle, mDesc, stat) {
    var messageDiv = document.getElementById("messagePost");
    var messageTitle = document.getElementById('titleMessagePost');
    var messageDesc = document.getElementById('descMessagePost');
    var alert = document.querySelector('.redAlertPost');
    var check = document.querySelector('.greenCheckPost');
    messageDiv.style.display = "contents";
    messageTitle.innerHTML = mTitle;
    messageDesc.innerHTML = mDesc;
    messageDiv.style.opacity = 1;
    
    if (stat) {
        alert.style.display = "none";
        check.style.display = "contents";
    } else {
        check.style.display = "none";
        alert.style.display = "contents";
    }
}

// Event listener untuk tombol submit
submitPostButton.addEventListener("click", (event) => {
    event.preventDefault();
    const file1 = document.getElementById('img1').files[0];
    const file2 = document.getElementById('img2').files[0];
    const postContentTitle = document.getElementById('postContentTitle').value;
    const postContentDesc = document.getElementById('postContentDesc').value;
    const promises = [];
    
    if (file1) {
        const fileName1 = 'img1_' + new Date().getTime(); // Nama unik
        promises.push(uploadToFirebaseStorage(file1, fileName1));
    }
    
    if (file2) {
        const fileName2 = 'img2_' + new Date().getTime(); // Nama unik
        promises.push(uploadToFirebaseStorage(file2, fileName2));
    }
    
    Promise.all(promises).then((downloadURLs) => {
        const fsImgUrl = downloadURLs[0] || null;  // URL gambar pertama
        const scImgUrl = downloadURLs[1] || null;  // URL gambar kedua
        
        // Panggil fungsi newPost dengan URL download gambar
        newPost(postContentTitle, postContentDesc, fsImgUrl, scImgUrl);
    }).catch((error) => {
        console.error("Error uploading files: ", error);
    });
});
