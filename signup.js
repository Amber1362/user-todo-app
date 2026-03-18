//Supabase URL and KEY
let supabaseUrl = 'https://xjuiodjohmyjivbnrclv.supabase.co';
let supabaseKey = 'sb_publishable_OU4dAJXrbLoVFMoGWJBKZg_ULVqKZFi';

//FrontEnd to BackEnd connector
let supaBase = window.supabase.createClient(supabaseUrl, supabaseKey);

let signUpPage = document.getElementById('signupPage');
let nameInput = document.getElementById('name');
let emailInput = document.getElementById('email');
let password = document.getElementById('password');
let confirmPassword = document.getElementById('confirmPassword');
let createButton = document.getElementById('button');

    let nameAlert = document.getElementById('nameAlert');
    let emailAlert = document.getElementById('emailAlert');
    let passwordAlert = document.getElementById('passwordAlert');
    let confirmPasswordAlert = document.getElementById('confirmPasswordAlert');

async function signUp() {
    let userName = nameInput.value;
    let userEmail = emailInput.value;
    let userPassword = password.value;
    let userConfirmPassword = confirmPassword.value;
    let regexName = /^[a-zA-Z][a-zA-Z0-9]*$/;
    let regexEmail = /^[A-Za-z\d]+(?:[.+-][a-zA-Z\d]+)*@[a-zA-Z\d]+\.[a-zA-Z0-9]{2,}$/;
    let validate = true;

     if(!userName && !userEmail && !userPassword && !userConfirmPassword) {
        nameAlert.textContent = 'Enter the name.';
        emailAlert.textContent = 'Enter the email.';
        passwordAlert.textContent = 'Enter the password.';
        confirmPasswordAlert.textContent = 'Enter the confirm password.';
        validate = false
        return;
    }

    if(!userName) {
       nameAlert.textContent = 'Enter the name.';
        validate = false;
    } else if(!regexName.test(userName)) {
        nameAlert.textContent = 'Enter valid name.';
        validate = false;
    }

    if(!userEmail) {
        emailAlert.textContent = 'Enter the email.';
        validate = false; 
    } else if(!regexEmail.test(userEmail)) {
        emailAlert.textContent = 'Enter valid email.';
        validate = false;
    }

    if(!userPassword) {
        passwordAlert.textContent = 'Enter the password.';
        validate = false;
    } else if(userPassword.length < 8) {
        passwordAlert.textContent = 'Password must be at least 8 characters.';
        validate = false;
    }

    if(!userConfirmPassword) {
        confirmPasswordAlert.textContent = 'Enter the confirm password.';
        validate = false;
    }

    if(userPassword !== userConfirmPassword) {
        confirmPasswordAlert.textContent = 'Password do not match.';
        validate = false;
        return;
    }

    if(!validate) return;

    const {data, error} = await supaBase.auth.signUp({
        email: userEmail,
        password: userPassword,
        options: {
            data: {
                name: userName,
            }
        }
    })

    window.location.href = 'login.html'
}

nameInput.addEventListener('input', () => {
    if(nameInput.value !== '') {
        nameAlert.textContent = '';
    }
})

emailInput.addEventListener('input', () => {
    if(emailInput.value !== '') {
        emailAlert.textContent = '';
    }
})

password.addEventListener('input', () => {
    if(password.value !== '') {
        passwordAlert.textContent = '';
    }
})

confirmPassword.addEventListener('input', () => {
    if(confirmPassword.value !== '') {
        confirmPasswordAlert.textContent = '';
    }
})

signUpPage.addEventListener('submit', async (e) => {
    e.preventDefault();
    createButton.disabled = true;
    createButton.textContent = 'Creating...';
    await signUp();
    createButton.disabled = false;
    createButton.textContent = 'Create ➜'
});