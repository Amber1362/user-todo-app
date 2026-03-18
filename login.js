//Supabase URL and KEY
let supabaseUrl = 'https://xjuiodjohmyjivbnrclv.supabase.co';
let supabaseKey = 'sb_publishable_OU4dAJXrbLoVFMoGWJBKZg_ULVqKZFi';

//FrontEnd to BackEnd connector
let supaBase = window.supabase.createClient(supabaseUrl, supabaseKey);

let loginPage = document.getElementById('loginPage');
let inputEmail = document.getElementById('email');
let inputPassword = document.getElementById('password');
let loginButton = document.getElementById('loginButton');

let emailAlert = document.getElementById('emailAlert');
let passwordAlert = document.getElementById('passwordAlert');

async function login() {
     let userEmail = inputEmail.value;
     let userPassword = inputPassword.value;
     let validate = true;

     let regexEmail = /^[A-Za-z\d]+(?:[.+-][a-zA-Z\d]+)*@[a-zA-Z\d]+\.[a-zA-Z0-9]{2,}$/;

     if(!userEmail && !userPassword) {
         emailAlert.textContent = 'Enter the email.';
         passwordAlert.textContent = 'Enter the password.';
         return;
     }

     if(!userEmail) {
        emailAlert.textContent = 'Enter the email.';
        validate = false;
     } else if(!regexEmail.test(userEmail)) {
        emailAlert.textContent = 'Enter valid email.'
        validate = false;
     }

     if(!userPassword) {
        passwordAlert.textContent = 'Enter the password.';
        validate = false;
     } else if(userPassword.length < 8) {
        passwordAlert.textContent = 'Password must be at least 8 characters.';
        validate = false;
     }

     if(!validate) return;

     const {data, error} = await supaBase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword
     })

     if(error) {
        emailAlert.textContent = error.message;
        return
     }

     console.log('error:', error)
console.log('data:', data)
     window.location.href = 'index.html';
}

inputEmail.addEventListener('input', () => {
     if(!inputEmail.value !== '') {
        emailAlert.textContent = '';
     }
})

inputPassword.addEventListener('input', () => {
     if(!inputPassword.value !== '') {
        passwordAlert.textContent = '';
     }
})

loginPage.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginButton.disabled = true;
    loginButton.textContent = 'logging in...';
    await login();
    loginButton.disabled = false;
    loginButton.textContent = 'Login ➜';
})