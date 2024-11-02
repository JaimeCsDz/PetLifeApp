import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyCztnU8ULNmmjfbnfTeqZk0OeYnimjRrZI",
  authDomain: "petlife-55183.firebaseapp.com",
  projectId: "petlife-55183",
  storageBucket: "petlife-55183.firebasestorage.app",
  messagingSenderId: "12075284424",
  appId: "1:12075284424:web:e2f52a79c3feb53e76b2fd"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
