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
const submitButtonIn = document.getElementById("submitSignIn");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const inPanel = document.getElementById("inPanel");
const passPanel = document.getElementById("passPanel");
const backToLogin = document.getElementById("backToLogin");
const passForm = document.getElementById("passForm");
const upForm = document.getElementById("upForm");
const fpEmailInput = document.getElementById("fpEmail");
const submitButtonFPass = document.getElementById("submitResetPass");

backToLogin.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
  setTimeout(function(){    
    passForm.style.display="none";
    upForm.style.display="contents";
    inPanel.style.display="contents";
    passPanel.style.display="none";
    document.title ="Sign In";
  },2000)
});

backToLogin.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
  setTimeout(function(){    
    passForm.style.display="none";
    upForm.style.display="contents";
    inPanel.style.display="contents";
    passPanel.style.display="none";
    document.title ="Sign In";
  },2000)
});

forgotPasswordBtn.addEventListener("click", () => {
  passForm.style.display="contents";
  upForm.style.display="none";
  passPanel.style.display="contents";
  inPanel.style.display="none";
  document.title = "Forgot Password"
  setTimeout(function(){
    container.classList.add("sign-up-mode");
  },100)
});

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
      errors.push(" 6 characters long,");
  }

  // Cek apakah password mengandung angka
  if (!hasNumber.test(password)) {
      errors.push(" one number (0-9),");
  }

  // Cek apakah password mengandung huruf besar
  if (!hasUppercase.test(password)) {
      errors.push(" one uppercase letter (A-Z),");
  }

  // Cek apakah password mengandung huruf kecil
  if (!hasLowercase.test(password)) {
      errors.push(" one lowercase letter (a-z),");
  }

  // Cek apakah password mengandung karakter spesial
  if (!hasSpecialChar.test(password)) {
      errors.push(" one special character(@#!).");
  }

  // Jika ada kesalahan, tampilkan semua dalam satu alert
  if (errors.length > 0) {
      showMessage("Password Error", "Password must contain at least" + errors.join("\n"), "Up", false);  // Menampilkan error
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
submitButtonFPass.disabled=true;
submitButtonFPass.style.backgroundColor="grey"

// Fungsi untuk memeriksa apakah semua input sudah diisi
function checkFormInputs() {
    console.log(errorCheck);
    // Jika semua input tidak kosong, aktifkan tombol, jika tidak, tetap nonaktifkan
    if (upUsernameInput.value && upEmailInput.value && upPasswordInput.value && upPasswordConfirmInput.value && errorCheck) {
      submitButtonUp.disabled = false; // Aktifkan tombol
      submitButtonUp.style.backgroundColor="#1b3866";
    } else {
      submitButtonUp.disabled = true; // Nonaktifkan tombol
      submitButtonUp.style.backgroundColor="grey";
    }
    if(inEmailInput.value && inPasswordInput.value){
      submitButtonIn.disabled=false;
      submitButtonIn.style.backgroundColor="#1b3866"
    } else {
      submitButtonIn.disabled=true;
      submitButtonIn.style.backgroundColor="grey"
    }
    if(fpEmailInput.value){
      submitButtonFPass.disabled=false;
      submitButtonFPass.style.backgroundColor="crimson"
    } else {
      submitButtonFPass.disabled=true;
      submitButtonFPass.style.backgroundColor="grey"
    }
}

// Tambahkan event listener untuk setiap input
upUsernameInput.addEventListener("input", checkFormInputs);
upEmailInput.addEventListener("input", checkFormInputs);
upPasswordInput.addEventListener("input", checkFormInputs);
upPasswordConfirmInput.addEventListener("input", checkFormInputs);
inPasswordInput.addEventListener("input", checkFormInputs);
inEmailInput.addEventListener("input", checkFormInputs);
fpEmailInput.addEventListener("input", checkFormInputs)

// Mengosongkan semua kolom saat pindah ke signIn/Up
sign_in_btn.addEventListener("click", function(event) {
  event.preventDefault(); // Mencegah reload halaman setelah tombol ditekan

  // Clear semua input setelah submit
  setTimeout(function(){
    upUsernameInput.value = '';
    upEmailInput.value = '';
    upPasswordInput.value = '';
    upPasswordConfirmInput.value = '';
    inEmailInput.value = '';
    inPasswordInput.value = '';
    fpEmailInput.value='';
  },1500)

});


sign_up_btn.addEventListener("click", function(event) {
  event.preventDefault(); // Mencegah reload halaman setelah tombol ditekan

  // Clear semua input setelah submit
  setTimeout(function(){
    upUsernameInput.value = '';
    upEmailInput.value = '';
    upPasswordInput.value = '';
    upPasswordConfirmInput.value = '';
    inEmailInput.value = '';
    inPasswordInput.value = '';
    fpEmailInput.value='';
  },1500)

});

backToLogin.addEventListener("click", function(event) {
  event.preventDefault(); // Mencegah reload halaman setelah tombol ditekan

  // Clear semua input setelah submit
  setTimeout(function(){
    upUsernameInput.value = '';
    upEmailInput.value = '';
    upPasswordInput.value = '';
    upPasswordConfirmInput.value = '';
    inEmailInput.value = '';
    inPasswordInput.value = '';
    fpEmailInput.value='';
  },1500)

});

window.validatePassword = validatePassword;
window.hideMessage = hideMessage;