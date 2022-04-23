import { storage, ref, uploadBytes, getDownloadURL } from './firebase.js';
const signup = document.querySelector('#signup');
const signin = document.querySelector('#signin');
const form = document.querySelector('form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const repeatPassword = document.querySelector('#repeat-password');
const rememberMe = document.querySelector('#remember-me');
const home = document.querySelector('.home');
const imgUpload = document.querySelector('#img-upload');
const imgPostUpload = document.querySelector('#img-post-upload');
const avatarContainer = document.querySelector('.avatar-container');
const points = document.querySelector('.points');
const usernameP = document.querySelector('.username');
const dropdown = document.querySelector('.dropdown');
const userDiv = document.querySelector('.user');
const share = document.querySelector('.share-btn');
const postText = document.querySelector('.post-text');

const sharePoints = 5;
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

window.addEventListener('DOMContentLoaded', (e) => {
  user = JSON.parse(localStorage.getItem('user')) || null;
  console.log(user);
});
window.addEventListener('DOMContentLoaded', async (event) => {
  if (user) {
    points.innerHTML = `${user.points} points`;
    usernameP.innerHTML = user.username;

    const response = await fetch('http://localhost:8000/user.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: user?.username,
    });
    const userData = await response.json();
    localStorage.setItem('user', JSON.stringify(userData));
    user = userData;
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

let posts = [];
const getPosts = async () => {
  try {
    const response = await fetch('http://localhost:8000/posts.php');
    const data = await response.json();
    return data;
  } catch (err) {
    showAlert(err.message, false);
  }
};
{
  /* <i class="fa-solid fa-user"></i> */
}

const createPostElem = (post) => {
  const postDiv = document.createElement('div');
  postDiv.className = 'post';
  postDiv.innerHTML = `
  <div class="post-info">
  <div class="post-header">
    <div class="post-profile-pic-container">
    ${
      post.profilePicUrl
        ? `<img
    src="${post.profilePicUrl}"
  />`
        : '<i class="fa-solid fa-user"></i>'
    }
    </div>
    <div class="post-header-text">
      <p class="post-user">${post.username}</p>
      <span class="post-date">${post.joinedAt}</span>
    </div>
        <div class="post-options ${
          post.username === user.username ? 'show' : ''
        }"><i class="fa-solid fa-ellipsis"></i></div>
  </div>
  <p class="post-text">${post.text}</p>
</div>
${
  post.imageURL &&
  `
<img
  src="${post.imageURL}"
/>`
}
<div class="post-dropdown">
    <div class="post-dropdown-item">
    <i class="fa-solid fa-pen-to-square edit" ></i> Edit
    </div>
    <div class="post-dropdown-item trash" id="${post.postId}" >
    <i class="fa-solid fa-trash" ></i> Delete
    </div>
  </div>`;

  return postDiv;
};
const renderPosts = (posts) => {
  const postsDiv = document.querySelector('.posts');
  posts.forEach((post) => postsDiv.append(createPostElem(post)));
};

const deletePost = async (id) => {
  try {
    const response = await fetch('http://localhost:8000/posts.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: id,
    });
    const resp = await response.text();
    // console.log(resp);
    showAlert('Deleted', true);
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (err) {
    showAlert(err.message, false);
  }
};

window.onload = async () => {
  if (window.location.href.includes('index.html')) {
    const data = await getPosts();
    posts = data;
    console.log(posts);
    renderPosts(posts);
    const trash = document.querySelectorAll('.trash');
    const postDropdown = document.querySelectorAll('.post-dropdown');
    const postOptions = document.querySelectorAll('.post-options');
    for (let i = 0; i < trash.length; i++) {
      trash[i].addEventListener('click', (e) => {
        deletePost(e.target.id);
      });
    }
    for (let i = 0; i < postOptions.length; i++) {
      postOptions[i].addEventListener('click', (e) => {
        postDropdown[i].classList.toggle('show');
      });
      document.addEventListener('click', (e) => {
        if (
          postDropdown[i] &&
          !isDescendant(postOptions[i], e.target) &&
          e.target !== postOptions[i]
        ) {
          postDropdown[i].classList.remove('show');
        }
      });
    }
    home.classList.add('focused');
    document.querySelector('#logout').addEventListener('click', () => {
      localStorage.clear();
      location.href = './login.html';
    });
  }
  if (avatarContainer) {
    if (user?.profilePicUrl) {
      avatarContainer.innerHTML = `<img src="${user.profilePicUrl}"/>`;
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
      location.href = './index.html';
    }
  }
};

let postBlob = null;
imgPostUpload &&
  imgPostUpload.addEventListener('change', () => {
    if (imgPostUpload.files && imgPostUpload.files[0]) {
      postBlob = imgPostUpload.files[0];
      const src = URL.createObjectURL(postBlob);
      const imgContainer = document.querySelector('.post-img-container');
      const img = imgContainer.firstElementChild;
      img.src = src;
      imgContainer.classList.add('show-post-image');
    }
  });

const randId = (l = 10) => {
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  let id = '';
  for (let i = 0; i < l; i++) {
    const r = Math.floor(Math.random() * alpha.length);
    id += alpha[r];
  }
  return id;
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
      const url = await getDownloadURL(profilePicRef);
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
const sharePost = async (e) => {
  try {
    user.points = parseInt(user.points) + sharePoints;

    const data = {
      postId: randId(),
      text: postText.value.trim(),
      username: user?.username,
      imageURL: null,
      points: user.points,
    };
    if (postBlob) {
      const postImageRef = ref(
        storage,
        `${data.username}/posts/${data.postId}.jgp`
      );
      const snapshot = await uploadBytes(postImageRef, postBlob);
      const url = await getDownloadURL(postImageRef);
      data.imageURL = url;
    }
    if (data.text.length === 0 && data.imageURL == null)
      throw new Error('Please type something');

    const response = await fetch('http://localhost:8000/share.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const resp = await response.text();
    showAlert('Shared', true);
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (err) {
    showAlert(err.message, false);
  }
};

signup && signup.addEventListener('click', signupUser);
signin && signin.addEventListener('click', signinUser);
share && share.addEventListener('click', sharePost);
