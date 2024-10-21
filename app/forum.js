import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { decrypt } from "./encryptdecrypt";

const firebaseConfig = {
    apiKey: "AIzaSyAyTreQ2OdbCgct4t_y3OENaweKHwEQGKg",
    authDomain: "terraquest-911.firebaseapp.com",
    projectId: "terraquest-911",
    storageBucket: "terraquest-911.appspot.com",
    messagingSenderId: "470393944809",
    appId: "1:470393944809:web:333de35677e95d5c7ace78"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let lastPost = 0; // Untuk menyimpan jumlah post yang sudah dimuat
let isLoading = false; // Untuk menghindari loading ganda
const displayedPosts = new Set(); // Set untuk menyimpan ID post yang sudah ditampilkan

// Fungsi untuk mengambil jumlah post dan dokumen dari Firestore
async function fetchPosts(limit) {
    const postDataDoc = doc(db, "posts", "postData");
    const postDataSnapshot = await getDoc(postDataDoc);
    lastPost = postDataSnapshot.data().lastPost; // Ambil jumlah post

    const postsCollection = collection(db, "posts");
    const postsSnapshot = await getDocs(postsCollection);
    const posts = postsSnapshot.docs
        .filter(doc => doc.id !== "postData") // Filter dokumen postData jika ada di koleksi
        .map(doc => ({ id: doc.id, ...doc.data() }));

    // Acak urutan post
    const randomizedPosts = shuffleArray(posts);

    // Hanya ambil jumlah post sesuai limit
    return randomizedPosts.slice(0, limit);
}

// Fungsi untuk mengacak array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fungsi untuk menggenerate template artikel
function generatePostTemplate(post) {
    const articleContainer = document.createElement("article");
    articleContainer.className = "h-fit px-8 py-8 relative";
    
    articleContainer.innerHTML = `
        <h2 class="text-lg pb-2 font-medium text-gray-900">
            Posted by <span class="underline text-xl inline">${post.author}</span>
        </h2>
        <div class="flex flex-col md:flex-row items-center w-full">
            <div class="h-[270px] w-full md:h-[540px] md:w-1/2">
                <label class="cursor-pointer relative">
                    <input type="checkbox" value="" class="peer sr-only absolute left-1/2 bottom-1/2" />
                    <img alt="" src="${post.fsImg}" class="h-full w-full object-cover object-center rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl shadow-xl peer-checked:object-contain" />
                </label>
            </div>
            <div class="h-[270px] w-full md:h-[540px] md:w-1/2">
                <label class="cursor-pointer relative">
                    <input type="checkbox" value="" class="peer sr-only absolute left-1/2 bottom-1/2" />
                    <img alt="" src="${post.scImg}" class="h-full w-full object-cover object-center rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl shadow-xl peer-checked:object-contain" />
                </label>
            </div>
        </div>
        <div>
            <div class="px-8 py-4">
                <a href="#">
                    <h3 class="text-3xl font-medium text-gray-900">${post.title}</h3>
                </a>
                <p class="mt-2 line-clamp-3 text-lg/relaxed text-gray-500">${post.desc}</p>
            </div>
        </div>
        <div class="flex items-center space-x-4 float-right">
            <button class="p-2 group border rounded-full hover:bg-[#00d89e]" data-id="${post.id}" id="upvote-${post.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 stroke-tq-dcyan group-hover:stroke-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
            </button>
            <span class="text-2xl font-bold" id="upvoteCount-${post.id}">${post.upVote}</span>
            <button class="p-2 group border rounded-full hover:bg-rose-500" data-id="${post.id}" id="downvote-${post.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 stroke-rose-500 group-hover:stroke-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <span class="text-2xl font-bold" id="downvoteCount-${post.id}">${post.downVote}</span>
        </div>
    `;

    // Sisipkan artikel ke dalam elemen yang diinginkan di DOM
    document.getElementById("contentForum").appendChild(articleContainer);
}

// Fungsi untuk memuat artikel saat pengguna scroll ke bawah
async function loadMorePosts(limit = 5) {
    if (isLoading) return; // Cegah pemanggilan ganda
    isLoading = true;

    // Tampilkan pesan loading
    const loadingMessage = document.createElement("div");
    loadingMessage.innerText = "Content loaded please wait...";
    loadingMessage.className = "text-center my-4";
    document.getElementById("contentForum").appendChild(loadingMessage);

    // Ambil artikel
    const posts = await fetchPosts(limit);
    let newPostsCount = 0; // Untuk menghitung jumlah post baru yang ditambahkan

    for (const post of posts) {
        // Cek jika post sudah ditampilkan
        if (!displayedPosts.has(post.id)) {
            generatePostTemplate(post);
            displayedPosts.add(post.id); // Tambahkan ID post ke Set

            // Tambahkan event listener untuk upvote dan downvote
            document.getElementById(`upvote-${post.id}`).addEventListener("click", () => upvote(post.id));
            document.getElementById(`downvote-${post.id}`).addEventListener("click", () => downvote(post.id));

            newPostsCount++;
        }
    }

    // Hapus pesan loading
    loadingMessage.remove();
    isLoading = false;

    // Jika sudah memuat semua post, hapus event listener
    if (lastPost <= document.querySelectorAll("article").length) {
        window.removeEventListener("scroll", handleScroll);
    }
}

// Fungsi untuk menangani scroll
function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMorePosts();
    }
}

// Event listener untuk memuat 3 post pada saat DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
    await loadMorePosts(3); // Tampilkan 3 post pertama
});

// Tambahkan event listener untuk scroll
window.addEventListener("scroll", handleScroll);

async function upvote(postId) {
    const username = decrypt(localStorage.getItem('USFwxmJoxR'));
    const userRef = doc(db, "users", username);
    const userSnapshot = await getDoc(userRef);

    // Cek apakah user sudah upvote post ini
    if (userSnapshot.exists() && !userSnapshot.data().upVotedPost.includes(postId)) {
        const postRef = doc(db, "posts", postId);
        
        await updateDoc(postRef, {
            upVote: increment(1) // Increment upVote field
        });
        
        // Update user record
        await updateDoc(userRef, {
            upVotedPost: [...userSnapshot.data().upVotedPost, postId] // Tambahkan postId ke upVotedPost
        });
        
        // Ambil elemen untuk mengupdate tampilan
        const upvoteCountElement = document.getElementById(`upvoteCount-${postId}`);
        if (upvoteCountElement) {
            upvoteCountElement.innerText = parseInt(upvoteCountElement.innerText) + 1; // Update tampilan
        }
    } else {
        alert("You have already upvoted this post.");
    }
}


async function downvote(postId) {
    const username = decrypt(localStorage.getItem('USFwxmJoxR'));
    const userRef = doc(db, "users", username);
    const userSnapshot = await getDoc(userRef);

    // Cek apakah user sudah downvote post ini
    if (userSnapshot.exists() && !userSnapshot.data().downVotedPost.includes(postId)) {
        const postRef = doc(db, "posts", postId);
        
        await updateDoc(postRef, {
            downVote: increment(1) // Increment downVote field
        });

        // Update user record
        await updateDoc(userRef, {
            downVotedPost: [...userSnapshot.data().downVotedPost, postId] // Tambahkan postId ke downVotedPost
        });

        // Ambil elemen untuk mengupdate tampilan
        const downvoteCountElement = document.getElementById(`downvoteCount-${postId}`);
        if (downvoteCountElement) {
            downvoteCountElement.innerText = parseInt(downvoteCountElement.innerText) + 1; // Update tampilan
        }
    } else {
        alert("You have already downvoted this post.");
    }
}

