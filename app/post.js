import { newPost } from './firestore.js';

const submitPostButton = document.getElementById('submitPostButton');

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

submitPostButton.addEventListener("click", (event) => {
    event.preventDefault();
    const file1 = document.getElementById('img1').files[0];
    const file2 = document.getElementById('img2').files[0];
    const postContentTitle = document.getElementById('postContentTitle').value;
    const postContentDesc = document.getElementById('postContentDesc').value;
    const promises = [];

    if (file1) {
        promises.push(readFileAsBase64(file1)); // Membaca file1
    }

    if (file2) {
        promises.push(readFileAsBase64(file2)); // Membaca file2
    }

    // Tunggu semua file dibaca dan kemudian upload
    Promise.all(promises).then((base64Files) => {
        // Panggil fungsi newData dengan base64 dari file1 dan file2
        console.log(base64Files[0], " ", base64Files[2])
        newPost(postContentTitle, postContentDesc, base64Files[0], base64Files[1]);
    }).catch((error) => {
        console.error("Error reading files: ", error);
    });

    // newPost(postContentTitle, postContentDesc, "imgsrc2", "imgsrc2")
})