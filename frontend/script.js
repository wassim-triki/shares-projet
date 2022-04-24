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
const fame = document.querySelector('.fame');
const usernameP = document.querySelector('.username');
const dropdown = document.querySelector('.dropdown');
const userDiv = document.querySelector('.user');
const share = document.querySelector('.share-btn');
const postText = document.querySelector('.post-text');

const shareFame = 5;
const likeFame = 10;
let user = null;
let loggedinUser = null;

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

let likes = null;
let dislikes = null;
const fetchLikes = async () => {
  const response = await fetch('http://localhost:8000/likes.php');
  const likes = await response.json();
  return likes;
};
const fetchDislikes = async () => {
  const response = await fetch('http://localhost:8000/dislikes.php');
  const dislikes = await response.json();
  return dislikes;
};

window.addEventListener('DOMContentLoaded', async (event) => {
  user = JSON.parse(localStorage.getItem('user'));
  if (!user && location.href.includes('/index.html'))
    location.href = './login.html';

  if (location.href.includes('/index.html')) {
    const response = await fetch('http://localhost:8000/user.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: user?.username,
    });
    const userData = await response.json();
    loggedinUser = userData;
    console.log('mysql data: ', loggedinUser);
    fame.innerHTML = `${
      parseInt(loggedinUser.posts) * shareFame +
      parseInt(loggedinUser.likes) * likeFame
    } fame`;
    usernameP.innerHTML = loggedinUser.username;
    likes = await fetchLikes();
    dislikes = await fetchDislikes();
    posts.forEach((p) => {
      const likeBtn = document.querySelector(`#${p.postId}like`);
      const dislikeBtn = document.querySelector(`#${p.postId}dislike`);
      likeBtn.innerHTML = `<i class="fa-regular fa-thumbs-up"></i>`;
      dislikeBtn.innerHTML = '<i class="fa-regular fa-thumbs-down"></i>';
    });
    likes.forEach((l) => {
      const likesSpan = document.querySelector(
        `#${l.postId}like`
      ).nextElementSibling;
      likesSpan.innerHTML = l.likes;
    });
    dislikes.forEach((d) => {
      const dislikesSpan = document.querySelector(
        `#${d.postId}dislike`
      ).nextElementSibling;
      dislikesSpan.innerHTML = d.dislikes;
    });

    const promisesLiked = [];
    likes.forEach((l) => promisesLiked.push(isLiked(l.postId)));
    const resultsLiked = await Promise.all(promisesLiked);
    const likedPosts = likes.filter((l, i) => resultsLiked[i]);
    likedPosts.forEach((l) => {
      const likeBtn = document.querySelector(`#${l.postId}like`);
      likeBtn.innerHTML = `<i class="fa-solid fa-thumbs-up"></i>`;
    });

    const promisesDisliked = [];
    dislikes.forEach((d) => promisesDisliked.push(isDisliked(d.postId)));
    const resultsDisliked = await Promise.all(promisesDisliked);
    const dislikedPosts = dislikes.filter((l, i) => resultsDisliked[i]);
    dislikedPosts.forEach((d) => {
      const dislikeBtn = document.querySelector(`#${d.postId}dislike`);
      dislikeBtn.innerHTML = `<i class="fa-solid fa-thumbs-down"></i>`;
    });
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
      post.profilePicURL
        ? `<img
    src="${post.profilePicURL}"
  />`
        : '<i class="fa-solid fa-user"></i>'
    }
    </div>
    <div class="post-header-text">
      <p class="post-user">${post.username}</p>
      <span class="post-date">${post.joinedAt}</span>
    </div>
        <div class="post-options ${
          post.username === loggedinUser.username ? 'show' : ''
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
<div class="social">
  <div class="social-icon">
    <button type="button" class="social-btn like"  id="${post.postId}like">
    </button>
    <span class="likes" id="${post.postId}">0</span>
  </div>

  <div class="social-icon">
    <button type="button" class="social-btn  dislike" id="${
      post.postId
    }dislike">
    </button>
    <span class="dislikes" id="${post.postId}">0</span>
  </div>
</div>
<div class="post-dropdown">
    <div class="post-dropdown-item edit" id="${post.postId}">
    <i class="fa-solid fa-pen-to-square" ></i> Edit
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

const savePost = async (post) => {
  try {
    const data = {
      postId: post.postId,
      text: postText.value.trim(),
      imageURL: post.imageURL,
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
    const response = await fetch('http://localhost:8000/posts.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const resp = await response.text();
    showAlert('Updated', true);
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (err) {
    showAlert(err.message, false);
  }
};

const editPost = (id) => {
  const [post] = posts.filter((p) => p.postId == id);
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  document.querySelector('.post-text').textContent = post.text;
  if (post.imageURL) {
    document.querySelector('#post-img').src = post?.imageURL;
    const imgContainer = document.querySelector('.post-img-container');
    const btn = document.createElement('button');
    btn.classList.add('btn-times');
    const times = document.createElement('i');
    times.classList.add('fa-solid', 'fa-xmark');
    btn.append(times);
    imgContainer.append(btn);

    imgContainer.classList.add('show-post-image');
    btn.addEventListener('click', (e) => {
      post.imageURL = null;
      document.querySelector('#post-img').src = '';
      imgContainer.classList.remove('show-post-image');
    });
  }
  const save = document.querySelector('.save-btn');
  share.classList.add('hidden');
  save.classList.remove('hidden');
  save.addEventListener('click', (e) => {
    savePost(post);
  });
};
const isLiked = async (postId) => {
  const username = loggedinUser.username;
  const data = {
    postId,
    username,
  };
  try {
    const response = await fetch('http://localhost:8000/checkLiked.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const resp = await response.text();
    const liked = parseInt(resp) > 0;
    return liked;
  } catch (err) {
    showAlert(err.message, false);
  }
};
const isDisliked = async (postId) => {
  const username = loggedinUser.username;
  const data = {
    postId,
    username,
  };
  try {
    const response = await fetch('http://localhost:8000/checkDisliked.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const resp = await response.text();
    const disliked = parseInt(resp) > 0;
    return disliked;
  } catch (err) {
    showAlert(err.message, false);
  }
};
const likePost = async (id) => {
  try {
    const liked = await isLiked(id);
    const disliked = await isDisliked(id);
    if (liked) {
      // remove dislike
      const response = await fetch('http://localhost:8000/unlike.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id, username: loggedinUser.username }),
      });
      const resp = await response.text();
      const likesSpan = document.querySelector(`#${id}like`).nextElementSibling;
      likesSpan.innerHTML = parseInt(likesSpan.innerHTML) - 1;
      const likeBtn = document.querySelector(`#${id}like`);
      likeBtn.innerHTML = '<i class="fa-regular fa-thumbs-up"></i>';
    }
    if (await isDisliked(id)) {
      const response = await fetch('http://localhost:8000/undislike.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id, username: loggedinUser.username }),
      });
      const resp = await response.text();
      const dislikesSpan = document.querySelector(
        `#${id}dislike`
      ).nextElementSibling;
      dislikesSpan.innerHTML = parseInt(dislikesSpan.innerHTML) - 1;
      const dislikeBtn = document.querySelector(`#${id}dislike`);
      dislikeBtn.innerHTML = '<i class="fa-regular fa-thumbs-down"></i>';
    }
    if (!liked || disliked) {
      //add like
      const response = await fetch('http://localhost:8000/like.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id, username: loggedinUser.username }),
      });
      const resp = await response.text();
      const likesSpan = document.querySelector(`#${id}like`).nextElementSibling;
      likesSpan.innerHTML = parseInt(likesSpan.innerHTML) + 1;
      const likeBtn = document.querySelector(`#${id}like`);
      likeBtn.innerHTML = '<i class="fa-solid fa-thumbs-up"></i>';
    }
  } catch (err) {
    showAlert(err.message, false);
  }
};
const dislikePost = async (id) => {
  try {
    const disliked = await isDisliked(id);
    const liked = await isLiked(id);
    if (disliked) {
      //remove like
      const response = await fetch('http://localhost:8000/undislike.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id, username: loggedinUser.username }),
      });
      const resp = await response.text();
      const dislikesSpan = document.querySelector(
        `#${id}dislike`
      ).nextElementSibling;
      dislikesSpan.innerHTML = parseInt(dislikesSpan.innerHTML) - 1;
      const dislikeBtn = document.querySelector(`#${id}dislike`);
      dislikeBtn.innerHTML = '<i class="fa-regular fa-thumbs-down"></i>';
    }
    if (await isLiked(id)) {
      const response = await fetch('http://localhost:8000/unlike.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id, username: loggedinUser.username }),
      });
      const resp = await response.text();
      const likesSpan = document.querySelector(`#${id}like`).nextElementSibling;
      likesSpan.innerHTML = parseInt(likesSpan.innerHTML) - 1;
      const likeBtn = document.querySelector(`#${id}like`);
      likeBtn.innerHTML = '<i class="fa-regular fa-thumbs-up"></i>';
    }
    if (!disliked || liked) {
      //add dislike
      const response = await fetch('http://localhost:8000/dislike.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id, username: loggedinUser.username }),
      });
      const resp = await response.text();
      const dislikesSpan = document.querySelector(
        `#${id}dislike`
      ).nextElementSibling;
      dislikesSpan.innerHTML = parseInt(dislikesSpan.innerHTML) + 1;
      const likeBtn = document.querySelector(`#${id}dislike`);
      likeBtn.innerHTML = '<i class="fa-solid fa-thumbs-down"></i>';
    }
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
    const likes = document.querySelectorAll('.like');
    const dislikes = document.querySelectorAll('.dislike');
    for (let i = 0; i < likes.length; i++) {
      likes[i].addEventListener('click', (e) => {
        likePost(likes[i].id.replace('like', ''));
      });
    }
    for (let i = 0; i < dislikes.length; i++) {
      dislikes[i].addEventListener('click', (e) => {
        dislikePost(dislikes[i].id.replace('dislike', ''));
      });
    }
    const trash = document.querySelectorAll('.trash');
    const edit = document.querySelectorAll('.edit');
    const postDropdown = document.querySelectorAll('.post-dropdown');
    const postOptions = document.querySelectorAll('.post-options');
    for (let i = 0; i < trash.length; i++) {
      trash[i].addEventListener('click', (e) => {
        deletePost(e.target.id);
      });
      edit[i].addEventListener('click', (e) => {
        editPost(e.target.id);
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
    if (loggedinUser?.profilePicURL) {
      avatarContainer.innerHTML = `<img src="${loggedinUser.profilePicURL}"/>`;
    } else {
      avatarContainer.innerHTML = `<i class="fa-solid fa-user"></i>`;
    }
  }

  if (location.href.includes('index.html')) {
    if (!loggedinUser) {
      location.href = './login.html';
    }
  }
  if (
    location.href.includes('login.html') ||
    location.href.includes('signup.html')
  ) {
    if (loggedinUser) {
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

    loggedinUser = JSON.parse(resp);
    localStorage.setItem(
      'user',
      JSON.stringify({ username: loggedinUser.username })
    );
    setTimeout(() => {
      location.href = './index.html';
    }, 1000);

    showAlert('Sign in successful', true);
  } catch (err) {
    showAlert(err.message, false);
  }
};
const sharePost = async (e) => {
  try {
    const data = {
      postId: randId(),
      text: postText.value.trim(),
      username: loggedinUser?.username,
      imageURL: null,
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
