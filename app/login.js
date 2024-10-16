const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const upUsernameInput = document.getElementById("rUsername");
const upEmailInput = document.getElementById("rEmail");
const upPasswordInput = document.getElementById("rPassword");
const upPasswordConfirmInput = document.getElementById("rPasswordConfirm");
const inEmailInput = document.getElementById("inEmail");
const inPasswordInput = document.getElementById("inPassword");
const submitButtonUp = document.getElementById("submitSignUp");
const submitButtonIn = document.getElementById("submitSignIn")

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
  document.title = "Sign Up"
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
  document.title = "Sign In"
});

function showMessage(mTitle, mDesc, divId, stat){
  var messageDiv=document.getElementById("message"+divId);
  var messageTitle=document.getElementById('titleMessage'+divId);
  var messageDesc=document.getElementById('descMessage'+divId);
  var alert=document.querySelector('.redAlert'+divId)
  var check=document.querySelector('.greenCheck'+divId)
  messageDiv.style.display="block";
  messageTitle.innerHTML=mTitle;
  messageDesc.innerHTML=mDesc;
  messageDiv.style.opacity=1;
  if(stat){
      alert.style.display="none";
      check.style.display="block";
  }
  else{
      check.style.display="none";
      alert.style.display="block";
  }
}

var errorCheck;

function validatePassword() {
  const password = document.getElementById("rPassword").value;
  
  // Array untuk menyimpan pesan kesalahan
  let errors = [];

  // Regex untuk validasi password
  const hasNumber = /\d/;               // Mengandung angka
  const hasUppercase = /[A-Z]/;          // Mengandung huruf besar
  const hasLowercase = /[a-z]/;          // Mengandung huruf kecil
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // Mengandung karakter spesial
  const minLength = 6;

  // Cek panjang password
  if (password.length < minLength) {
      errors.push("Password must be at least 6 characters long.");
  }

  // Cek apakah password mengandung angka
  if (!hasNumber.test(password)) {
      errors.push("Password must contain at least one number (0-9).");
  }

  // Cek apakah password mengandung huruf besar
  if (!hasUppercase.test(password)) {
      errors.push("Password must contain at least one uppercase letter (A-Z).");
  }

  // Cek apakah password mengandung huruf kecil
  if (!hasLowercase.test(password)) {
      errors.push("Password must contain at least one lowercase letter (a-z).");
  }

  // Cek apakah password mengandung karakter spesial
  if (!hasSpecialChar.test(password)) {
      errors.push("Password must contain at least one special character.");
  }

  // Jika ada kesalahan, tampilkan semua dalam satu alert
  if (errors.length > 0) {
      showMessage("Password Error", errors.join("\n"), "Up", false);  // Menampilkan error
      errorCheck = false;
  } else {
      showMessage("Password Valid", "Your password is strong and valid.", "Up", true);  // Tampilkan validasi sukses
      errorCheck = true;
  }
}

function hideMessage(){
  var messageDiv=document.getElementById("messageUp");
  messageDiv.style.display='none';
}

// Nonaktifkan tombol secara default saat halaman pertama kali dimuat
submitButtonUp.disabled = true;
submitButtonUp.style.backgroundColor="grey";
submitButtonIn.disabled = true;
submitButtonIn.style.backgroundColor="grey";

// Fungsi untuk memeriksa apakah semua input sudah diisi
function checkFormInputs() {
    console.log(errorCheck);
    // Jika semua input tidak kosong, aktifkan tombol, jika tidak, tetap nonaktifkan
    if (upUsernameInput.value && upEmailInput.value && upPasswordInput.value && upPasswordConfirmInput.value && errorCheck) {
      submitButtonUp.disabled = false; // Aktifkan tombol
      submitButtonUp.style.backgroundColor="#7cb518";
    } else {
      submitButtonUp.disabled = true; // Nonaktifkan tombol
      submitButtonUp.style.backgroundColor="grey";
    }
    if(inEmailInput.value && inPasswordInput.value){
      submitButtonIn.disabled=false;
      submitButtonIn.style.backgroundColor="#a514a5"
    } else {
      submitButtonIn.disabled=true;
      submitButtonIn.style.backgroundColor="grey"
    }
}

// Tambahkan event listener untuk setiap input
upUsernameInput.addEventListener("input", checkFormInputs);
upEmailInput.addEventListener("input", checkFormInputs);
upPasswordInput.addEventListener("input", checkFormInputs);
upPasswordConfirmInput.addEventListener("input", checkFormInputs);
inPasswordInput.addEventListener("input", checkFormInputs);
inEmailInput.addEventListener("input", checkFormInputs);

// Mengosongkan semua kolom saat pindah ke signIn/Up
sign_in_btn.addEventListener("click", function(event) {
  event.preventDefault(); // Mencegah reload halaman setelah tombol ditekan

  // Clear semua input setelah submit
  upUsernameInput.value = '';
  upEmailInput.value = '';
  upPasswordInput.value = '';
  upPasswordConfirmInput.value = '';
  inEmailInput.value = '';
  inPasswordInput.value = '';

});

sign_up_btn.addEventListener("click", function(event) {
  event.preventDefault(); // Mencegah reload halaman setelah tombol ditekan

  // Clear semua input setelah submit
  upUsernameInput.value = '';
  upEmailInput.value = '';
  upPasswordInput.value = '';
  upPasswordConfirmInput.value = '';
  inEmailInput.value = '';
  inPasswordInput.value = '';

});



window.validatePassword = validatePassword;
window.hideMessage = hideMessage;