import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAnUu2WB9FjpjpVD_WfJYfA2_meGPIVv04',
  authDomain: 'shares-ae9e0.firebaseapp.com',
  projectId: 'shares-ae9e0',
  storageBucket: 'shares-ae9e0.appspot.com',
  messagingSenderId: '315560855371',
  appId: '1:315560855371:web:b7439a459227092b738ace',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create a root reference
const storage = getStorage();

export { storage, ref, uploadBytes, getDownloadURL };
