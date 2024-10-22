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
const submitPostButton = document.getElementById('submitPostButton');
const postContentTitle = document.getElementById('postContentTitle').value;
const postContentDesc = document.getElementById('postContentDesc').value;
const checkImgValue1 = document.getElementById('img1').value;
const checkImgValue2 = document.getElementById('img2').value;
const maxSizeInMB = 2; // Ukuran maksimum dalam MB
const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Konversi ke byte

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
        showMessagePost(
            "Sukses",
            "Postingan mu berhasil di upload",
            1
        )
        postContentTitle = '';
        postContentDesc = '';
        checkImgValue1 = '';
        checkImgValue2 = '';
    })
    .catch((error) => {
        console.error("Terjadi kesalahan saat mengupdate lastPost: ", error);
    });
}
    
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

//batas


function showMessagePost(mTitle, mDesc, stat){
    console.log(mTitle,mDesc,divId,stat)
    var messageDiv=document.getElementById("messagePost");
    var messageTitle=document.getElementById('titleMessagePost');
    var messageDesc=document.getElementById('descMessagePost');
    var alert=document.querySelector('.redAlertPost')
    var check=document.querySelector('.greenCheckPost')
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
    // setTimeout(function(){
    //     messageDiv.style.opacity=0;
    //     messageDiv.style.display='none';
    // },5000)
}

checkImgValue1.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > maxSizeInBytes) {
            showMessagePost(
                'File-mu Terlalu Besar',
                'Ukuran file maksimal 5 MB',
                0
            )
            fileInput.value = ''; // Menghapus input
        } 
    }
});

checkImgValue2.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > maxSizeInBytes) {
            showMessagePost(
                'File-mu Terlalu Besar',
                'Ukuran file maksimal 5 MB',
                0
            )
            fileInput.value = ''; // Menghapus input
        } 
    }
});

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result); // Mengembalikan data base64
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file); // Membaca file sebagai URL Data
    });
}

// Fungsi untuk mengompres dan membaca file sebagai base64
function compressAndReadFile(file) {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: 0.8, // Kualitas kompresi (0 sampai 1)
            maxWidth: 1920, // Atur resolusi maksimum (opsional)
            success(result) {
                // Jika hasilnya lebih besar dari 1MB, turunkan kualitasnya
                if (result.size > 1 * 1024 * 1024) {
                    new Compressor(result, {
                        quality: 0.6,
                        success(compressedFile) {
                            readFileAsBase64(compressedFile).then(resolve).catch(reject);
                        },
                        error(err) {
                            reject(err);
                        }
                    });
                } else {
                    readFileAsBase64(result).then(resolve).catch(reject);
                }
            },
            error(err) {
                reject(err);
            }
        });
    });
}


submitPostButton.addEventListener("click", (event) => {
    event.preventDefault();
    const file1 = document.getElementById('img1').files[0];
    const file2 = document.getElementById('img2').files[0];
    const promises = [];

    if (file1) {
        promises.push(compressAndReadFile(file1));
    }

    // Jika ada file gambar kedua, kompres dan baca file
    if (file2) {
        promises.push(compressAndReadFile(file2));
    }

    // Tunggu semua file dibaca dan kemudian upload
    Promise.all(promises).then((base64Files) => {
        // Panggil fungsi newData dengan base64 dari file1 dan file2
        newPost(postContentTitle, postContentDesc, base64Files[0], base64Files[1]);
    }).catch((error) => {
        console.error("Error reading files: ", error);
    });

    // newPost(postContentTitle, postContentDesc, "imgsrc2", "imgsrc2")
})