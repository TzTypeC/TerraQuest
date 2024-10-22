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
    const postContentTitle = document.getElementById('postContentTitle').value;
    const postContentDesc = document.getElementById('postContentDesc').value;
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