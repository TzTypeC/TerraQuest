import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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

// Fungsi untuk mengambil jumlah post dan dokumen dari Firestore
async function fetchPosts() {
    const postDataDoc = doc(db, "posts", "postData");
    const postDataSnapshot = await getDoc(postDataDoc);
    const lastPost = postDataSnapshot.data().lastPost; // Ambil jumlah post

    const postsCollection = collection(db, "posts");
    const postsSnapshot = await getDocs(postsCollection);
    const posts = postsSnapshot.docs
        .filter(doc => doc.id !== "postData") // Filter dokumen postData jika ada di koleksi
        .map(doc => ({ id: doc.id, ...doc.data() }));

    // Acak urutan post
    const randomizedPosts = shuffleArray(posts);

    randomizedPosts.forEach(post => {
        generatePostTemplate(post);
    });
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
                  <h2
            class="text-lg pb-2 font-medium text-gray-900"
          >
              Posted by <span class="underline text-xl inline">${post.author}</span>

          </h2>

          <!-- Post Images-->
          <div class="flex flex-col md:flex-row items-center w-full">
            <div class="h-[270px] w-full md:h-[540px] md:w-1/2">
              <label class="cursor-pointer relative">
                <input
                  type="checkbox"
                  value=""
                  class="peer sr-only absolute left-1/2 bottom-1/2"
                />
                <img
                  alt=""
                  src="${post.fsImg}"
                  class="h-full w-full object-cover object-center rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl shadow-xl peer-checked:object-contain"
                />
              </label>
            </div>
            <div class="h-[270px] w-full md:h-[540px] md:w-1/2">
              <label class="cursor-pointer relative">
                <input
                  type="checkbox"
                  value=""
                  class="peer sr-only absolute left-1/2 bottom-1/2"
                />
                <img
                  alt=""
                  src="${post.scImg}"
                  class="h-full w-full object-cover object-center rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl shadow-xl peer-checked:object-contain"
                />
              </label>
            </div>
          </div>

          <!-- Post Title & Description -->
          <div>
            <div class="px-8 py-4">
              <a href="#">
                <h3 class="text-3xl font-medium text-gray-900">
                  ${post.title}
                </h3>
              </a>
              <p class="mt-2 line-clamp-3 text-lg/relaxed text-gray-500">
              ${post.desc}
              </p>
            </div>
          </div>

          <!-- Upvote / Downvote Button -->
          <div class="flex items-center space-x-4 float-right">
            <button class="p-2 group border rounded-full hover:bg-[#00d89e]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 stroke-tq-dcyan group-hover:stroke-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <span class="text-2xl font-bold">0</span>
            <button class="p-2 group border rounded-full hover:bg-rose-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 stroke-rose-500 group-hover:stroke-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
              />
              </svg>
            </button>
          </div>
    `;

    // Sisipkan artikel ke dalam elemen yang diinginkan di DOM
    document.getElementById("contentForum").appendChild(articleContainer);
}

// Panggil fungsi untuk mengambil artikel saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchPosts);