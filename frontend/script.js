import { storage, ref, uploadBytes, getDownloadURL } from './firebase.js';
const signup = document.querySelector('#signup');
const signin = document.querySelector('#signin');
const form = document.querySelector('form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const repeatPassword = document.querySelector('#repeat-password');
const rememberMe = document.querySelector('#remember-me');
const imgUpload = document.querySelector('#img-upload');
const home = document.querySelector('.home');
const avatarContainer = document.querySelector('.avatar-container');
const points = document.querySelector('.points');
const usernameP = document.querySelector('.username');
const dropdown = document.querySelector('.dropdown');
const userDiv = document.querySelector('.user');
let user = null;

function isDescendant(parent, child) {
  var node = child.parentNode;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

window.addEventListener('DOMContentLoaded', (event) => {
  user = JSON.parse(localStorage.getItem('user')) || null;
  if (user) {
    points.innerHTML = `${user.points} points`;
    usernameP.innerHTML = user.username;
  }
  if (userDiv) {
    userDiv.addEventListener('click', (e) => {
      dropdown.classList.toggle('show');
      const arrow = document.querySelector('#arrow');
      if (arrow.classList.contains('fa-angle-down'))
        arrow.classList.replace('fa-angle-down', 'fa-angle-up');
      else arrow.classList.replace('fa-angle-up', 'fa-angle-down');
    });
  }
});
document.addEventListener('click', (e) => {
  if (dropdown && !isDescendant(userDiv, e.target) && e.target !== userDiv) {
    dropdown.classList.remove('show');
    document
      .querySelector('#arrow')
      .classList.replace('fa-angle-up', 'fa-angle-down');
  }
});

window.onload = () => {
  if (window.location.href.includes('index.html')) {
    home.classList.add('focused');
    document.querySelector('#logout').addEventListener('click', () => {
      localStorage.clear();
      location.href = './login.html';
    });
  }
  user = JSON.parse(localStorage.getItem('user')) || null;
  if (avatarContainer) {
    if (user?.profilePicURL) {
      avatarContainer.innerHTML = `<img src="${user.profilePicURL}"/>`;
    } else {
      avatarContainer.innerHTML = `<i class="fa-solid fa-user"></i>`;
    }
  }

  if (location.href.includes('index.html')) {
    if (!user) {
      location.href = './login.html';
    }
  }
  if (
    location.href.includes('login.html') ||
    location.href.includes('signup.html')
  ) {
    if (user) {
      console.log('sdsf');
      location.href = './index.html';
    }
  }
};

let profilePicBlob = null;
imgUpload &&
  imgUpload.addEventListener('change', function () {
    if (this.files && this.files[0]) {
      profilePicBlob = this.files[0];
      document.querySelector('#upload-text').textContent = this.files[0].name;
    } else {
      document.querySelector('#upload-text').textContent = 'Profile Picture';
    }
  });

const isAlpha = (str) => {
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const lower = str.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    if (!alpha.includes(lower[i])) {
      return false;
    }
  }
  return true;
};
const isNumeric = (str) => {
  const nums = '0123456789';
  for (let i = 0; i < str.length; i++) {
    if (!nums.includes(str[i])) {
      return false;
    }
  }

  return true;
};
const isAlphaNum = (str) => {
  for (let i = 0; i < str.length; i++) {
    if (!isAlpha(str[i]) && !isNumeric(str[i])) {
      return false;
    }
  }
  return true;
};
const isValidUsername = (username) => {
  return (
    username.length > 3 &&
    isAlpha(username[0]) &&
    isAlphaNum(username) &&
    username.length < 30
  );
};
const isValidPassword = (password) => {
  return password.length >= 6 && isAlphaNum(password) && password.length < 30;
};

const alerts = document.querySelector('.alerts');

const showAlert = (text, state = 'true') => {
  const alert = document.createElement('div');
  alert.id = 'alert';
  alert.classList.add('show');
  const icon = document.createElement('i');
  icon.classList.add('fa-solid');
  icon.classList.add(state ? 'fa-circle-check' : 'fa-circle-exclamation');
  const msg = document.createElement('p');
  msg.textContent = text;
  alert.append(icon);
  alert.append(msg);
  alerts.append(alert);
  setTimeout(() => {
    alert.className = alert.className.replace('show', '');
  }, 3000);
};
let responseStatus;
const signupUser = async (e) => {
  try {
    e.preventDefault();
    if (!isValidUsername(username.value))
      throw new Error('Please enter a valid Username.');
    if (!isValidPassword(password.value))
      throw new Error('Please enter a valid Password.');
    if (password.value !== repeatPassword.value)
      throw new Error("Passwords dont't match.");

    const data = {
      username: username.value,
      password: password.value,
      profilePicURL: null,
    };
    if (profilePicBlob) {
      const profilePicRef = ref(storage, `${data.username}/profilePic.jpg`);
      const snapshot = await uploadBytes(profilePicRef, profilePicBlob);
      const url = await getDownloadURL(
        ref(storage, `${data.username}/profilePic.jpg`)
      );
      data.profilePicURL = url;
    }

    const response = await fetch('http://localhost:8000/signup.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    responseStatus = response.status;

    const resp = await response.text();
    if (responseStatus == 500 || responseStatus == 300)
      throw new Error(JSON.parse(resp).message);
    console.log(data);
    setTimeout(() => {
      location.href = './login.html';
    }, 2000);
    showAlert('Sing up successful', true);
  } catch (err) {
    showAlert(err.message, false);
  }
};
const signinUser = async (e) => {
  e.preventDefault();
  try {
    const data = {
      username: username.value,
      password: password.value,
    };
    const response = await fetch('http://localhost:8000/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    responseStatus = response.status;
    const resp = await response.text();
    if (responseStatus == 500 || responseStatus == 300)
      throw new Error(JSON.parse(resp).message);
    user = JSON.parse(resp);
    console.log(user);
    localStorage.setItem('user', JSON.stringify(user));
    setTimeout(() => {
      location.href = './index.html';
    }, 2000);

    showAlert('Sign in successful', true);
  } catch (err) {
    showAlert(err.message, false);
  }
};

signup && signup.addEventListener('click', signupUser);
signin && signin.addEventListener('click', signinUser);
