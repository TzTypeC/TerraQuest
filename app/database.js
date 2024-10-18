import fs from 'node:fs'

// Fungsi untuk membaca data dari file array.json
function readData() {
    try {
        const fileData = readFileSync('database.json', 'utf8');
        return JSON.parse(fileData);  // Mengonversi string JSON menjadi objek
    } catch (err) {
        // Jika file tidak ditemukan atau tidak bisa dibaca, kembalikan struktur dasar
        return {
            users: {},
            posts: [] 
        };
    }
}

function saveData(data) {
    writeFileSync('database.json', JSON.stringify(data, null, 2), 'utf8');
}

export function createUser(uid, username) {
    let data = readData();

    // Jika user dengan uid belum ada, tambahkan user baru
    if (!data.users[uid]) {
        data.users[uid] = {
            username: username,
            postId: [],
            exp: 0,
            followers: [],
            following: [],
            guildId: "",
            totalPost: 0
        };
    }


    saveData(data);
}