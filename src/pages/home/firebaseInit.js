import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
  
const firebaseConfig = {
    apiKey: "AIzaSyDc4pKLGy9uE7Ks2Gbxeb7TdzOrHYSYPns",
    authDomain: "glorysoft-apps.firebaseapp.com",
    databaseURL: "https://glorysoft-apps.firebaseio.com",
    projectId: "glorysoft-apps",
    storageBucket: "glorysoft-apps.appspot.com",
    messagingSenderId: "864226314542",
    appId: "1:864226314542:web:4cce7bf9a67f50180652bf",
    measurementId: "G-FZ7BSXPLNL"
};
  
firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const auth = firebase.auth();

export { auth };